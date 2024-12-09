import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  async uploadImage(file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from('gym-photos')
      .upload(file.name, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: publicData } = await supabase.storage
      .from('gym-photos')
      .getPublicUrl(file.name);

    if (!publicData) {
      const publicError = new Error('Failed to retrieve public URL');
      console.error('Error getting public URL:', publicError);
      throw publicError;
    }

    return publicData.publicUrl;
  }
}
