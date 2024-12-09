import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LogsPage {
  logs = [
    {
      id: 1,
      date: '2024-12-01',
      gymLocation: 'Fitness Studio Basel',
      comment: 'Super Training heute!',
    },
    {
      id: 2,
      date: '2024-12-05',
      gymLocation: 'Power Gym Zürich',
      comment: 'Schweres Beintraining.',
    },
  ];

  constructor() {}

  refreshLogs(event: RefresherCustomEvent) {
    console.log('Refreshing logs...');
    setTimeout(() => {
      console.log('Logs refreshed');
      event.target.complete();
    }, 2000);
  }

  editLog(id: number) {
    console.log(`Editing log with ID: ${id}`);
    // Logik für Bearbeiten hinzufügen
  }
}
