import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';


@Component({
    selector: 'app-ecg-edit-bar',
    templateUrl: './record-edit-bar.component.html',
    styleUrls: ['./record-edit-bar.component.scss']
})
export class RecordEditBarComponent implements OnInit {

    constructor(
        public recordDto: RecordDto,
        public sidebarService: RecordSidebarService
    ) { }

    ngOnInit(): void {
    }

    /**
     * Prevents blur from firing which ends the edit session
     * @param event
     */
    public preventBlurEvent(event: MouseEvent): void {
        event.preventDefault();

        // disable painting strip here bc it is called during the blur event on the strip
        this.sidebarService.disablePaintingStrip();
    }

}
