import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  globeOutline,
  mailOutline,
  pencilOutline,
  trashOutline,
} from 'ionicons/icons';
import { GymService } from '../gym.service';
import { Gym } from '../models/gym.model';
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
  gyms: Gym[] = [];
  darkMode = false;
  notificationsEnabled = false;
  notificationFrequency: Frequency = 'daily';

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

  async refreshLogs(event?: any) {
    try {
      await this.loadGyms();

      if (event) {
        event.target.complete();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Gyms:', error);
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
            if (gymName) {
              this.addGym(gymName);
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
          value: gym.name, // Pre-fill with the current name of the gym
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
            if (newName) {
              this.updateGym(gym, newName);
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
}
