import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLogoComponent } from './app-logo.component';

describe('AppLogoComponent', () => {
    let component: AppLogoComponent;
    let fixture: ComponentFixture<AppLogoComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          AppLogoComponent,
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AppLogoComponent);
      component = fixture.componentInstance;
    });

    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

  });
