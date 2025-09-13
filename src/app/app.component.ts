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
  countryName: string = ''; 

  weatherDetails: any = {};

 constructor(private _httpClient:HttpClient){}

  getCountryWeather(){

    this._httpClient.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${this.countryName}`).subscribe((locationData)=>{
      var countryLatitude=locationData.results[0].latitude;
      var countryLongitude=locationData.results[0].longitude;
      console.log(countryLatitude, countryLongitude)
      this._getWeatherDetails(countryLatitude, countryLongitude);
      
    })
  }

  private _getWeatherDetails(lat: number, lon:number){
    this._httpClient.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}.52&longitude=${lon}.41&hourly=temperature_2m`).subscribe((weatherData: any)=>{
      console.log(weatherData);
      this.weatherDetails = weatherData;
    })
  }
   
 
}
