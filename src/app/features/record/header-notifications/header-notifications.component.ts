import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { first } from 'rxjs/operators';

import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { Snackbar, IHeaderNotifyChannel, IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';
import { PageNotifier, PageChannelKey } from 'app/commons/services/notifiers/page-notifier.service';

@Component( {
	selector: 'app-header-notifications',
	templateUrl: './header-notifications.component.html',
	styleUrls: [ './header-notifications.component.scss' ]
} )
export class HeaderNotificationsComponent implements OnInit {
	public snackbars: Snackbar[] = [];
    readonly DEFAULT_SNACKBAR_DURATION: number = 5000;


	constructor( private pageNotifier: PageNotifier ) {}

	ngOnInit(): void {
		this.pageNotifier.listen( PageChannelKey.HEADER_NOTIFY ).subscribe( ( data: IHeaderNotifyChannel ) => {
			if( !this.snackbars ) {
				this.snackbars = [];
			}

			switch( data.action ) {
				case IHeaderNotifyAction.ADD:
					this.snackbars = this.snackbars.concat( data.snackbars.map( snackbar => this.populateSnackbar( snackbar ) ) );
					break;
			}
		} );
	}

	private populateSnackbar( snackbar: Snackbar ): Snackbar {

		let newSnackbar: Snackbar = {
			text: snackbar.text,
			backgroundColor: snackbar.backgroundColor ? snackbar.backgroundColor : IRHYTHM_COLORS.LIGHT_GREY,
			textColor: snackbar.textColor,
			clickFunction: snackbar.clickFunction,
			durationMs: snackbar.durationMs || this.DEFAULT_SNACKBAR_DURATION,
			shouldHaveCloseButton: snackbar.shouldHaveCloseButton
		};


        interval( newSnackbar.durationMs ).pipe( first() ).subscribe( n => {
            this.snackbars.splice( this.snackbars.indexOf( newSnackbar ), 1 );
        } );


		return newSnackbar;
	}

}
