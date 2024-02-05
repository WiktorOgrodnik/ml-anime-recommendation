import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Anime      } from '../models/anime'
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private _needsRefresh$ = new BehaviorSubject<void>(0 as unknown as void);
  get needsRefresh$() {
    return this._needsRefresh$;
  }

  constructor(private readonly httpClient: HttpClient) { }

  getAnime(id: number): Observable<Anime> {
    return this.httpClient.get<Anime>(`${environment.apiUrl}api/Anime/${id}`);
  }

  getAnimes(): Observable<Anime[]> {
    return this.httpClient.get<Anime[]>(`${environment.apiUrl}api/Animes`);
  }

  addAnime(anime_id: number): Observable<number> {
    return this.httpClient.post<number>(`${environment.apiUrl}api/Anime`, anime_id).pipe(
      tap(() => this._needsRefresh$.next())
    )
  }
}
