import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { LogsService } from '../logs.service';
import { GymLog } from '../models/gym-log.model';

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
  gymLocations: string[] = [
    'Fitness Studio Basel',
    'Gym Zürich',
    'CrossFit Bern',
  ];

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private logsService: LogsService,
    private router: Router
  ) {
    addIcons({
      trashOutline,
    });
  }

  ngOnInit() {
    this.updatedLog = { ...this.log };
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  saveChanges() {
    this.modalCtrl.dismiss(this.updatedLog);
  }
}
