import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { WeatherSettings } from './data-interfaces/data-interfaces.interface';
import { HourlyForcastComponent } from './components/hourly-forcast/hourly-forcast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,HeaderComponent,HourlyForcastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'weather-app';
  formattedDate:any=null;
  weatherDetails:any={};
  weatherSettings: WeatherSettings = {tempUnit: 'celsius', windSpeedUnit:'mph', precipitationUnit:'inch'};
  lat:any=null;
  lon:any=null;
  locationName:string='';
  weatherIcon:{ [key: number]: string }={
    0:"icon-sunny.webp",
    1:"icon-sunny.webp",
    2:"icon-partly-cloudy.webp",
    3:"icon-overcast.webp",
    45:"icon-fog.webp",
    48:"icon-fog.webp",
    51:"icon-drizzle.webp",
    53:"icon-drizzle.webp",
    55:"icon-drizzle.webp",
    56:"icon-drizzle.webp",
    57:"icon-drizzle.webp",
    61:"icon-rain.webp", 
    63:"icon-rain.webp",
    65:"icon-rain.webp",
    66:"icon-rain.webp",
    67:"icon-rain.webp",
    80:"icon-rain.webp",
    81:"icon-rain.webp",
    82:"icon-rain.webp",
    71:"icon-snow.webp",
    73:"icon-snow.webp",
    75:"icon-snow.webp",
    77:"icon-snow.webp",
    85:"icon-snow.webp",
    86:"icon-snow.webp",
    95:"icon-storm.webp",
    96:"icon-storm.webp",
    99:"icon-storm.webp"
  };

 constructor(private _httpClient:HttpClient){}

 ngOnInit(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
        this._getWeatherDetails(position.coords.latitude,position.coords.longitude)
        this.getCountryWeather()    
        this.getcountryName(position.coords.latitude,position.coords.longitude)
	    });
    }
    
    const date = new Date();
    this.formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  getCountryWeather(){
    var inputValue=document.querySelector("input")?.value;
    if(inputValue){
      this.locationName=inputValue;
    } 
    this._httpClient.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${this.locationName}`).subscribe((locationData)=>{
      var countryLatitude=locationData.results[0].latitude;
      var countryLongitude=locationData.results[0].longitude;
      this._getWeatherDetails(countryLatitude, countryLongitude);
      this.getcountryName(countryLatitude,countryLongitude)
    })
  }

  changeUnit(newWeatherSettings: WeatherSettings){
    this.weatherSettings=newWeatherSettings;
    this.getCountryWeather()
  }

  private _getWeatherDetails(lat: number, lon:number){
    this.lat=lat;
    this.lon=lon;
    this._httpClient.get(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&temperature_unit=${this.weatherSettings.tempUnit}&windspeed_unit=${this.weatherSettings.windSpeedUnit}&precipitation_unit=${this.weatherSettings.precipitationUnit}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_hours&current=weather_code,relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,temperature_2m&hourly=,weather_code,temperature_2m&temperature_unit=${this.weatherSettings.tempUnit}`).subscribe((weatherData: any)=>{
      this.weatherDetails = weatherData;

      //Create Day Names array:
      const dayNames = [];
      for(let  i=0;i<this.weatherDetails.daily.time.length;i++){
        dayNames.push(this.getDayName(this.weatherDetails.daily.time[i]));
      }

      //Add the new array to the this.weatherDetails.daily object
      this.weatherDetails.daily["dayNames"] = dayNames;

    })
  }

  getDayName(date: string){
  var dayName = new Date(date);
  return dayName.toLocaleDateString('en-US', { weekday: 'short' }); 
  }
  
  getcountryName(lat:any,lon:any){
    this._httpClient.get<any>(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`).subscribe((location)=>{
      this.setCountryName(location.address.country,location.address.state)
      this.locationName=location.address.state;
    });
  }

  setCountryName(country:any,city:any){
    document.querySelector(".city-country_name")!.innerHTML=`${city}, ${country}`
  }

  ngAfterViewInit(){
    var tempUnitBtnsArea=document.querySelectorAll(".temp_unit_btn_area")
    for(let i=0;i<tempUnitBtnsArea.length;i++){
      tempUnitBtnsArea[i].addEventListener('click',()=>{
        for(let i=0;i<tempUnitBtnsArea.length;i++){
          tempUnitBtnsArea[i].classList.remove("active_unit_btn");
        }
        tempUnitBtnsArea[i].classList.add("active_unit_btn");
      })
    } 

    var windSpeedUnitBtnsArea=document.querySelectorAll(".wind_speed_unit_btn_area")
    for(let i=0;i<windSpeedUnitBtnsArea.length;i++){
      windSpeedUnitBtnsArea[i].addEventListener('click',()=>{
        for(let i=0;i<windSpeedUnitBtnsArea.length;i++){
          windSpeedUnitBtnsArea[i].classList.remove("active_unit_btn");
        }
        windSpeedUnitBtnsArea[i].classList.add("active_unit_btn");
      });
    } 

    var precipitationUnitBtnsArea=document.querySelectorAll(".precipitation_unit_btn_area");
    for(let i=0;i<precipitationUnitBtnsArea.length;i++){
      precipitationUnitBtnsArea[i].addEventListener('click',()=>{
        for(let i=0;i<precipitationUnitBtnsArea.length;i++){
          precipitationUnitBtnsArea[i].classList.remove("active_unit_btn");
        }
        precipitationUnitBtnsArea[i].classList.add("active_unit_btn");
      });
    } 
  }

  getWeatherIcon(weatherCode:number){
    const iconFile = this.weatherIcon[weatherCode]
    return `assets/images/${iconFile}`;
  }
}


