import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./views/statistics/statistics.page').then(
        (m) => m.StatisticsPage
      ),
  },
  {
    path: 'logs',
    loadComponent: () =>
      import('./views/logs/logs.page').then((m) => m.LogsPage),
  },
  {
    path: 'create-log',
    loadComponent: () =>
      import('./views/create-log/create-log.page').then((m) => m.CreateLogPage),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./views/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'edit-log',
    loadComponent: () =>
      import('./views/edit-log/edit-log.page').then((m) => m.EditLogPage),
  },
];
