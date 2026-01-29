import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomClusterComponent } from './custom-cluster.component';

describe('CustomClusterComponent', () => {
  let component: CustomClusterComponent;
  let fixture: ComponentFixture<CustomClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomClusterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
