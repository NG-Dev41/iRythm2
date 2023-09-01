import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormMessageComponent } from './admin-form-message.component';

describe('AdminFormMessageComponent', () => {
  let component: AdminFormMessageComponent;
  let fixture: ComponentFixture<AdminFormMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFormMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
