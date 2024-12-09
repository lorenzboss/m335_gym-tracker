// src/app/models/gym-log.model.ts
export type GymLog = {
  id?: string;
  date: string;
  gymLocation: string;
  photoUrl: string | null;
  notes: string;
};
