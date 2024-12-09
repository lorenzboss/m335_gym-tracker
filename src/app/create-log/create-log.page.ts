import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { ImageService } from '../image.service';
import { LogsService } from '../logs.service';
import { GymLog } from '../models/gym-log.model';

@Component({
  selector: 'app-create-log',
  templateUrl: './create-log.page.html',
  styleUrls: ['./create-log.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CreateLogPage {
  selectedGymLocation: string = '';
  gymLocations: string[] = [
    'Fitness Studio Basel',
    'Gym Zürich',
    'CrossFit Bern',
  ];
  photoUrl: string | null = null;
  comment: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  today: string = new Date().toISOString().split('T')[0];
  now: string = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  constructor(
    private logsService: LogsService,
    private imageService: ImageService
  ) {}

  async saveLog(): Promise<void> {
    if (!this.isFormValid()) {
      console.warn('Bitte Standort auswählen und Foto aufnehmen!');
      return;
    }

    try {
      let photoUrl = this.photoUrl;
      if (!photoUrl) {
        console.error('Foto fehlt!');
        return;
      }

      photoUrl = await this.uploadPhotoWithTimestamp(photoUrl);

      const datePart = this.selectedDate.split('T')[0];
      const timePart = this.selectedTime.split('T')[1];
      const combinedDateTime = new Date(`${datePart}T${timePart}`);

      const newLog: GymLog = {
        date: combinedDateTime,
        gym_location: this.selectedGymLocation,
        photo_url: photoUrl,
        comment: this.comment,
      };

      await this.logsService.addLog(newLog);
      console.log('Log erfolgreich erstellt!');
    } catch (error) {
      console.error('Fehler beim Speichern des Logs:', error);
    }
  }

  async takePhoto(): Promise<void> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.photoUrl = photo?.dataUrl || null;
    } catch (error) {
      console.error('Fehler beim Aufnehmen des Fotos:', error);
    }
  }

  isFormValid(): boolean {
    return (
      !!this.selectedGymLocation &&
      !!this.photoUrl &&
      !!this.selectedDate &&
      !!this.selectedTime
    );
  }

  private async uploadPhotoWithTimestamp(dataUrl: string): Promise<string> {
    const dateTime = new Date().toISOString();
    const mimeType = this.imageService.getMimeTypeFromDataUrl(dataUrl); // Verlagerte Logik
    const fileExtension = mimeType.split('/')[1];
    const fileName = `${dateTime}_photo.${fileExtension}`;
    const file = this.imageService.dataUrlToFile(dataUrl, fileName); // Verlagerte Logik

    return await this.imageService.uploadImage(file);
  }
}
