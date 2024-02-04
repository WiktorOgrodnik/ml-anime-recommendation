import { Component, Input } from '@angular/core';
import { Anime } from '../../models/anime';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss'
})
export class AnimeComponent {
  @Input() anime!: Anime;
}
