import { TestBed } from '@angular/core/testing';
import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { Rect } from 'fabric/fabric-impl';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgStripUtilsMock } from 'test/mocks/services/ecg-strip-utils-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgStripNotifierMock } from 'test/mocks/services/notifier/ecg-strip-notifier-mock.service';
import { EcgStripNotifier } from '../../../../../services/notifier/ecg-strip-notifier.service';
import { EcgHighlighterRenderer } from './ecg-highlighter-renderer.service';


describe('EcgHighlighterRenderer', () => {
    let renderer: EcgHighlighterRenderer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgHighlighterRenderer,
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
                { provide: EcgStripNotifier, useClass: EcgStripNotifierMock },
                { provide: EcgStripUtils, useClass: EcgStripUtilsMock },
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock }
            ]
        });
        renderer = TestBed.inject(EcgHighlighterRenderer);
    });

    it('should be created', () => {
        expect(renderer).toBeTruthy();
    });

    it('should set component key', () => {
        renderer.componentKey = 14;

        expect(renderer.componentKey).toBe(EcgComponentKey.HIGHLIGHTER);
    });

    xdescribe('renderHighlighter', () => {
        it('should set this.highlighter', () => {
            renderer.highlighter = {} as Rect;

            renderer.renderHighlighter();

            expect(renderer.highlighter).toBeTruthy();
        });
    });
});
