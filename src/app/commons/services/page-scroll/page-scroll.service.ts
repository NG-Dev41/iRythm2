import { Injectable } from '@angular/core';

import { Subject, fromEvent, Subscription } from 'rxjs';


@Injectable()
export class PageScrollService {

	// Scrolling subscription
	public scroll$: Subscription;

	// Subject that will send out notifications when scroll criteria is met
	public notifier$: Subject<Event> = new Subject<Event>();

	// Scroll distance from bottom to send notifications
	public notifyAtY: number = 0;

	// Previous position of vertical scroll
	public previousScrollY: number = 0;

	// Flag to indicate
	public initialized: boolean = false;


	/**
	 * Method watches for page scrolling and will notifiy calling code when the scroll distance from the bottom
	 * is equal to or greater than the given distance param.
	 *
	 * @param  {number}         notifyAtY Distance at wich to recieve scroll notifications
	 * @return {Subject<Event>}
	 */
	public notifyOnScrollDistance(notifyAtY: number = 700): Subject<Event> {

		this.notifyAtY = notifyAtY;

		// Only watch for scroll event if it's not already watching
		if(!this.scroll$) {

		    this.scroll$ = fromEvent(document, 'scroll')
		        .subscribe((event: Event) => {

		        	// Current vertical/y postion of scrolling
		        	let currentScrollY = window.scrollY;

		        	// Total scroll height
		        	let totalScrollHeight = (document.body.scrollHeight - document.body.offsetHeight) + 50;

		        	// Only processing scroll event if total scroll height has been calculated
		        	// AND the current scroll position is greater than the previous (prevents processing when scrolling up)
		        	if(totalScrollHeight > 0 && currentScrollY > this.previousScrollY) {

		        		// Get difference in total scroll height and current scroll height
		        		let scrollDiffY = totalScrollHeight - currentScrollY;

		        		// If vertical/y scroll difference is less than equal to our diffY limit - load additional ecg
		        		if(scrollDiffY <= this.notifyAtY) {
		        			this.notifier$.next(event);
		        		}
		        	}

		        	// Set the previous scroll y postion to the current scroll position
		        	this.previousScrollY = currentScrollY;
		        });
		}

		return this.notifier$;
	}
}
