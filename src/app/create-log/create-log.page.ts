import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
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
  selectedDateTime: Date = new Date();

  constructor(
    private logsService: LogsService,
    private imageService: ImageService,
    private router: Router
  ) {
    addIcons({
      cameraOutline,
    });
  }

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

      const newLog: GymLog = {
        date: this.selectedDateTime,
        gym_id: this.selectedGymLocation,
        photo_url: photoUrl,
        comment: this.comment,
      };

      await this.logsService.addLog(newLog);
      console.log('Log erfolgreich erstellt!');

      this.resetForm();

      this.router.navigate(['/tabs/logs'], { queryParams: { refresh: true } });
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

  resetForm(): void {
    this.selectedGymLocation = '';
    this.photoUrl = null;
    this.comment = '';
    this.selectedDateTime = new Date();
  }

  isFormValid(): boolean {
    return (
      !!this.selectedGymLocation && !!this.photoUrl && !!this.selectedDateTime
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
