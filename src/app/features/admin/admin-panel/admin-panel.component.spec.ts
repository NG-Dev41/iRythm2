import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdminPanelComponent } from './admin-panel.component';
import { ResetEcgFieldComponentMock } from 'test/mocks/components/reset-ecg-field-mock.component';


describe('AdminPanelComponent', () => {
    let component: AdminPanelComponent;
    let fixture: ComponentFixture<AdminPanelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AdminPanelComponent,
                ResetEcgFieldComponentMock
            ],
            providers: [ { provide: ActivatedRoute, useValue: { params: of([{}])} } ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
