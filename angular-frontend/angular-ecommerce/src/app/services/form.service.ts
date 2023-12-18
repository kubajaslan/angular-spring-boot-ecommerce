import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private baseUrl = 'http://localhost:8080/api'
  private countriesUrl = this.baseUrl + '/countries'
  private statesUrl = this.baseUrl + '/states'

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => {
        return response._embedded.countries})
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.httpClient.get<GetResponseStates>(this.statesUrl + '/search/findByCountryCode?code=' + countryCode).pipe(
      map(response => {
        return response._embedded.states})
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
