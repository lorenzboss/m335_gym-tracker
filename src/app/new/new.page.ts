import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { GymLog, LogsService } from '../logs.service';

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

  constructor(private logsService: LogsService) {}

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
        // Data URL in ein File umwandeln und an uploadImage übergeben
        const file = this.dataUrlToFile(
          this.photoUrl,
          `photo_${Date.now()}.png`
        );
        photoUrl = await this.logsService.uploadImage(file); // Das File an die uploadImage-Methode übergeben
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

  // Hilfsmethode: Data URL in ein File umwandeln
  dataUrlToFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');

    // Überprüfen, ob match() ein Ergebnis zurückgibt
    const match = arr[0].match(/:(.*?);/);
    if (!match) {
      throw new Error('Ungültige Data-URL: Kein MIME-Typ gefunden');
    }

    const mime = match[1];
    const byteString = atob(arr[1]);

    // Einen ArrayBuffer erzeugen und die Byte-Daten hineinschreiben
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }

    // Das File-Objekt erstellen und zurückgeben
    return new File([ab], fileName, { type: mime });
  }
}
