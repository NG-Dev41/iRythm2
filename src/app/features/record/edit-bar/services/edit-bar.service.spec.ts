import { TestBed } from '@angular/core/testing';

import { EditBarUtilService } from './edit-bar-util.service';

describe('EditBarUtilService', () => {
    let service: EditBarUtilService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ EditBarUtilService ]
        });
        service = TestBed.inject(EditBarUtilService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
