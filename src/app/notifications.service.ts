import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

type Frequency = 'daily' | 'weekly' | 'monthly';

interface NotificationsSettings {
  notificationsEnabled: boolean;
  notificationFrequency: Frequency;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() {}

  async getNotificationSettings(): Promise<NotificationsSettings> {
    const settingsValue = await Preferences.get({ key: 'settings' });
    const defaultSettings: NotificationsSettings = {
      notificationsEnabled: false,
      notificationFrequency: 'daily',
    };
    return settingsValue.value
      ? JSON.parse(settingsValue.value)
      : defaultSettings;
  }

  async saveNotificationSettings(
    settings: NotificationsSettings
  ): Promise<void> {
    await Preferences.set({
      key: 'settings',
      value: JSON.stringify(settings),
    });
  }

  async scheduleWelcomeNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Welcome!',
          body: 'Thank you for using the app!',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'beep.wav',
        },
      ],
    });
  }

  async scheduleRegularNotifications(notificationFrequency: Frequency) {
    const intervalMap: Record<Frequency, number> = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Reminder',
          body: 'This is your regular reminder!',
          id: 2,
          schedule: {
            at: new Date(Date.now() + intervalMap[notificationFrequency]),
          },
          sound: 'beep.wav',
        },
      ],
    });
  }

  async cancelNotifications() {
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }, { id: 2 }],
    });
  }

  async toggleNotifications(enabled: boolean, frequency: Frequency) {
    const settings: NotificationsSettings = {
      notificationsEnabled: enabled,
      notificationFrequency: frequency,
    };
    await this.saveNotificationSettings(settings);

    if (enabled) {
      await this.requestNotificationPermission();
      await this.scheduleWelcomeNotification();
      await this.scheduleRegularNotifications(frequency);
    } else {
      await this.cancelNotifications();
    }

    this.checkScheduledNotifications();
  }

  async requestNotificationPermission() {
    try {
      const permission = await LocalNotifications.checkPermissions();
      if (permission.display === 'granted') {
        console.log('Notification permissions already granted.');
        return true;
      }

      const request = await LocalNotifications.requestPermissions();

      if (request.display === 'granted') {
        console.log('Notification permissions successfully granted.');
        return true;
      } else {
        console.error('Notification permissions denied.');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async checkScheduledNotifications() {
    const scheduled = await LocalNotifications.getPending();
    console.log('notification', scheduled.notifications);
  }
}
