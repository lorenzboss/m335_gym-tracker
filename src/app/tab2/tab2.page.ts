import { Component } from '@angular/core';
import { Device } from '@capacitor/device'; // Importiere Device Plugin
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class Tab2Page {
  batteryLevel: number = 0;
  isCharging: boolean = false;

  constructor() {
    // Hole den Akku-Status bei der Initialisierung
    this.getBatteryStatus();

    // Setze ein Intervall, um den Status alle 5 Sekunden zu aktualisieren
    setInterval(() => {
      this.getBatteryStatus();
    }, 5000); // alle 5000ms (5 Sekunden)
  }

  async getBatteryStatus() {
    try {
      const batteryInfo = await Device.getBatteryInfo();
      this.batteryLevel =
        batteryInfo.batteryLevel !== undefined
          ? batteryInfo.batteryLevel * 100
          : 0;
      this.isCharging = batteryInfo.isCharging ?? false;
    } catch (error) {
      console.error('Fehler beim Abrufen des Akku-Status', error);
    }
  }
}
