import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { format } from 'date-fns';


@Component({
    selector: 'app-info-list-card',
    templateUrl: './info-list-card.component.html',
    styleUrls: ['./info-list-card.component.scss']
})
export class InfoListCardComponent implements OnInit, OnChanges {
    // Default values for card. Used to show all different options of card. Will be over-rided if given a config input
    @Input() config: IInfoListCardConfig = {
        title: 'DEFAULT_TITLE',
        iconName: null,
        rowCount: 3,
        data: [
            {
                key: 'example String',
                val: 'I am a String',
            },
            {
                key: 'example Number',
                val: 123456789
            },
            {
                key: 'example Date',
                val: new Date('07/15/1977')
            },
            {
                key: 'example Date Custom Format',
                val: new Date('07/15/1999'),
                customDateFormat: 'PPPP'
            },
            {
                key: 'example Bolded Row',
                val: 'I am a bolded row',
                boldedRow: true
            },
        ]
    };

    // Data to display in the card
    public mappedData: IInfoListCardData[][];

    // CSS string for CSS Grid to calculate number of rows
    public numColumnsStyleString: string = '';

    // CSS String for CSS Grid to calculate number of columns
    public numRowsStyleString: string = '';

    constructor() {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if(!changes['config'].isFirstChange()) {
            this.mapData();
            this.numColumnsStyleString = this.getGridTemplateColumnString();
            this.numRowsStyleString = this.getGridTemplateRowString();
        }
    }

    public ngOnInit(): void {
        this.mapData();
        this.numColumnsStyleString = this.getGridTemplateColumnString();
        this.numRowsStyleString = this.getGridTemplateRowString();
    }

    /**
     * Map given config and data to a double array [][], where the inner array represents the column the values get placed in,
     * and the outer array represents the order in which the rows get placed (First data in = first in row, last data in = last in row, etc...)
     * Also will do any data processing/formatting needed for display
     * @private
     */
    private mapData(): void {

        this.numColumnsStyleString = this.getGridTemplateColumnString();
        this.numRowsStyleString = this.getGridTemplateRowString();


        // Temp array to store the data in to minimize refreshes
        let tempMappedData = [];

        // Loop over config data
        for(let i = 0; i < this.config.data.length; i++) {
            let datum = this.config.data[i];

            // Format the Date() object into a string for display
            if(datum.val instanceof Date) {
                let dateFormat = datum.customDateFormat ? datum.customDateFormat : 'P';
                datum.val = format(datum.val, dateFormat);
            }

            // Calc which column the datum should go into
            let mappedIndex = Math.floor(i / this.config.rowCount);

            // Initialize array in temp mapped data if there is not an existing array
            if(!tempMappedData[mappedIndex]) {
                tempMappedData[mappedIndex] = [];
            }

            // Push the mapped data to the next available spot inside of its calculated column
            tempMappedData[mappedIndex].push(datum);
        }

        // Set mapped data to temp data, refreshing the card
        this.mappedData = tempMappedData;
    }


    /**
     * Returns a string representing a CSS phrase that sets the number of rows equal to the number of rows listed in the config
     */
    public getGridTemplateRowString(): string {
        let numRowsString = `repeat(${this.config.rowCount}, auto)`;

        return numRowsString;
    }

    /**
     * Returns a string representing a CSS phrase that sets the number of columns equal to the number of columns listed in the config
     */
    public getGridTemplateColumnString(): string {
        let numColumnsString = `repeat(${Math.ceil(this.config.data.length / this.config.rowCount)}, 1fr)`;

        return numColumnsString;
    }
}

export interface IInfoListCardData {
    key: string;
    val: string | number | Date;
    customDateFormat?: string;
    boldedRow?: boolean;
}

export interface IInfoListCardConfig {
    title: string,
    data: IInfoListCardData[],
    iconName?: string,
    rowCount: number
}

