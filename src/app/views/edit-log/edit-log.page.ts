import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { GymLog } from 'src/app/models/gym-log.model';
import { Gym } from 'src/app/models/gym.model';
import { GymService } from 'src/app/services/gym.service';

@Component({
  selector: 'app-edit-log',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './edit-log.page.html',
  styleUrls: ['./edit-log.page.scss'],
})
export class EditLogPage {
  @Input() log!: GymLog;
  updatedLog: Partial<GymLog> = {};
  gyms: Gym[] = [];

  constructor(
    private gymService: GymService,
    private modalCtrl: ModalController
  ) {
    addIcons({
      trashOutline,
    });
  }

  async ngOnInit() {
    this.updatedLog = { ...this.log };
    this.gyms = await this.gymService.getGyms();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  saveChanges() {
    this.modalCtrl.dismiss(this.updatedLog);
  }
}
