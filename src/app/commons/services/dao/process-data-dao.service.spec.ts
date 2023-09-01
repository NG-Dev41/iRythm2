import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProcessDataDao } from './process-data-dao.service';
import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';
import { EndpointUrlMock } from 'test/mocks/services/endpoint-url-mock.service';

describe('ProcessDataDaoService', () => {
    let service: ProcessDataDao;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                { provide: EndpointUrl, useClass: EndpointUrlMock }
            ]
        });
        service = TestBed.inject(ProcessDataDao);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
