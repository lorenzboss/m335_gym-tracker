import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  createOutline,
  fitnessOutline,
  homeOutline,
  settingsOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      homeOutline,
      fitnessOutline,
      createOutline,
      settingsOutline,
    });
  }
}
