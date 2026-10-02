import { Service, signal } from '@angular/core';
import { Observable } from 'rxjs';

interface Sensor {
  name: string;
  value: number;
  unit: string;
}

@Service()
export class SensorData {
  readonly sensors = signal<Sensor[]>([]);

  constructor() {
    const socket = new WebSocket('ws://localhost:3000');

    const messages$ = new Observable<Sensor[]>((subscriber) => {
      socket.onmessage = (event) => {
        subscriber.next(JSON.parse(event.data));
      };
      socket.onclose = () => {
        subscriber.complete();
      };

      return () => {
        socket.close();
      };
    });

    messages$.subscribe((data) => {
      this.sensors.set(data);
    });
  }
}
