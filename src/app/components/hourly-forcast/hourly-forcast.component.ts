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
  weeklyWeather:any = {};
  today:any = new Date().getDay(); //0=sunday
  daysName:any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  activeDay(clickedBtn:any){
    var daysOption=document.querySelectorAll(".day_option");
    for(let i=0;i<daysOption.length;i++){
      daysOption[i].classList.remove("active_day");
    }
    clickedBtn.target.classList.add("active_day")
    console.log(clickedBtn.target)
  }
  

  getWeatherDetails() {
    // var navContent:any=document.querySelector(".hourly_forcast_nav");
    // console.log(navContent)
    // for(let i=0;i<7;i++){
    //   navContent.innerHTML=navContent+
    //   `
    //     <div>${this.today+i}</div>
    //   `
    //   // navContent.style.display="none"
  }
  

}
