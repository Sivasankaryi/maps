import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgMapComponent } from './rg-map.component';

describe('RgMapComponent', () => {
  let component: RgMapComponent;
  let fixture: ComponentFixture<RgMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RgMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RgMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
