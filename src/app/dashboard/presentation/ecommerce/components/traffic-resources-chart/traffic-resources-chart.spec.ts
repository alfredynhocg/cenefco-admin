import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficResourcesChart } from './traffic-resources-chart';

describe('TrafficResourcesChart', () => {
  let component: TrafficResourcesChart;
  let fixture: ComponentFixture<TrafficResourcesChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficResourcesChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficResourcesChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
