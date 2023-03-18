import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';

import { MinCountry } from '../interfaces/countries.interface';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _baseUrl: string = 'https://restcountries.com/v2';
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [ ...this._regions ];
  }

  constructor(private http: HttpClient) { }

  getCountriesByRegion(region: string): Observable<MinCountry[]> {
    const url = `${ this._baseUrl }/region/${ region }?fields=name,alpha3Code`;
    return this.http.get<MinCountry[]>(url);
  }

  getCountryByAlpha3Code(code: string): Observable<MinCountry> {
    if (!code) return of({name: null, alpha3Code: null, borders: null});

    const url = `${ this._baseUrl }/alpha/${ code }?fields=name,alpha3Code,borders`;
    return this.http.get<MinCountry>(url);
  }

  getCountriesByAlpha3Code(borders: string[]): Observable<MinCountry[] | null> {
    if (!borders) return of(null);

    const requests: Observable<MinCountry>[] = [];

    borders.forEach(code => {
      const request = this.getCountryByAlpha3Code(code);
      requests.push(request);
    });

    return combineLatest(requests);
  }

}
