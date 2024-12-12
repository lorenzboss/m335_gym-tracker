import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  async getDarkMode(): Promise<boolean> {
    const darkModeValue = await Preferences.get({ key: 'darkMode' });
    return darkModeValue.value
      ? JSON.parse(darkModeValue.value)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  async setDarkMode(isDark: boolean): Promise<void> {
    await Preferences.set({
      key: 'darkMode',
      value: JSON.stringify(isDark),
    });
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }
}
