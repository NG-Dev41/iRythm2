import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SplitStripComponent } from './split-strip.component';
import { EcgListNotifier } from '../../list/services/notifier/ecg-list-notifier.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgStripComponentMock } from 'test/mocks/components/ecg-strip-mock.component';
import { of } from 'rxjs';
import { RecordDtoMock } from '../../../../../../test/mocks/services/dto/record-dto-mock.service';
import { RecordDto } from '../../../../../features/record/services/dtos/record-dto.service';
import { IEcgCardConfig, IEcgConfigStrip, IEcgListContextMenuChannel, IEcgListContextMenuAction, RegionType, SubRegion, ShowHRType } from 'app/modules/ecg/interfaces';
import { EcgListChannelKey, EcgMinMaxType } from 'app/modules/ecg/enums';

describe('SplitStripComponent', () => {
    let component: SplitStripComponent;
    let fixture: ComponentFixture<SplitStripComponent>;
    let listNotifier: EcgListNotifier;
    let ecgDto: EcgDto;
    let activatedRoute: ActivatedRoute;
    let recordDto: RecordDto;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SplitStripComponent, EcgStripComponentMock],
            providers: [
                { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: ActivatedRoute, useValue: { queryParams: of([{}]) } },
                { provide: RecordDto, useClass: RecordDtoMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SplitStripComponent);
        component = fixture.componentInstance;
        listNotifier = fixture.debugElement.injector.get(EcgListNotifier);
        ecgDto = fixture.debugElement.injector.get(EcgDto);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        recordDto = fixture.debugElement.injector.get(RecordDto);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit", () => {
        it("should set isEpisodeHighlighted to true if listNotifier response action is UPDATE_HIGHLIGHTING and has highlightedIntervals", () => {
            const interval = '1';
            const data: any = { action: IEcgListContextMenuAction.UPDATE_HIGHLIGHTING, highlightedIntervals: new Set(interval) }
            const spyListen = jest.spyOn(listNotifier, 'listen').mockReturnValue(of(data) as any);
            component['dto'] = { data: { episode: { interval: interval } } } as any;
            component.ngOnInit();
            expect(spyListen).toHaveBeenCalledWith(EcgListChannelKey.CONTEXT_MENU);
            expect(component.isEpisodeHighlighted).toBe(true);
        })

        it("should set isEpisodeHighlighted to false if listNotifier response action is not UPDATE_HIGHLIGHTING and not has highlightedIntervals", () => {
            const interval = '1';
            const data: any = { action: IEcgListContextMenuAction.OPEN_CONTEXT_MENU, highlightedIntervals: new Set(interval) }
            const spyListen = jest.spyOn(listNotifier, 'listen').mockReturnValue(of(data) as any);
            component['dto'] = { data: { episode: { interval: 100 } } } as any;
            component.ngOnInit();
            expect(spyListen).toHaveBeenCalledWith(EcgListChannelKey.CONTEXT_MENU);
            expect(component.isEpisodeHighlighted).toBe(false);
        })

        it("should set _ecgMinMaxType to DURATION if sortType is LONGEST/FASTEST_MDN/LONGEST_SYMPTOMATIC", () => {
            const interval = '1';
            const data: any = { action: IEcgListContextMenuAction.OPEN_CONTEXT_MENU, highlightedIntervals: new Set(interval) }
            const spyListen = jest.spyOn(listNotifier, 'listen').mockReturnValue(of(data) as any);
            component['dto'] = { data: { episode: { interval: 100 } } } as any;
            component.ngOnInit();
            expect(spyListen).toHaveBeenCalledWith(EcgListChannelKey.CONTEXT_MENU);
            expect(component.isEpisodeHighlighted).toBe(false);
        })
    })
});
