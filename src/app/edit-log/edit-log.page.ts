// edit-log.page.ts
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { GymLog } from '../models/gym-log.model';

@Component({
  selector: 'app-edit-log',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './edit-log.page.html',
  styleUrls: ['./edit-log.page.scss'],
})
export class EditLogPage {
  @Input() log!: GymLog;
  updatedLog: Partial<GymLog> = {};

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.updatedLog = { ...this.log };
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  saveChanges() {
    this.modalCtrl.dismiss(this.updatedLog);
  }

  // Bestätigungsdialog für das Löschen
  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Log löschen?',
      message: 'Bist du sicher, dass du dieses Log löschen möchtest?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Löschen',
          handler: () => {
            this.deleteLog();
          },
        },
      ],
    });

    await alert.present();
  }

  // Log löschen
  deleteLog() {
    this.modalCtrl.dismiss(null, 'deleted'); // Schickt 'deleted' als Rückgabewert
  }
}
