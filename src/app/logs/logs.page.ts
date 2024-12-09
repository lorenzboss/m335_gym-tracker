import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogsService } from '../logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LogsPage implements OnInit {
  logs: any[] = [];

  constructor(private logsService: LogsService) {}

  ngOnInit() {
    this.loadLogs();
  }

  async loadLogs() {
    try {
      this.logs = await this.logsService.getLogs();
    } catch (error) {
      console.error('Fehler beim Laden der Logs:', error);
    }
  }

  async refreshLogs(event: any) {
    try {
      await this.loadLogs();
      event.target.complete();
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Logs:', error);
      event.target.complete();
    }
  }

  editLog(logId: string) {
    console.log(`Edit log with ID: ${logId}`);
    // Navigiere zu einer Bearbeitungsseite oder implementiere das Bearbeiten direkt hier.
    // Beispiel für Navigation:
    // this.router.navigate(['/edit-log', logId]);
  }
}
