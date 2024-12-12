import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.initializeDarkMode();
  }

  private async initializeDarkMode() {
    const isDarkMode = await this.themeService.getDarkMode();
    document.documentElement.classList.toggle('ion-palette-dark', isDarkMode);
  }
}
