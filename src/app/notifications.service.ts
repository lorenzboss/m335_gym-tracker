import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  PendingLocalNotificationSchema,
} from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

type Frequency = 'daily' | 'weekly' | 'monthly';

interface NotificationsSettings {
  notificationsEnabled: boolean;
  notificationFrequency: Frequency;
}

const titles = [
  'Time to Move!',
  'Crush Your Goals!',
  'Stay Consistent!',
  'Health is Wealth!',
  'You’re Stronger Than Yesterday!',
  'Push Your Limits!',
  'Keep the Momentum!',
  'No Excuses!',
  'Fuel Your Progress!',
  'Log Your Success!',
];

const bodies = [
  'Your future self will thank you for this workout!',
  'Don’t stop now – greatness awaits!',
  'Every rep counts – let’s make today matter!',
  'Your goals are just a workout away – hit the gym!',
  'You’re building more than muscles – you’re building discipline!',
  'Small steps lead to big changes – let’s go!',
  'Stay on track – create a gym log today!',
  'Your consistency is your superpower – keep pushing!',
  'It’s not about being perfect, it’s about being better than yesterday!',
  'Every log is a step closer to your fitness goals!',
];

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
        },
      ],
    });

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'We hope you enjoy our app!',
          body: 'Try to stay active and healthy by using our app!',
          id: 2,
          schedule: { at: new Date(Date.now() + 60000) },
        },
      ],
    });
  }

  async scheduleRegularNotifications(notificationFrequency: Frequency) {
    const now = new Date();
    const nextNotificationTime = new Date();
    nextNotificationTime.setHours(9, 0, 0, 0);

    if (now > nextNotificationTime) {
      nextNotificationTime.setDate(nextNotificationTime.getDate() + 1);
    }

    const intervalMap: Record<Frequency, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
    };

    const intervalDays = intervalMap[notificationFrequency];

    for (let i = 0; i < 10; i++) {
      const notificationTime = new Date(
        nextNotificationTime.getTime() + i * intervalDays * 24 * 60 * 60 * 1000
      );

      await LocalNotifications.schedule({
        notifications: [
          {
            title: titles[i % titles.length],
            body: bodies[i % bodies.length],
            id: 3 + i,
            schedule: { at: notificationTime },
          },
        ],
      });
    }
  }

  async cancelNotifications() {
    try {
      const pending = await LocalNotifications.getPending();

      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications,
        });
        console.log('Successfully canceled all notifications.');
      } else {
        console.log('No pending notifications found.');
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
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

  async getPendingNotifications(): Promise<PendingLocalNotificationSchema[]> {
    const pending = await LocalNotifications.getPending();
    return pending.notifications.sort((a, b) => {
      const dateA = a.schedule?.at ? new Date(a.schedule.at).getTime() : 0;
      const dateB = b.schedule?.at ? new Date(b.schedule.at).getTime() : 0;
      return dateA - dateB;
    });
  }
}
