import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalNotifications } from '@capacitor/local-notifications';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { globeOutline, mailOutline } from 'ionicons/icons';

type Frequency = 'daily' | 'weekly' | 'monthly';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SettingsPage implements OnInit {
  darkMode: boolean = false;
  notificationsEnabled: boolean = false;
  notificationFrequency: Frequency = 'daily'; // Default is daily

  constructor() {
    addIcons({
      mailOutline,
      globeOutline,
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  // Speichert die Einstellungen des Nutzers
  loadSettings() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotificationsEnabled =
      localStorage.getItem('notificationsEnabled') === 'true';
    const savedFrequency =
      (localStorage.getItem('notificationFrequency') as Frequency) || 'daily';

    this.darkMode = savedDarkMode;
    this.notificationsEnabled = savedNotificationsEnabled;
    this.notificationFrequency = savedFrequency;
  }

  // Umschaltet den Dark Mode
  toggleDarkMode() {
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    localStorage.setItem('darkMode', String(this.darkMode));
  }

  // Umschaltet die Benachrichtigungen
  async toggleNotifications() {
    localStorage.setItem(
      'notificationsEnabled',
      String(this.notificationsEnabled)
    );

    if (this.notificationsEnabled) {
      await this.scheduleWelcomeNotification();
      this.scheduleRegularNotifications();
    } else {
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] }); // Cancel the scheduled notifications
    }
  }

  // Setzt die Häufigkeit der Benachrichtigungen
  setNotificationFrequency() {
    localStorage.setItem('notificationFrequency', this.notificationFrequency);
    this.scheduleRegularNotifications();
  }

  // Sendet eine Benachrichtigung zur Begrüßung
  async scheduleWelcomeNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Welcome!',
          body: 'Thank you for using the app!',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) }, // Send immediately
          sound: 'beep.wav',
        },
      ],
    });
  }

  // Plant regelmäßige Benachrichtigungen basierend auf der Häufigkeit
  async scheduleRegularNotifications() {
    const frequencyMap: Record<Frequency, number> = {
      daily: 24 * 60 * 60 * 1000, // Daily
      weekly: 7 * 24 * 60 * 60 * 1000, // Weekly
      monthly: 30 * 24 * 60 * 60 * 1000, // Monthly
    };

    const interval = frequencyMap[this.notificationFrequency];

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Reminder',
          body: 'This is your regular reminder!',
          id: 2,
          schedule: { at: new Date(Date.now() + interval) }, // Schedule based on interval
          sound: 'beep.wav',
        },
      ],
    });
  }
}
