import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { InfoDao } from './daos/info.dao';
import { MInfo } from './models/info';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
    providers: [InfoDao],
})
export class InfoComponent implements OnInit {
    // Server info model obj
    public serverInfo: MInfo;

    public httpError: string;

    public environment = environment;

    /**
     * Ctor
     *
     * @param {InfoDao} private infoDao
     */
    public constructor(private infoDao: InfoDao) {}

    /**
     * OnInit:
     * Requests server side build info
     */
    public ngOnInit(): void {
        // Request server side build info
        this.infoDao.getInfo().subscribe(
            (serverInfo: MInfo) => {
                this.serverInfo = serverInfo;
            },
            (error: HttpErrorResponse) => {
                switch (error.status) {
                    // No internet
                    case 0:
                        this.httpError = error.error;
                        break;

                    default:
                        this.httpError = 'Unable to process request at this time.';
                }
            }
        );
    }
}
