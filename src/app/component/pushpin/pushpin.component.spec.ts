import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushpinComponent } from './pushpin.component';

describe('PushpinComponent', () => {
  let component: PushpinComponent;
  let fixture: ComponentFixture<PushpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushpinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
