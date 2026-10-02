import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  imports: [],
  templateUrl: './gauge.html',
  styleUrl: './gauge.css',
})
export class Gauge {
  value = input.required<number>();
  maxValue = input.required<number>();
  label = input.required<string>();
}
