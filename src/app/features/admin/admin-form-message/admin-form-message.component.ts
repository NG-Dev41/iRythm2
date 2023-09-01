import { Component, Input, OnInit } from '@angular/core';

// Admin Message Types
export enum IAdminMessageType {
    DEFAULT = 'DEFAULT',
    ERROR = 'ERROR',
    WARN = 'WARN',
    SUCCESS = 'SUCCESS'
}

@Component({
    selector: 'app-admin-form-message',
    templateUrl: './admin-form-message.component.html',
    styleUrls: ['./admin-form-message.component.scss']
})
export class AdminFormMessageComponent implements OnInit {
    @Input() message = '';
    @Input() messageType: keyof typeof IAdminMessageType;
    IAdminMessageType = IAdminMessageType;

    constructor() {
    }

    ngOnInit(): void {
    }

}
