import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hourly-forcast',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './hourly-forcast.component.html',
  styleUrl: './hourly-forcast.component.css'
})
export class HourlyForcastComponent {
  @Input() weatherDetails: any=null;
  daysName:any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  today:any=new Date().getDay()
  daysArray:any=[];
  selectedDay:any = {};

  activeDay(day:any){
    var dayOptions=document.querySelectorAll(".day_option")
    for(let i=0;i<this.daysName.length;i++){
      dayOptions[i].classList.remove('active_day')
    }
    day.target.classList.add("active_day")
  }
  

  ngOnInit() {
    console.log(this.weatherDetails);
    const length=this.weatherDetails.hourly.time.length;

    //Initialize days objects:
    const daysObj:any={};
    for(let i=0;i<7;i++){
      daysObj[this.daysName[i]] = {name:'', times:[], temps:[]};
    }

    const orderedDaysSet = new Set<string>();

    //Fill days objects details:
    for(let i=0;i<length;i++){
      var currentDate:any=this.weatherDetails.hourly.time[i]
      const key=this.getDayName(currentDate)
      daysObj[key].times.push(new Date(currentDate).getHours());
      daysObj[key].temps.push(this.weatherDetails.hourly.temperature_2m[i]);
      daysObj[key].name=key;   
      orderedDaysSet.add(key);
    }

    //Build days array:
    orderedDaysSet.forEach((value, key, set) => {
      this.daysArray.push(daysObj[key]);
    });


    this.selectedDay=this.daysArray[this.today]

    // console.log(this.daysArray);
    console.log(this.selectedDay.name)
    console.log(this.selectedDay.times)
    console.log(this.selectedDay.temps)
  }

  getDayName(date: string){
  var dayName = new Date(date);
  return dayName.toLocaleDateString('en-US', { weekday: 'long' }); 
  }

  toggleNav(){
    document.querySelector(".hourly_forcast_nav")?.classList.toggle("active_nav")
  }
  

}
