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

  size = 200;
  center = this.size / 2;
  radius = 80;

  get fraction(): number {
    return Math.min(this.value() / this.maxValue(), 1);
  }

  get valueAngle(): number {
    return this.fraction * 360;
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  describeArc(): string {
    const start = this.polarToCartesian(this.center, this.center, this.radius, this.valueAngle);
    const end = this.polarToCartesian(this.center, this.center, this.radius, 0);
    const largeArcFlag = this.valueAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }
}
