import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime      } from '../models/anime'
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(private readonly httpClient: HttpClient) { }

  getAnime(id: number): Observable<Anime> {
    return this.httpClient.get<Anime>(`${environment.apiUrl}api/Anime/${id}`);
  }

  getAnimes(): Observable<Anime[]> {
    return this.httpClient.get<Anime[]>(`${environment.apiUrl}api/Animes`);
  }
}
