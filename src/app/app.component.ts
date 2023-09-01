import { Component, OnInit } from '@angular/core';
import { Router, Event as NavigationEvent, NavigationEnd, Params, ActivatedRoute } from '@angular/router';
import { MatIconGeneratorService } from 'app/core/services/mat-icon-generator.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { PageService } from 'app/commons/services/page/page.service';
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [
		PageService,
		PageDto,
		UserDto
	]
})
export class AppComponent implements OnInit {


	/**
     * Ctor
     *
     * @param matIconGeneratorService
     * @param pageService
     * @param router
     * @param activatedRoute
     * @param userDto
     * @param queueService
     * @param translateService
     */
	public constructor(
        private matIconGeneratorService: MatIconGeneratorService,
        private pageService: PageService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public  userDto: UserDto,
        private queueService: QueueService,
        public  translateService: TranslateService
	) {
        this.translateService.addLangs(['en']);
		// Register icons
        this.matIconGeneratorService.generateIcons();
    }


    /**
     * OnInit
     */
	public ngOnInit(): void {

		// TOP LEVEL FUNCTIONALITY

		// We need to get the active route to find the page data object that maps to this route
		// We compare the active route to the regex(es) defined in our PageMeta map

		// Set up subscription to watch for changes to the active route
		this.router.events
			.subscribe((event: NavigationEvent) => {

				if(event instanceof NavigationEnd) {

					// Load page data
					this.pageService.loadPage({
						url: window.location.pathname,
						previousUrl: event.url // TODO: This doesn't seem to be working as expected - not even sure if we need this value
				 	});
				}
            });


        // todo: temporary way to retrieve UserDto from query params
        this.activatedRoute.queryParams
            .subscribe((params: Params) => {
                if (params.user) {
                    this.userDto.id =  `${params.user}`;

                    // get cached values from indexedDB
                    this.queueService.getCachedValues(this.userDto);
                }
            });

    }
}
