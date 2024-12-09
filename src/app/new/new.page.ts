import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class NewPage {
  newEntry = {
    date: '',
    gymLocation: '',
    comment: '',
  };

  constructor() {}

  submitNewEntry() {
    console.log('New Entry:', this.newEntry);
    // Speichern des neuen Eintrags
    this.resetForm();
  }

  resetForm() {
    this.newEntry = {
      date: '',
      gymLocation: '',
      comment: '',
    };
  }
}
