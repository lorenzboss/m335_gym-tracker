import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GymLog } from 'src/app/models/gym-log.model';
import { Gym } from 'src/app/models/gym.model';
import { GymService } from 'src/app/services/gym.service';
import { LogsService } from 'src/app/services/logs.service';

type Stats = {
  totalVisits: number;
  visitsThisYear: number;
  visitsThisMonth: number;
  visitsThisWeek: number;
  visitsPerGym: { gymName: string; count: number }[];
  mostVisitedGym: { gymName: string; count: number };
  progressThisWeek: number;
};

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class StatisticsPage {
  logs: GymLog[] = [];
  gyms: Gym[] = [];
  stats: Stats = {
    totalVisits: 0,
    visitsThisYear: 0,
    visitsThisMonth: 0,
    visitsThisWeek: 0,
    visitsPerGym: [],
    mostVisitedGym: { gymName: 'N/A', count: 0 },
    progressThisWeek: 0,
  };

  constructor(
    private logsService: LogsService,
    private gymService: GymService
  ) {}

  ngOnInit() {
    this.loadLogs();
    this.loadGyms();
  }

  async loadLogs() {
    try {
      this.logs = await this.logsService.getLogs();
      this.calculateStats();
    } catch (error) {
      console.error('Error while loading the Gym Logs:', error);
    }
  }

  async loadGyms() {
    try {
      this.gyms = await this.gymService.getGyms();
      this.calculateStats();
    } catch (error) {
      console.error('Error while loading the Gyms:', error);
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
      console.error('Error while updating the logs:', error);
      if (event) {
        event.target.complete();
      }
    }
  }

  calculateStats() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );

    this.stats.totalVisits = this.logs.length;
    this.stats.visitsThisYear = this.logs.filter(
      (log) => new Date(log.date) >= startOfYear
    ).length;
    this.stats.visitsThisMonth = this.logs.filter(
      (log) => new Date(log.date) >= startOfMonth
    ).length;
    this.stats.visitsThisWeek = this.logs.filter(
      (log) => new Date(log.date) >= startOfWeek
    ).length;

    const visitsPerGymMap: { [gymId: string]: number } = {};
    this.logs.forEach((log) => {
      visitsPerGymMap[log.gym_id] = (visitsPerGymMap[log.gym_id] || 0) + 1;
    });

    this.stats.visitsPerGym = this.gyms
      .map((gym) => ({
        gymName: gym.name,
        count: visitsPerGymMap[gym.id!] || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    this.stats.mostVisitedGym = this.stats.visitsPerGym.reduce(
      (prev, curr) => (prev.count > curr.count ? prev : curr),
      { gymName: 'N/A', count: 0 }
    );

    const lastWeekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() - 7
    );

    const visitsLastWeek = this.logs.filter(
      (log) =>
        new Date(log.date) >= lastWeekStart && new Date(log.date) < startOfWeek
    ).length;

    const progress =
      ((this.stats.visitsThisWeek - visitsLastWeek) / (visitsLastWeek || 1)) *
      100;

    this.stats.progressThisWeek = Math.round(progress);
  }
}
