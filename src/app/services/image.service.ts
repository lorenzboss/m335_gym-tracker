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

  getMimeTypeFromDataUrl(dataUrl: string): string {
    const match = dataUrl.match(/^data:(.*?);/);
    return match ? match[1] : 'image/png';
  }

  dataUrlToFile(dataUrl: string, fileName: string): File {
    const [meta, base64Data] = dataUrl.split(',');
    const mime = meta.match(/:(.*?);/)?.[1];
    if (!mime) {
      throw new Error('Invalid data URL: No MIME type found');
    }
    const byteString = atob(base64Data);
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }
    return new File([buffer], fileName, { type: mime });
  }
}
