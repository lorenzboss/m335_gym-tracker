import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLogPage } from './edit-log.page';

describe('EditLogPage', () => {
  let component: EditLogPage;
  let fixture: ComponentFixture<EditLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
