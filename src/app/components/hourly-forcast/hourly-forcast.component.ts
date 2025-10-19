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

  ngOnInit(){
    console.log(this.weatherDetails)
  }
}
