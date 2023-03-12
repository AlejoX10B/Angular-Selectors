import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Borders, MinCountry } from '../interfaces/countries.interface';


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
    const url: string = `${ this._baseUrl }/region/${ region }?fields=name,alpha3Code`;
    return this.http.get<MinCountry[]>(url);
  }

  getCountryByAlpha3Code(code: string): Observable<Borders | null> {
    if (!code) return of(null);

    const url: string = `${ this._baseUrl }/alpha/${ code }?fields=borders`;
    return this.http.get<Borders>(url);
  }

}
