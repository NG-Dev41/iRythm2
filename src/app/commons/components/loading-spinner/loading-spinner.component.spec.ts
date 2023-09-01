import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TranslatePipeMock } from 'test/mocks/pipes/translate-mock.pipe';
import { LoadingSpinnerComponent } from './loading-spinner.component';


describe('LoadingSpinnerComponent', () => {
    let component: LoadingSpinnerComponent;
    let fixture: ComponentFixture<LoadingSpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations:
                [
                    LoadingSpinnerComponent,
                    TranslatePipeMock
                ],
            providers: []        
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadingSpinnerComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders the spinner', () => {
        const loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner'));
    
        expect(loadingSpinner).toBeTruthy();
      });
    
      it('renders loading text if provided', () => {
        const loadingText = 'Loading...';
        component.loadingText = loadingText;
        fixture.detectChanges();
    
        const loadingTextElement = fixture.debugElement.query(By.css('.loading-text'));
    
        expect(loadingTextElement).toBeTruthy();
        expect(loadingTextElement.nativeElement.textContent).toBe(loadingText);
      });
    
      it('does not render loading text if not provided', () => {
        const loadingTextElement = fixture.debugElement.query(By.css('.loading-text'));
    
        expect(loadingTextElement).toBeFalsy();
      });
});
