import { Injectable } from '@angular/core';
import { Gym } from './models/gym.model';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class GymService {
  constructor() {}

  async getGyms(): Promise<Gym[]> {
    const { data, error } = await supabase.from('gyms').select('*');

    if (error) {
      console.error('Error fetching gyms:', error);
      throw error;
    }

    return data;
  }

  async getGymById(id: string): Promise<Gym | null> {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching gym by ID:', error);
      return null;
    }

    return data;
  }

  async addGym(gym: Gym): Promise<void> {
    const { error } = await supabase.from('gyms').insert(gym);

    if (error) {
      console.error('Error adding gym:', error);
      throw error;
    }
  }

  async updateGym(id: string, updatedGym: Partial<Gym>): Promise<void> {
    const { error } = await supabase
      .from('gyms')
      .update(updatedGym)
      .eq('id', id);

    if (error) {
      console.error('Error updating gym:', error);
      throw error;
    }
  }

  async deleteGym(id: string): Promise<void> {
    const { error } = await supabase.from('gyms').delete().eq('id', id);

    if (error) {
      console.error('Error deleting gym:', error);
      throw error;
    }
  }
}
