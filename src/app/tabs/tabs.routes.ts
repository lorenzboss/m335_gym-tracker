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
        path: 'new',
        loadComponent: () => import('../new/new.page').then((m) => m.NewPage),
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
