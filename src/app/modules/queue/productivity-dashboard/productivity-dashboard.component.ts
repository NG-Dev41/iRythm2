import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-productivity-dashboard',
    templateUrl: './productivity-dashboard.component.html',
    styleUrls: ['./productivity-dashboard.component.scss']
})
export class ProductivityDashboardComponent implements OnInit {

    public recordsCompleted: number = 12;
    public totalReviewTime: string = '01:30:33';
    public averageTimePerRecord: string = '00:12:22';

    constructor() {
    }

    ngOnInit(): void {
    }

}
