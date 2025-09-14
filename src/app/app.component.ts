import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'weather-app';
  countryName: string = 'egypt'; 
  weatherDetails: any = {};

 constructor(private _httpClient:HttpClient){}

 ngOnInit(){
    if (navigator.geolocation) {
	      navigator.geolocation.watchPosition((position) => {
        this._getWeatherDetails(position.coords.latitude,position.coords.longitude)
	    });
    }
  }

  getCountryWeather(){

    this._httpClient.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${this.countryName}`).subscribe((locationData)=>{
      var countryLatitude=locationData.results[0].latitude;
      var countryLongitude=locationData.results[0].longitude;
      this._getWeatherDetails(countryLatitude, countryLongitude);
      
    })
  }

  private _getWeatherDetails(lat: number, lon:number){
    this._httpClient.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,sunrise,sunset,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,temperature_2m_min&hourly=temperature_2m,weather_code,rain,precipitation,apparent_temperature,snowfall,showers`).subscribe((weatherData: any)=>{
      console.log(weatherData);
      console.log(weatherData.daily.temperature_2m_max)
      this.weatherDetails = weatherData;
      console.log(this.weatherDetails.daily)
    })
  }

  getDayName(date: string){
  var dayName = new Date(date);
  return dayName.toLocaleDateString('en-US', { weekday: 'short' }); 
  }
 
}
