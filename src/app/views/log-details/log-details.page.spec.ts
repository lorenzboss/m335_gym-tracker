import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogDetailsPage } from './log-details.page';

describe('LogDetailsPage', () => {
  let component: LogDetailsPage;
  let fixture: ComponentFixture<LogDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
