import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { supabase } from '../supabase-client';

type FoodEntry = {
  id: number;
  name: string | null;
  score: number | null;
  category: number | null;
  categoryName?: string; // Wird durch die Abfrage ergänzt
};

type Category = {
  id: number;
  name: string | null;
};

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule],
})
export class Tab3Page implements OnInit {
  foodEntries: any[] = [];

  constructor() {}

  async ngOnInit() {
    await this.loadFoodEntries();
  }

  async loadFoodEntries() {
    const { data, error } = (await supabase.from('food').select(`
        id, 
        name, 
        score, 
        category,
        categories (name)
      `)) as {
      data: (FoodEntry & { categories: Category | null })[] | null;
      error: any;
    };

    if (error) {
      console.error('Error loading food entries:', error);
      return;
    }

    // Mappe die Kategorie-Namen
    this.foodEntries =
      data?.map((entry) => ({
        ...entry,
        categoryName: entry.categories?.name || 'Unknown',
      })) || [];
  }
}
