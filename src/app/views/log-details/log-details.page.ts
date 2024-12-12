import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { GymLog } from '../../models/gym-log.model';
import { FormatDatePipe } from '../../shared/format-date.pipe';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.page.html',
  styleUrls: ['./log-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FormatDatePipe],
  providers: [DatePipe],
})
export class LogDetailsPage implements OnInit {
  @Input() log!: GymLog & { gym_name?: string };

  constructor(private modalController: ModalController) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
