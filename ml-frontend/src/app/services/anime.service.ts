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
  private _selectedNeedsRefresh$ = new BehaviorSubject<void>(0 as unknown as void);
  get selectedNeedsRefresh$() {
    return this._selectedNeedsRefresh$;
  }

  private _recommendedNeedsRefresh$ = new BehaviorSubject<void>(0 as unknown as void);
  get recommendedNeedsRefresh$() {
    return this._recommendedNeedsRefresh$;
  }

  constructor(private readonly httpClient: HttpClient) { }

  getAnime(id: number): Observable<Anime> {
    return this.httpClient.get<Anime>(`${environment.apiUrl}api/Anime/${id}`);
  }

  getAnimes(suite: string): Observable<Anime[]> {
    return this.httpClient.get<Anime[]>(`${environment.apiUrl}api/Animes/${suite}`);
  }

  addAnime(anime_id: number): Observable<number> {
    return this.httpClient.post<number>(`${environment.apiUrl}api/Anime`, anime_id).pipe(
      tap(() => this._selectedNeedsRefresh$.next())
    )
  }

  genRecommendations(): Observable<unknown> {
    return this.httpClient.get<void>(`${environment.apiUrl}api/generate`).pipe(
      tap(() => this._recommendedNeedsRefresh$.next())
    )
  }
}
