import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { EditLogPage } from '../edit-log/edit-log.page';
import { LogsService } from '../logs.service';
import { GymLog } from '../models/gym-log.model';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe],
})
export class LogsPage implements OnInit {
  logs: GymLog[] = [];

  constructor(
    private logsService: LogsService,
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

    this.route.queryParams.subscribe((params) => {
      if (params['refresh']) {
        this.refreshLogs();

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

  async refreshLogs(event?: any) {
    try {
      await this.loadLogs();

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
          await this.refreshLogs();
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Logs:', error);
        }
      }
    });
    await modal.present();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd. MMM yyyy - HH:mm')!;
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
      await this.refreshLogs();
    } catch (error) {
      console.error('Fehler beim Löschen des Logs:', error);
    }
  }
}
