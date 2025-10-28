import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hourly-forcast',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './hourly-forcast.component.html',
  styleUrl: './hourly-forcast.component.css'
})
export class HourlyForcastComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log("a change has happened")
    console.log(this.weatherDetails)
    this.initDaysObjects()
    this.navbtnSelectedDay=this.daysName[this.today]
  }

  @Input() weatherDetails: any=null;
  daysName:any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  today:any=new Date().getDay()
  daysArray:any=[];
  selectedDay:any = {};
  navbtnSelectedDay:any=this.daysName[this.today];
  weatherCode:any=null;
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

  activeDay(day:any,dayName:any){
    var dayOptions=document.querySelectorAll(".day_option")
    for(let i=0;i<this.daysName.length;i++){
      dayOptions[i].classList.remove('active_day')
    }
    day.target.classList.add("active_day");

    const foundDay = this.daysArray.find((d: any) => d.name === dayName);
    if (foundDay) {
      this.selectedDay = foundDay;
      this.navbtnSelectedDay=foundDay.name;
    }
  }

  //Initialize days objects:
  initDaysObjects(){
    this.daysArray = [];

    const daysObj:any={};
    for(let i=0;i<7;i++){
      daysObj[this.daysName[i]] = {name:'', times:[], temps:[]};
    }
    this.FillDaysArray(daysObj)
  }

  FillDaysArray(daysObj:any){
    const orderedDaysSet = new Set<string>();

    //Fill days objects details:
    for(let i=0;i<this.weatherDetails.hourly.time.length;i++){
      var currentDate:any=this.weatherDetails.hourly.time[i]
      const key=this.getDayName(currentDate)
      const hour = new Date(currentDate).getHours();
      daysObj[key].times.push(this.formatHour(hour));
      daysObj[key].temps.push(this.weatherDetails.hourly.temperature_2m[i]);
      daysObj[key].name=key;   
      orderedDaysSet.add(key);
    }

    orderedDaysSet.forEach((value, key, set) => {
      this.daysArray.push(daysObj[key]);
    });


    this.selectedDay=this.daysArray[this.today]
    this.getWeatherIcon(this.weatherCode)
  }

  formatHour(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${suffix}`;
  }

  getDayName(date: string){
  var dayName = new Date(date);
  return dayName.toLocaleDateString('en-US', { weekday: 'long' }); 
  }

  toggleNav(){
    document.querySelector(".hourly_forcast_nav")?.classList.toggle("active_nav")
  }

  getWeatherIcon(weatherCode:number){
    this.weatherCode=weatherCode;
    const iconFile = this.weatherIcon[weatherCode]
    console.log(this.weatherCode)
    return `assets/images/${iconFile}`;
  }
  

}
