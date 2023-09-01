import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityTypesComponent } from './priority-types.component';
import { QueueRecordPriority } from 'app/features/queue/daos/queue-dao.service';


describe('PriorityTypesComponent', () => {
    let component: PriorityTypesComponent;
    let fixture: ComponentFixture<PriorityTypesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PriorityTypesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PriorityTypesComponent);
        component = fixture.componentInstance;
        component.record = { priority: {} as any as QueueRecordPriority } as any

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
