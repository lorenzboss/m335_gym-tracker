import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./statistics/statistics.page').then((m) => m.StatisticsPage),
  },
  {
    path: 'logs',
    loadComponent: () => import('./logs/logs.page').then((m) => m.LogsPage),
  },
  {
    path: 'create-log',
    loadComponent: () =>
      import('./create-log/create-log.page').then((m) => m.CreateLogPage),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'edit-log',
    loadComponent: () =>
      import('./edit-log/edit-log.page').then((m) => m.EditLogPage),
  },
];
