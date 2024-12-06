import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device'; // Importiere Device Plugin
import { Network } from '@capacitor/network';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class Tab2Page implements OnInit {
  batteryLevel: number = 0;
  isCharging: boolean = false;
  networkStatus: string = 'Unbekannt'; // Initialer Status

  constructor() {
    // Hole den Akku-Status bei der Initialisierung
    this.getBatteryStatus();

    // Setze ein Intervall, um den Akku-Status alle 5 Sekunden zu aktualisieren
    setInterval(() => {
      this.getBatteryStatus();
    }, 5000); // alle 5000ms (5 Sekunden)
  }

  ngOnInit() {
    // Listener für Netzwerkstatusänderungen
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed:', status);
      this.networkStatus = status.connected ? 'Online' : 'Offline';
    });

    // Initialen Netzwerkstatus abrufen
    this.logCurrentNetworkStatus();
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

  async logCurrentNetworkStatus() {
    const status = await Network.getStatus();
    console.log('Current Network status:', status);
    this.networkStatus = status.connected ? 'Online' : 'Offline';
  }
}
