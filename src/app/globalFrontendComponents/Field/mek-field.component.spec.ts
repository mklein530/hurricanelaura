import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MekFieldComponent } from './mek-field.component';

describe('MekFieldComponent', () => {
  let component: MekFieldComponent;
  let fixture: ComponentFixture<MekFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MekFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MekFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
