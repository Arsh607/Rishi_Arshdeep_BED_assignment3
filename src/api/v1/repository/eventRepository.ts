import { db } from "../../../../config/firebaseConfig";
import { Event } from "../models/eventModel";

const EVENTS_COLLECTION = "events";
const COUNTERS_COLLECTION = "counters";
const EVENT_COUNTER_DOC = "events";

function formatEventId(n: number) {
  return `evt_${String(n).padStart(6, "0")}`;
}

function docToEvent(id: string, data: FirebaseFirestore.DocumentData): Event {
  return {
    id,
    name: data.name,
    date: data.date,
    capacity: data.capacity,
    registrationCount: data.registrationCount,
    status: data.status,
    category: data.category,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export const eventRepository = {
    async create(data: Omit<Event, "id">): Promise<Event> {
        const counterRef = db.collection(COUNTERS_COLLECTION).doc(EVENT_COUNTER_DOC);

    const created = await db.runTransaction(async (tx) => {
      const counterSnap = await tx.get(counterRef);
      const current = counterSnap.exists ? (counterSnap.data()?.next as number) : 1;

      const id = formatEventId(current);
      const next = current + 1;

      const eventRef = db.collection(EVENTS_COLLECTION).doc(id);

      tx.set(counterRef, { next }, { merge: true });
      tx.set(eventRef, data);

      return { id, ...data };
    });

    return created;
    },

    async getAllWithCount(): Promise<{ events: Event[]; count: number }> {
    const snap = await db.collection(EVENTS_COLLECTION).orderBy("createdAt", "desc").get();
    const events = snap.docs.map((d) => docToEvent(d.id, d.data()));
    return { events, count: snap.size };
    },

    async getById(id: string): Promise<Event | null> {
        const doc = await db.collection(EVENTS_COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return docToEvent(doc.id, doc.data()!);
    },

    async update(id: string, changes: Partial<Omit<Event, "id" | "createdAt">>): Promise<Event | null> {
        const ref = db.collection(EVENTS_COLLECTION).doc(id);

        const existing = await ref.get();
        if (!existing.exists) return null;

        await ref.update(changes);

        const updated = await ref.get();
        return docToEvent(updated.id, updated.data()!);
    },

    async delete(id: string): Promise<boolean> {
        const ref = db.collection(EVENTS_COLLECTION).doc(id);

        const existing = await ref.get();
        if (!existing.exists) return false;

        await ref.delete();
        return true;
    },
};