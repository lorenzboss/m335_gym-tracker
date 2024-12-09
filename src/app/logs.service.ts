import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

export interface GymLog {
  id?: string;
  date: string;
  gymLocation: string;
  photoUrl: string | null;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor() {}

  async getLogs(): Promise<GymLog[]> {
    const { data, error } = await supabase
      .from('gym_logs')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }

    // Mapping der Felder
    const mappedData = data?.map((log: any) => ({
      ...log,
      gymLocation: log.gym_location,
      photoUrl: log.photo_url,
    }));

    return mappedData || [];
  }

  async addLog(log: GymLog): Promise<void> {
    const { error } = await supabase.from('gym_logs').insert({
      date: log.date,
      gym_location: log.gymLocation,
      photo_url: log.photoUrl,
      comment: log.notes,
    });

    if (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  }

  async updateLog(id: string, updatedLog: Partial<GymLog>): Promise<void> {
    const { error } = await supabase
      .from('gym_logs')
      .update(updatedLog)
      .eq('id', id);

    if (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  }

  async deleteLog(id: string): Promise<void> {
    const { error } = await supabase.from('gym_logs').delete().eq('id', id);

    if (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;

    // Bild hochladen
    const { data, error } = await supabase.storage
      .from('gym-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Öffentliche URL abrufen
    const { data: publicData } = await supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    if (!publicData) {
      const publicError = new Error('Failed to retrieve public URL');
      console.error('Error getting public URL:', publicError);
      throw publicError;
    }

    return publicData.publicUrl;
  }
}
