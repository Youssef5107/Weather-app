import { Component, EventEmitter, Output } from '@angular/core';
import { WeatherSettings } from '../../data-interfaces/data-interfaces.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
isSettingsOpened:boolean=false;
@Output() weatherParamChange = new EventEmitter<WeatherSettings>();
weatherSettings:  WeatherSettings = {tempUnit: 'celsius', windSpeedUnit:'mph', precipitationUnit:'inch'};


toggleNav(){
  // document.querySelector(".options_area")?.classList.toggle("active_nav");
  this.isSettingsOpened=!this.isSettingsOpened;
  console.log('sh8ala')
}

updateSetting(settingName: string, settingValue: string){
  this.weatherSettings[settingName] = settingValue;
  this.weatherParamChange.emit(this.weatherSettings);
}
  
}
