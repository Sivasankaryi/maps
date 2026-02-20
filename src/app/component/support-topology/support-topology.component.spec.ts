import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTopologyComponent } from './support-topology.component';

describe('SupportTopologyComponent', () => {
  let component: SupportTopologyComponent;
  let fixture: ComponentFixture<SupportTopologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportTopologyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportTopologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
