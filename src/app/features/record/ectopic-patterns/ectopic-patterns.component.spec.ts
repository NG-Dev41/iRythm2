import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EctopicPatternsComponent } from './ectopic-patterns.component';

describe('EctopicPatternsComponent', () => {
  let component: EctopicPatternsComponent;
  let fixture: ComponentFixture<EctopicPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EctopicPatternsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EctopicPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
