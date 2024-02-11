import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { Anime, AnimeImpl } from '../models/anime'
import { environment } from '../../environments/environment.development';
import { catchError, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private _selectedAnimes: { [id: number]: BehaviorSubject<Anime> } = {};
  private _recommendedAnimes: { [id: number]: BehaviorSubject<Anime> } = {};

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

    return this.httpClient.get<Anime>(`${environment.apiUrl}api/Anime/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching anime: ${error}`);
        return of(new AnimeImpl(""));
      }));
    }

  getAnimeCount(set: { [id: number]: BehaviorSubject<Anime> }): number {
    return Object.keys(set).length;
  }

  getAnimeSet(set: { [id: number]: BehaviorSubject<Anime> }): Observable<Anime[]> {
    if (this.getAnimeCount(set) == 0) return of([])
    return combineLatest(Object.values(set).map(behaviorSubject => behaviorSubject.asObservable()));
  }

  getAnimes(suite: string): Observable<Anime[]> {
    if (suite == "selected") return this.getAnimeSet(this._selectedAnimes);
    else if (suite == "recommended") return this.getAnimeSet(this._recommendedAnimes);
    return of([])
  }

  addAnime(id: number): Observable<Anime> {
    return this.getAnime(id).pipe(
      tap(anime => this._selectedAnimes[id] = new BehaviorSubject<Anime>(anime)),
      tap(() => this.selectedNeedsRefresh$.next())
    );
  }

  deleteAnime(id: number): Observable<void> {
    return of(0 as unknown as void).pipe(
      tap(() => delete this._selectedAnimes[id]),
      tap(() => this.selectedNeedsRefresh$.next())
    );
  }

  genRecommendations(): Observable<Anime[]> {
    return this.httpClient.post<Anime[]>(`${environment.apiUrl}api/generate`,
      Object.values(this._selectedAnimes).map(behaviorSubject => behaviorSubject.getValue())).pipe(
        tap(() => this._recommendedAnimes = {}),
        tap(animes => animes.forEach(anime => this._recommendedAnimes[anime.id] = new BehaviorSubject<Anime>(anime))),
        tap(() => this._recommendedNeedsRefresh$.next())
      );
  }

  search(phrase: string): Observable<Anime[]> {
    return this.httpClient.post<Anime[]>(`${environment.apiUrl}api/search/${phrase}`,
      Object.values(this._selectedAnimes).map(behaviorSubject => behaviorSubject.getValue()));
  }
}
