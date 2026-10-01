import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Gauge } from './gauge/gauge';
import { SensorData } from './sensor-data';

@Component({
  imports: [RouterOutlet,Gauge],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-client');
  protected readonly sensorData = inject(SensorData);
  protected readonly maxValue: Record<string, number> = {
    Fuel: 100,
    RPM: 2500, 
    'Oil Pressure': 50,
  }
}
