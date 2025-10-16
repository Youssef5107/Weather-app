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
  // countryName: string = 'egypt' ; 
  weatherDetails: any = {};
  // days: string[]=["sun","mon","tue","wed","thu","fri","sat"];
  // selectedDay:string= "";
  days: any[]=[
      {
        "name":"sun",
        "temp":50,
        "hours":[1,2,3]
      },
      {
        "name":"mon",
        "temp":47,
        "hours":[1,2,3]
      },
      {
        "name":"tue",
        "temp":40,
        "hours":[1,2,3]
      }
  ];
  selectedDay:any=this.days[0];
  tempUnit:string='celsius';
  windSpeedUnit:string='mph';
  precipitationUnit:string='inch';
  lat:any=null;
  lon:any=null;

 constructor(private _httpClient:HttpClient){}

 ngOnInit(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
        this._getWeatherDetails(position.coords.latitude,position.coords.longitude)
        this.getCountryWeather()    
        this.getcountryName(position.coords.latitude,position.coords.longitude)
	    });
    }
  }

  getCountryWeather(){
      var inputValue=document.querySelector("input")?.value; 
    this._httpClient.get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}`).subscribe((locationData)=>{
      console.log(locationData)
      var countryLatitude=locationData.results[0].latitude;
      var countryLongitude=locationData.results[0].longitude;
      this._getWeatherDetails(countryLatitude, countryLongitude);
      this.getcountryName(countryLatitude,countryLongitude)
    })
  }

  private _getWeatherDetails(lat: number, lon:number){
      this.lat=lat;
      this.lon=lon;
    this._httpClient.get(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&temperature_unit=${this.tempUnit}&windspeed_unit=${this.windSpeedUnit}&precipitation_unit=${this.precipitationUnit}&daily=temperature_2m_max,temperature_2m_min,precipitation_hours&current=relative_humidity_2m,precipitation,wind_speed_10m,apparent_temperature,temperature_2m`).subscribe((weatherData: any)=>{
      console.log(weatherData);
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
      console.log(location)
      this.setCountryName(location.address.country,location.address.state)
    });

  }

  setCountryName(country:any,city:any){
    document.querySelector(".city-country_name")!.innerHTML=`${city}, ${country}`
  }

  showHideNav(){
    var nav=document.querySelector(".options_area") as HTMLElement;
    if(nav){
      if(nav.style.display=="none"){
        nav.style.display="block";
      }
      else{
        nav.style.display="none";
      }
    }
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

  insertTempUnit(unit:string){
    this.tempUnit=unit;
    this._getWeatherDetails(this.lat,this.lon)
  }

  insertWindSpeedUnit(unit:string){
    this.windSpeedUnit=unit;
    this._getWeatherDetails(this.lat,this.lon)
  }

  insertPrecipitationUnit(unit:string){
    this.precipitationUnit=unit;
    this._getWeatherDetails(this.lat,this.lon)  
  }
  
}


