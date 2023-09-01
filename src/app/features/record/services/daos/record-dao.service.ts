import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { NgxIndexedDBService } from 'ngx-indexed-db';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';


@Injectable({
    providedIn: 'root'
})
export class RecordDao {

    /**
     * Ctor
     *
     * @param {NgxIndexedDBService} private dbService
     */
    public constructor(
        private dbService: NgxIndexedDBService
    ) {}


    /**
     * Saves a record to cache.
     *
     * @param  {RecordDto}       recordDto
     * @return {Observable<any>}
     */
    public saveRecord(recordDto: RecordDto): Observable<any> {

        return this.dbService
            .update('record', {
                user: 'test@user.com',
                serialNumber: recordDto.serialNumber,
                recordDto: recordDto
            });
    }


    /**
     * Loads a record from cache.
     *
     * @param  {string}          serialNumber
     * @return {Observable<any>}
     */
    public loadRecord(serialNumber: string): Observable<any> {
        return this.dbService
            .getByKey('record', ['test@user.com', serialNumber]);
    }
}
