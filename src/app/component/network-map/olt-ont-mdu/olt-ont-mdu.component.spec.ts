import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OltOntMduComponent } from './olt-ont-mdu.component';

describe('OltOntMduComponent', () => {
  let component: OltOntMduComponent;
  let fixture: ComponentFixture<OltOntMduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OltOntMduComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OltOntMduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
