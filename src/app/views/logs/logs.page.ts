import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { GymService } from 'src/app/services/gym.service';
import { LogsService } from 'src/app/services/logs.service';
import { GymLog } from '../../models/gym-log.model';
import { Gym } from '../../models/gym.model';
import { FormatDatePipe } from '../../shared/format-date.pipe';
import { EditLogPage } from '../edit-log/edit-log.page';
import { LogDetailsPage } from '../log-details/log-details.page';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FormatDatePipe],
  providers: [DatePipe],
})
export class LogsPage implements OnInit {
  gyms: Gym[] = [];
  logs: GymLog[] = [];

  constructor(
    private logsService: LogsService,
    private gymService: GymService,
    private datePipe: DatePipe,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ pencilOutline, trashOutline });
  }

  ngOnInit() {
    this.loadLogs();
    this.loadGyms();

    this.route.queryParams.subscribe((params) => {
      if (params['refresh']) {
        this.refresh();

        this.router.navigate([], {
          queryParams: { refresh: null },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  async loadLogs() {
    try {
      this.logs = await this.logsService.getLogs();
    } catch (error) {
      console.error('Fehler beim Laden der Logs:', error);
    }
  }

  async loadGyms() {
    try {
      this.gyms = await this.gymService.getGyms();
    } catch (error) {
      console.error('Fehler beim Laden der Gyms:', error);
    }
  }

  async refresh(event?: any) {
    try {
      await this.loadLogs();
      await this.loadGyms();

      if (event) {
        event.target.complete();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Logs:', error);
      if (event) {
        event.target.complete();
      }
    }
  }

  async editLog(logId: string) {
    const log = this.logs.find((l) => l.id === logId);
    if (!log) return;

    const modal = await this.modalController.create({
      component: EditLogPage,
      componentProps: { log },
    });

    modal.onDidDismiss().then(async (result: { data?: GymLog | null }) => {
      if (result.data) {
        try {
          await this.logsService.updateLog(logId, result.data);
          console.log('Log erfolgreich aktualisiert!');
          await this.refresh();
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Logs:', error);
        }
      }
    });
    await modal.present();
  }

  async confirmDelete(id: string) {
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
          handler: async () => {
            await this.performDeleteLog(id);
          },
        },
      ],
    });

    await alert.present();
  }

  private async performDeleteLog(id: string) {
    try {
      await this.logsService.deleteLog(id);
      await this.refresh();
    } catch (error) {
      console.error('Fehler beim Löschen des Logs:', error);
    }
  }

  getGymName(gymId: string): string | undefined {
    const gym = this.gyms.find((gym) => gym.id == gymId);
    return gym?.name;
  }

  async openLogDetails(logId: string) {
    const log = this.logs.find((l) => l.id === logId);
    if (!log) return;

    const modal = await this.modalController.create({
      component: LogDetailsPage,
      componentProps: {
        log: { ...log, gym_name: this.getGymName(log.gym_id) },
      },
    });

    await modal.present();
  }
}
