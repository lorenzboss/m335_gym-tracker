import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { ImageService } from '../image.service';
import { LogsService } from '../logs.service';
import { GymLog } from '../models/gym-log.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NewPage {
  selectedGymLocation: string = '';
  gymLocations: string[] = [
    'Fitness Studio Basel',
    'Gym Zürich',
    'CrossFit Bern',
  ];
  photoUrl: string | null = null;
  comment: string = '';

  constructor(
    private logsService: LogsService,
    private imageService: ImageService
  ) {}

  async takePhoto() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (photo?.dataUrl) {
      this.photoUrl = photo.dataUrl;
    }
  }

  async saveLog() {
    try {
      let photoUrl = null;

      if (this.photoUrl) {
        const dateTime = new Date().toISOString();
        const mimeType = this.getMimeTypeFromDataUrl(this.photoUrl);
        const fileExtension = mimeType.split('/')[1];
        const fileName = `${dateTime}_photo.${fileExtension}`;

        const file = this.dataUrlToFile(this.photoUrl, fileName);
        photoUrl = await this.imageService.uploadImage(file);
      }

      const newLog: GymLog = {
        date: new Date().toISOString(),
        gymLocation: this.selectedGymLocation,
        photoUrl: photoUrl,
        notes: this.comment,
      };

      await this.logsService.addLog(newLog);
      console.log('Log erfolgreich erstellt!');
    } catch (error) {
      console.error('Fehler beim Speichern des Logs:', error);
    }
  }

  getMimeTypeFromDataUrl(dataUrl: string): string {
    const match = dataUrl.match(/^data:(.*?);/);
    return match ? match[1] : 'image/png';
  }

  dataUrlToFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match) {
      throw new Error('Ungültige Data-URL: Kein MIME-Typ gefunden');
    }

    const mime = match[1];
    const byteString = atob(arr[1]);

    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }

    return new File([ab], fileName, { type: mime });
  }
}
