import { TestBed } from '@angular/core/testing';

import { NotesService } from './notes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EndpointUrlMock } from 'test/mocks/services/endpoint-url-mock.service';
import { ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';
import { ProcessDataDaoMock } from 'test/mocks/services/dao/process-data-dao-mock.service';
import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';

describe('NotesService', () => {
    let service: NotesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                NotesService,
                { provide: EndpointUrl, useClass: EndpointUrlMock },
                { provide: ProcessDataDao, useClass: ProcessDataDaoMock }
            ]
        });
        service = TestBed.inject(NotesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
