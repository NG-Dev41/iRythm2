import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoListCardComponent } from './info-list-card.component';

describe('InfoListCardComponent', () => {
  let component: InfoListCardComponent;
  let fixture: ComponentFixture<InfoListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
