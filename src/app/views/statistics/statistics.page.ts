import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class StatisticsPage {
  stats = {
    visitsThisWeek: 5,
    lastGymLocation: 'Fitness Studio Basel',
    streak: 3,
    progress: 0.7,
  };

  constructor() {}

  refreshStats(event: RefresherCustomEvent) {
    console.log('Refreshing statistics...');

    // Simuliere das Laden von Daten
    setTimeout(() => {
      console.log('Statistics refreshed');
      event.target.complete(); // Schließe den Refresher
    }, 2000);
  }
}
