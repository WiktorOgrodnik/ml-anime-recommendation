import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimeSelectionListComponent } from './components/anime-selection-list/anime-selection-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimeSelectionListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Anime Recommendations';
}
