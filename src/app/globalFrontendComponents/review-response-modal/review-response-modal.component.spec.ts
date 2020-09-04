import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewResponseModalComponent } from './review-response-modal.component';

describe('ReviewResponseModalComponent', () => {
  let component: ReviewResponseModalComponent;
  let fixture: ComponentFixture<ReviewResponseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewResponseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
