import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalReportComponent } from './statistical-report.component';

describe('StatisticalReportComponent', () => {
  let component: StatisticalReportComponent;
  let fixture: ComponentFixture<StatisticalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
