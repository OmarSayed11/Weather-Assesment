import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '91fd3a6a97754cc0b1d163450240409';
  private baseUrl =
    'https://api.worldweatheronline.com/premium/v1/weather.ashx';

  constructor(private http: HttpClient) {}

  getWeather(
    location: string,
    format: string = 'json',
    numOfDays: number = 7
  ): Observable<any> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', location)
      .set('format', format)
      .set('num_of_days', numOfDays.toString());

    return this.http.get(this.baseUrl, { params });
  }
}
