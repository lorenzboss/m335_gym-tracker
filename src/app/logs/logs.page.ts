import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
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
  ) {}

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
        event.target.complete(); // Das Event beenden, wenn es existiert
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Logs:', error);
      if (event) {
        event.target.complete(); // Das Event auch im Fehlerfall beenden
      }
    }
  }

  async editLog(logId: string) {
    const log = this.logs.find((l) => l.id === logId);
    if (!log) return;

    const modal = await this.modalController.create({
      component: EditLogPage,
      componentProps: { log }, // Übergabe der Log-Daten
    });

    modal.onDidDismiss().then(async (result: { data?: GymLog | null }) => {
      if (result.data) {
        try {
          await this.logsService.updateLog(logId, result.data);
          await this.refreshLogs(); // Logs neu laden, um die Änderungen anzuzeigen
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Logs:', error);
        }
      }
    });
    await modal.present();
  }

  async deleteLog(logId: string) {
    try {
      await this.logsService.deleteLog(logId);
      await this.refreshLogs(); // Logs neu laden, um das gelöschte Log zu entfernen
    } catch (error) {
      console.error('Fehler beim Löschen des Logs:', error);
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd. MMM yyyy, HH:mm')!;
  }
}
