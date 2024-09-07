// location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private ipInfoUrl = 'https://ipinfo.io/json?token=11bdc464b9b0e2';
  private geonamesUrl = 'http://api.geonames.org/searchJSON';

  constructor(private http: HttpClient) {}
  getCitiesByCountry(countryCode: string): Observable<any> {
    const url = `${this.geonamesUrl}?country=${countryCode}&featureClass=P&maxRows=20&username=omarsayed111`;
    return this.http.get(url);
  }
  getLocation(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }
  getLocationInfo(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    return this.http.get(url);
  }
}
