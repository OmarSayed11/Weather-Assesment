import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from '../../services/weather/weather.service';
import { LocationService } from '../../services/location/location.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { D3LineChartComponent } from '../D3/d3-line-chart/d3-line-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, NgIf, D3LineChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    WeatherService,
    LocationService,
    D3LineChartComponent,
    HttpClientModule,
  ], // Provide HttpClient here
})
export class DashboardComponent implements OnInit {
  city!: string;
  weatherData: any;
  historicalWeather: any;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    // Get the city from query parameters
    this.route.queryParams.subscribe((params) => {
      this.city = params['city'];
      if (this.city) {
        this.getWeatherData();
      }
    });
  }

  getWeatherData() {
    // Fetch current weather data
    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        console.log(this.weatherData);
        // Optionally, fetch historical weather data here if needed
        this.getHistoricalWeatherData();
      },
      (error) => {
        console.error('Error fetching weather data', error);
      }
    );
  }

  // Example method to fetch historical weather data
  getHistoricalWeatherData() {
    // Use the appropriate endpoint and parameters for historical data
    this.weatherService.getWeather(this.city, 'json', 30).subscribe(
      (data) => {
        this.historicalWeather = data;

        console.log('historicalWeather', this.historicalWeather);
      },
      (error) => {
        console.error('Error fetching historical weather data', error);
      }
    );
  }
  transformHistoricalData(historicalWeather: any): any[] {
    return (
      historicalWeather?.data?.weather.map((entry: any) => ({
        date: entry.date,
        value: entry.avgtempC,
      })) || []
    );
  }
}
