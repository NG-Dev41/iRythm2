import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgListRowComponent } from './ecg-list-row.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { EcgListController } from '../../list/services/controller/ecg-list-controller.service';
import { EcgListControllerMock } from 'test/mocks/services/ecg-list-controller-mock.service';
import { EcgListNotifier } from '../../list/services/notifier/ecg-list-notifier.service';
import { EcgListNotifierMock } from '../../../../../../test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgListActionType, EcgListChannelKey } from '../../../enums';

describe('EcgListRowComponent', () => {
    let component: EcgListRowComponent;
    let fixture: ComponentFixture<EcgListRowComponent>;
    let ecgListNotifierService: EcgListNotifier;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EcgListRowComponent],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: EcgListController, useClass: EcgListControllerMock },
                { provide: EcgListNotifier, useClass: EcgListNotifierMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgListRowComponent);
        component = fixture.componentInstance;
        // @ts-ignore
        ecgListNotifierService = TestBed.inject(EcgListNotifier) as EcgListNotifierMock;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('primaryInterval updating', () => {

        it('should update activeEpisodeId when activeEpisodeId equals primaryEpisodeInterval.startIndex', () => {
            component.activeEpisodeId = 100;
            const newStartIndex = 105;
            const data = {
                actionType: EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE,
                primaryEpisodeInterval: { startIndex: 100, endIndex: 105 },
                newEpisodeInterval: { startIndex: newStartIndex, endIndex: 110 },
            };
            ecgListNotifierService.send(EcgListChannelKey.ACTION, data);
            expect(component.activeEpisodeId).toEqual(newStartIndex);
        });

        it('should NOT update activeEpisodeId when activeEpisodeId DOES NOT equal primaryEpisodeInterval.startIndex', () => {
            const originalStartIndex = 105;
            const newStartIndex = 101;
            component.activeEpisodeId = originalStartIndex;

            const data = {
                actionType: EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE,
                primaryEpisodeInterval: { startIndex: 110, endIndex: 120 },
                newEpisodeInterval: { startIndex: newStartIndex, endIndex: 110 },
            };

            ecgListNotifierService.send(EcgListChannelKey.ACTION, data);
            expect(component.activeEpisodeId).toEqual(originalStartIndex);
        });
    });

});
