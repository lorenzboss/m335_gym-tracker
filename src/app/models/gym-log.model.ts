// The attributes of GymLog are in snake_case to match the Supabase PostgreSQL table schema
export type GymLog = {
  id?: string;
  user_id?: string;
  created_at?: Date;
  date: Date;
  gym_location: string;
  comment: string;
  photo_url: string;
};
