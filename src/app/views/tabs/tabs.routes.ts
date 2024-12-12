import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'statistics',
        loadComponent: () =>
          import('../statistics/statistics.page').then((m) => m.StatisticsPage),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('../logs/logs.page').then((m) => m.LogsPage),
      },
      {
        path: 'create-log',
        loadComponent: () =>
          import('../create-log/create-log.page').then((m) => m.CreateLogPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/statistics',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/statistics',
    pathMatch: 'full',
  },
];
