import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

    public serialNumber: string;

    constructor(private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit(): void {

        // Get url params - specifically the serial number
        this.activatedRoute.params.subscribe((params: Params) => {

            // Verify we have a serial number param
            if(params.serialNumber) {

                // Set serial number
                this.serialNumber = params.serialNumber.toUpperCase();

            } else {
                this.serialNumber = '';
            }

        });
    }
}
