import { TestBed } from '@angular/core/testing';
import { SensorData } from './sensor-data';

describe('SensorData', () => {
  let service: SensorData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
