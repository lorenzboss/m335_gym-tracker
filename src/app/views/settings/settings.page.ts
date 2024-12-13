import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { AlertController, IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  globeOutline,
  mailOutline,
  pencilOutline,
  trashOutline,
} from 'ionicons/icons';
import { GymService } from 'src/app/services/gym.service';
import { Gym } from '../../models/gym.model';
import { NotificationsService } from '../../services/notifications.service';
import { ThemeService } from '../../services/theme.service';
import { FormatDatePipe } from '../../shared/format-date.pipe';

type Frequency = 'daily' | 'weekly' | 'monthly';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FormatDatePipe],
  providers: [DatePipe],
})
export class SettingsPage implements OnInit {
  gyms: Gym[] = [];
  darkMode = false;
  notificationsEnabled = false;
  notificationFrequency: Frequency = 'daily';
  showNotificationsModal = false;
  pendingNotifications: PendingLocalNotificationSchema[] = [];

  constructor(
    private gymService: GymService,
    private themeService: ThemeService,
    private notificationsService: NotificationsService,
    private alertController: AlertController
  ) {
    addIcons({ mailOutline, globeOutline, pencilOutline, trashOutline });
  }

  async ngOnInit() {
    await this.initializeSettings();
    await this.loadGyms();
  }

  async loadGyms() {
    try {
      this.gyms = await this.gymService.getGyms();
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  }

  async refresh(event?: any) {
    try {
      await this.loadGyms();

      if (event) {
        event.target.complete();
      }
    } catch (error) {
      console.error('Error while updating the gyms:', error);
      if (event) {
        event.target.complete();
      }
    }
  }

  async openAddGymModal() {
    const alert = await this.alertController.create({
      header: 'Add New Gym',
      inputs: [
        {
          name: 'gymName',
          type: 'text',
          placeholder: 'Enter gym name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Add',
          handler: (data) => {
            const gymName = data.gymName;
            if (gymName && /^[a-zA-Z\s]+$/.test(gymName)) {
              this.addGym(gymName);
            } else {
              console.error('Invalid gym name. Only letters are allowed.');
              this.alertController
                .create({
                  header: 'Invalid Input',
                  message: 'Gym name can only contain letters and spaces.',
                  buttons: ['OK'],
                })
                .then((alert) => alert.present());
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async openEditGymModal(gym: Gym) {
    const alert = await this.alertController.create({
      header: 'Edit Gym',
      inputs: [
        {
          name: 'gymName',
          type: 'text',
          value: gym.name,
          placeholder: 'Enter new gym name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Save',
          handler: (data: { gymName: any }) => {
            const newName = data.gymName;
            if (newName && /^[a-zA-Z\s]+$/.test(newName)) {
              this.updateGym(gym, newName);
            } else {
              console.error('Invalid gym name. Only letters are allowed.');
              this.alertController
                .create({
                  header: 'Invalid Input',
                  message: 'Gym name can only contain letters and spaces.',
                  buttons: ['OK'],
                })
                .then((alert) => alert.present());
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async addGym(gymName: string) {
    try {
      await this.gymService.addGym({
        name: gymName,
      });
      await this.loadGyms();
    } catch (error) {
      console.error('Error adding gym:', error);
    }
  }

  async updateGym(gym: Gym, newName: string) {
    try {
      await this.gymService.updateGym(gym.id!, { name: newName });
      await this.loadGyms();
    } catch (error) {
      console.error('Error updating gym:', error);
    }
  }

  async openDeleteGymModal(gym: Gym) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete the gym "${gym.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete canceled');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteGym(gym.id!);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteGym(gymId: string) {
    try {
      await this.gymService.deleteGym(gymId);
      await this.loadGyms();
    } catch (error) {
      console.error('Error deleting gym:', error);
    }
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

  async showPendingNotifications(showPendingNotifications: boolean) {
    this.pendingNotifications =
      await this.notificationsService.getPendingNotifications();

    this.showNotificationsModal = showPendingNotifications;
  }
}
