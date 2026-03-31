import * as eventService from "../src/api/v1/services/eventService";
import { eventRepository } from "../src/api/v1/repository/eventRepository";
import { AppError } from "../src/api/v1/middleware/AppError";

jest.mock("../src/api/v1/repository/eventRepository", () => ({
  eventRepository: {
    getAllWithCount: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("eventService → eventRepository integration (1 test per function)", () => {
  test("getAll() calls eventRepository.getAllWithCount and returns result", async () => {
    (eventRepository.getAllWithCount as jest.Mock).mockResolvedValue({
      events: [{ id: "evt_000001" }],
      count: 1,
    });

    const result = await eventService.getAll();

    expect(eventRepository.getAllWithCount).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ events: [{ id: "evt_000001" }], count: 1 });
  });

  test("getEventByID() calls eventRepository.getById with id and returns event", async () => {
    (eventRepository.getById as jest.Mock).mockResolvedValue({ id: "evt_000123" });

    const result = await eventService.getEventByID("evt_000123");

    expect(eventRepository.getById).toHaveBeenCalledTimes(1);
    expect(eventRepository.getById).toHaveBeenCalledWith("evt_000123");
    expect(result).toEqual({ id: "evt_000123" });
  });

  test("createEvent() calls eventRepository.create with timestamps", async () => {
    const repoReturn = {
      id: "evt_000001",
      name: "AI Summit",
      date: "2030-12-25T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      status: "active",
      category: "general",
      createdAt: "x",
      updatedAt: "x",
    };

    (eventRepository.create as jest.Mock).mockImplementation(async (data: any) => ({
      id: "evt_000001",
      ...data,
    }));

    const result = await eventService.createEvent({
      name: "AI Summit",
      date: "2030-12-25T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      status: "active",
      category: "general",
    } as any);

    expect(eventRepository.create).toHaveBeenCalledTimes(1);

    const calledWith = (eventRepository.create as jest.Mock).mock.calls[0][0];
    expect(calledWith.createdAt).toBeDefined();
    expect(calledWith.updatedAt).toBeDefined();
    expect(calledWith.name).toBe("AI Summit");
    expect(calledWith.capacity).toBe(100);


    expect(result.id).toBe("evt_000001");
    expect(result.name).toBe("AI Summit");
  });

  test("updateEvent() calls eventRepository.update with updatedAt and returns updated event", async () => {
    (eventRepository.update as jest.Mock).mockImplementation(async (_id: string, changes: any) => ({
      id: "evt_000010",
      name: "Updated Name",
      ...changes,
    }));

    const result = await eventService.updateEvent("evt_000010", { capacity: 150 } as any);

    expect(eventRepository.update).toHaveBeenCalledTimes(1);

    const [idArg, changesArg] = (eventRepository.update as jest.Mock).mock.calls[0];
    expect(idArg).toBe("evt_000010");

    expect(changesArg.updatedAt).toBeDefined();
    expect(changesArg.capacity).toBe(150);

    expect(result.id).toBe("evt_000010");
    expect(result.capacity).toBe(150);
  });

  test("deleteEvent() calls eventRepository.delete with id", async () => {
    (eventRepository.delete as jest.Mock).mockResolvedValue(true);

    await eventService.deleteEvent("evt_000999");

    expect(eventRepository.delete).toHaveBeenCalledTimes(1);
    expect(eventRepository.delete).toHaveBeenCalledWith("evt_000999");
  });
});