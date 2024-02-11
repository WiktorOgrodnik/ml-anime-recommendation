import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, combineLatest, of } from 'rxjs';
import { Anime } from '../models/anime'
import { environment } from '../../environments/environment.development';
import { catchError, tap } from 'rxjs/operators'
import { Genre } from '../models/genre';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private _selectedAnimes: { [id: number]: BehaviorSubject<Anime> } = {};
  private _selectedGenres: { [id: number]: BehaviorSubject<Genre> } = {};
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
        return NEVER;
    }));
  }

  getGenre(id: number): Observable<Genre> {
    return this.httpClient.get<Genre>(`${environment.apiUrl}api/Genre/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching anime: ${error}`);
        return NEVER;
    }));
  }

  getCount(set : { [id: number]: BehaviorSubject<Anime> | BehaviorSubject<Genre> }) {
    return Object.keys(set).length;
  }

  getAnimeSet(set: { [id: number]: BehaviorSubject<Anime> }): Observable<Anime[]> {
    if (this.getCount(set) == 0) return of([])
    return combineLatest(Object.values(set).map(behaviorSubject => behaviorSubject.asObservable()));
  }

  getGenreSet(set: { [id: number]: BehaviorSubject<Genre> }): Observable<Genre[]> {
    if (this.getCount(set) == 0) return of([])
    return combineLatest(Object.values(set).map(behaviorSubject => behaviorSubject.asObservable()));
  }

  getAnimes(suite: string): Observable<Anime[]> {
    if (suite == "selected") return this.getAnimeSet(this._selectedAnimes);
    else if (suite == "recommended") return this.getAnimeSet(this._recommendedAnimes);
    return of([])
  }

  getGenres(): Observable<Genre[]> {
    return this.getGenreSet(this._selectedGenres);
  }

  addAnime(id: number): Observable<Anime> {
    return this.getAnime(id).pipe(
      tap(anime => this._selectedAnimes[id] = new BehaviorSubject<Anime>(anime)),
      tap(() => this.selectedNeedsRefresh$.next())
    );
  }
  
  addGenre(id: number): Observable<Genre> {
    return this.getGenre(id).pipe(
      tap(genre => this._selectedGenres[id] = new BehaviorSubject<Genre>(genre)),
      tap(() => this.selectedNeedsRefresh$.next())
    );
  }

  deleteAnime(id: number): Observable<void> {
    return of(0 as unknown as void).pipe(
      tap(() => delete this._selectedAnimes[id]),
      tap(() => this.selectedNeedsRefresh$.next())
    );
  }

  deleteGenre(id: number): Observable<void> {
    return of(0 as unknown as void).pipe(
      tap(() => delete this._selectedGenres[id]),
      tap(() => this.selectedNeedsRefresh$.next())
    );
  }

  genRecommendations(): Observable<Anime[]> {
    return this.httpClient.post<Anime[]>(`${environment.apiUrl}api/generate`,
      {animes: Object.values(this._selectedAnimes).map(behaviorSubject => behaviorSubject.getValue()),
             genres: Object.values(this._selectedGenres).map(behaviorSubject => behaviorSubject.getValue())}).pipe(
        tap(() => this._recommendedAnimes = {}),
        tap(animes => animes.forEach(anime => this._recommendedAnimes[anime.id] = new BehaviorSubject<Anime>(anime))),
        tap(() => this._recommendedNeedsRefresh$.next())
      );
  }

  search(phrase: string): Observable<Anime[]> {
    return this.httpClient.post<Anime[]>(`${environment.apiUrl}api/search/anime/${phrase}`,
      Object.values(this._selectedAnimes).map(behaviorSubject => behaviorSubject.getValue()));
  }
  
  searchGenre(phrase: string): Observable<Genre[]> {
    return this.httpClient.post<Genre[]>(`${environment.apiUrl}api/search/genre/${phrase}`,
      Object.values(this._selectedGenres).map(behaviorSubject => behaviorSubject.getValue()));
  }
}
