import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { WeatherService } from '../../services/weather/weather.service';
import { LocationService } from '../../services/location/location.service';
import { Router } from '@angular/router';

import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf], // Include HttpClientModule here
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [WeatherService, LocationService], // Provide HttpClient here
})
export class LandingComponent implements OnInit {
  weatherData: any;
  forecastData: any;

  country!: string;
  countryCode!: string;
  city!: string;
  cities: string[] = ['City1', 'City2', 'City3']; // Replace with actual cities or fetch dynamically
  selectedCityWeather: any;
  sevenDayForecast: any[] = [];

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private router: Router // Inject Router
  ) {}

  getDayName(dateString: string): string {
    const date = new Date(dateString);
    const options = { weekday: 'long' } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('en-US', options); // You can change 'en-US' to any locale you prefer
  }

  ngOnInit() {
    // Detect location when the component is initialized
    this.locationService.getLocation().subscribe(
      (position) => {
        const coords = position.coords;
        console.log('Latitude:', coords.latitude);
        console.log('Longitude:', coords.longitude);
        this.fetchLocationInfo(coords.latitude, coords.longitude);
      },
      (error) => {
        console.error('Error fetching location data', error);
      }
    );
  }
  getForecastData(): void {
    this.weatherService.getForecast(this.city).subscribe((data) => {
      this.forecastData = data;
      console.log('forcastttttttt', this.forecastData);
    });
  }

  fetchLocationInfo(latitude: number, longitude: number) {
    this.locationService.getLocationInfo(latitude, longitude).subscribe(
      (locationData) => {
        console.log(locationData);
        this.city = locationData.city; // Get the user's city
        this.countryCode = locationData.countryCode;

        this.getWeatherForCity(this.city); // Fetch weather for that city
        this.getCitiesForCountry(this.countryCode);
      },
      (error) => {
        console.error('Error fetching location info', error);
      }
    );
  }

  getWeatherForCity(city: string) {
    this.weatherService.getWeather(city).subscribe(
      (data) => {
        this.selectedCityWeather = data;
        console.log(this.selectedCityWeather);
        this.sevenDayForecast = this.selectedCityWeather?.data?.weather;
        console.log(this.sevenDayForecast);
        const query: string = this.selectedCityWeather.data.request[0].query;
        const parts = query.split(',');
        this.country = parts[1]?.trim();
        this.getWeatherForCountry(this.country);
      },
      (error) => {
        console.error('Error fetching city weather data', error);
      }
    );
  }

  getCitiesForCountry(countrycode: string) {
    this.locationService.getCitiesByCountry(this.countryCode).subscribe(
      (response: any) => {
        this.cities = response.geonames.map((city: any) => city.name); // Map city names
        console.log('Cities:', this.cities);
      },
      (error) => {
        console.error('Error fetching cities data', error);
      }
    );
  }

  // Fetch weather for the detected country
  getWeatherForCountry(country: string) {
    this.weatherService.getWeather(country).subscribe(
      (data) => {
        this.weatherData = data;
        console.log(this.weatherData);
      },
      (error) => {
        console.error('Error fetching weather data', error);
      }
    );
  }

  navigateToDashboard(city: string) {
    // Navigate to the dashboard page with city parameter
    this.router.navigate(['/dashboard'], { queryParams: { city: city } });
  }
}
