import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { GymLog } from 'src/app/models/gym-log.model';
import { Gym } from 'src/app/models/gym.model';
import { GymService } from 'src/app/services/gym.service';
import { ImageService } from 'src/app/services/image.service';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-create-log',
  templateUrl: './create-log.page.html',
  styleUrls: ['./create-log.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CreateLogPage {
  gyms: Gym[] = [];
  selectedGymLocation: string = '';
  photoUrl: string | null = null;
  comment: string = '';
  selectedDateTime: Date = new Date();
  @ViewChild('dateTimeInput') dateTimeInput!: IonDatetime;

  constructor(
    private gymService: GymService,
    private logsService: LogsService,
    private imageService: ImageService,
    private router: Router
  ) {
    addIcons({
      cameraOutline,
    });
  }

  async ngOnInit() {
    await this.loadGyms();
  }

  async loadGyms() {
    try {
      this.gyms = await this.gymService.getGyms();
    } catch (error) {
      console.error('Fehler beim Laden der Gyms:', error);
    }
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

    if (this.dateTimeInput) {
      this.dateTimeInput.value = new Date().toLocaleString();
    }
  }

  isFormValid(): boolean {
    return (
      !!this.selectedGymLocation && !!this.photoUrl && !!this.selectedDateTime
    );
  }

  private async uploadPhotoWithTimestamp(dataUrl: string): Promise<string> {
    const dateTime = new Date().toISOString();
    const mimeType = this.imageService.getMimeTypeFromDataUrl(dataUrl);
    const fileExtension = mimeType.split('/')[1];
    const fileName = `${dateTime}_photo.${fileExtension}`;
    const file = this.imageService.dataUrlToFile(dataUrl, fileName);

    return await this.imageService.uploadImage(file);
  }

  onDateTimeChange($event: CustomEvent) {
    console.log('onDateTimeChange', $event);
    this.selectedDateTime = new Date($event.detail.value);
  }

  async refresh(event?: any) {
    try {
      await this.loadGyms();

      if (event) {
        event.target.complete();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Gyms:', error);
      if (event) {
        event.target.complete();
      }
    }
  }
}
