import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateLogPage } from './create-log.page';

describe('CreateLogPage', () => {
  let component: CreateLogPage;
  let fixture: ComponentFixture<CreateLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
