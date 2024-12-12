import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { globeOutline, mailOutline } from 'ionicons/icons';
import { NotificationsService } from '../notifications.service';
import { ThemeService } from '../theme.service';

type Frequency = 'daily' | 'weekly' | 'monthly';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SettingsPage implements OnInit {
  darkMode = false;
  notificationsEnabled = false;
  notificationFrequency: Frequency = 'daily';

  constructor(
    private themeService: ThemeService,
    private notificationsService: NotificationsService
  ) {
    addIcons({ mailOutline, globeOutline });
  }

  ngOnInit() {
    this.initializeSettings();
  }

  private async initializeSettings() {
    this.darkMode = await this.themeService.getDarkMode();
    this.toggleDarkMode(this.darkMode);

    const settings = await this.notificationsService.getNotificationSettings();
    this.notificationsEnabled = settings.notificationsEnabled;
    this.notificationFrequency = settings.notificationFrequency;
  }

  public async toggleDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    await this.themeService.setDarkMode(isDark);
  }

  async toggleNotifications(enableNotifications: boolean) {
    this.notificationsEnabled = enableNotifications;
    await this.notificationsService.toggleNotifications(
      this.notificationsEnabled,
      this.notificationFrequency
    );
  }

  async setNotificationFrequency() {
    await this.notificationsService.toggleNotifications(
      this.notificationsEnabled,
      this.notificationFrequency
    );
  }
}
