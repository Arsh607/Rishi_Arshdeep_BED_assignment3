import request from "supertest";
import app from "../src/app";

jest.mock("../src/api/v1/controllers/eventController", () => ({
  getAllEvents: jest.fn((_req, res) =>
    res.status(200).json({ message: "Events retrieved", count: 0, data: [] })
  ),
  getByID: jest.fn((_req, res) =>
    res.status(200).json({ message: "Event retrieved", data: { id: "evt_000001" } })
  ),
  createEvent: jest.fn((req, res) =>
    res.status(201).json({ message: "Event created", data: { id: "evt_000001", ...req.body } })
  ),
  updateEvent: jest.fn((req, res) =>
    res.status(200).json({ message: "Event updated", data: { id: req.params.id, ...req.body } })
  ),
  deleteEvent: jest.fn((_req, res) =>
    res.status(200).json({ message: "Event deleted" })
  ),
}));

describe("Event validation (Joi + middleware)", () => {
  describe("POST /api/v1/events", () => {
    it("400 when name is missing", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          date: "2030-12-25T09:00:00.000Z",
          capacity: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'Validation error: "name" is required',
      });
    });

    it("400 when name length < 3", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "AB",
          date: "2030-12-25T09:00:00.000Z",
          capacity: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'Validation error: "name" length must be at least 3 characters long'
      );
    });

    it("400 when capacity is missing", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "Test Event",
          date: "2030-12-25T09:00:00.000Z",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error: "capacity" is required');
    });

    it("400 when capacity < 5", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "Small Event",
          date: "2030-12-25T09:00:00.000Z",
          capacity: 4,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'Validation error: "capacity" must be greater than or equal to 5'
      );
    });

    it("400 when capacity is not integer", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "Test Event",
          date: "2030-12-25T09:00:00.000Z",
          capacity: 50.5,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error: "capacity" must be an integer');
    });

    it("400 when date is in the past (must be greater than now)", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "Past Event",
          date: "2000-01-01T00:00:00.000Z",
          capacity: 10,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error: "date" must be greater than "now"');
    });

    it("400 when registrationCount > capacity", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "Overbooked Event",
          date: "2030-12-25T09:00:00.000Z",
          capacity: 100,
          registrationCount: 150,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'Validation error: "registrationCount" must be less than or equal to ref:capacity'
      );
    });

    it("201 + defaults applied when optional fields missing", async () => {
      const res = await request(app)
        .post("/api/v1/events")
        .set("Content-Type", "application/json")
        .send({
          name: "Tech Conference 2030",
          date: "2030-12-25T09:00:00.000Z",
          capacity: 200,
        });

      expect(res.status).toBe(201);

    
      expect(res.body.data.status).toBe("active");
      expect(res.body.data.category).toBe("general");
      expect(res.body.data.registrationCount).toBe(0);
    });
  });

  describe("GET /api/v1/events/:id param validation", () => {
    it("400 when id is wrong format", async () => {
      const res = await request(app)
        .get("/api/v1/events/123")
        .set("Content-Type", "application/json");

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Validation error: "id"');
    });

    it("200 when id format is correct (evt_000001)", async () => {
      const res = await request(app)
        .get("/api/v1/events/evt_000001")
        .set("Content-Type", "application/json");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Event retrieved");
    });
  });

  describe("PUT /api/v1/events/:id validation", () => {
    it("400 when body is empty (min(1))", async () => {
      const res = await request(app)
        .put("/api/v1/events/evt_000001")
        .set("Content-Type", "application/json")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Validation error");
    });

    it("400 when updating capacity to non-integer", async () => {
      const res = await request(app)
        .put("/api/v1/events/evt_000001")
        .set("Content-Type", "application/json")
        .send({ capacity: 10.5 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error: "capacity" must be an integer');
    });

    it("400 when updating registrationCount > capacity (when both provided)", async () => {
      const res = await request(app)
        .put("/api/v1/events/evt_000001")
        .set("Content-Type", "application/json")
        .send({ capacity: 100, registrationCount: 150 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'Validation error: "registrationCount" must be less than or equal to ref:capacity'
      );
    });
  });

  describe("DELETE /api/v1/events/:id param validation", () => {
    it("400 when id is invalid", async () => {
      const res = await request(app)
        .delete("/api/v1/events/evt_123") 
        .set("Content-Type", "application/json");

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Validation error: "id"');
    });
  });
});