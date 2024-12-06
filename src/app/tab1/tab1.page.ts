import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class Tab1Page {
  textInput: string = '';
  rangeValue: number = 16;
  selectedColor: string = 'black';
  isToastOpen: boolean = false;

  showToast() {
    this.isToastOpen = true;
  }
}
