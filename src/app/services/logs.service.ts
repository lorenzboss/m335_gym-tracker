import { Injectable } from '@angular/core';
import { GymLog } from '../models/gym-log.model';
import { supabase } from './supabase.service';

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

    return data;
  }

  async addLog(log: GymLog): Promise<void> {
    console.log('Adding log:', log);
    const { error } = await supabase.from('gym_logs').insert(log);

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
}
