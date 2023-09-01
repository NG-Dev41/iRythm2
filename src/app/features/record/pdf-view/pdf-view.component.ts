import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { parse } from "date-fns";


/**
 * Pdf New Tab View
 */
@Component({
	selector: 'app-pdf-view',
	templateUrl: './pdf-view.component.html',
	styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {

	public safeUrl: SafeResourceUrl;
	private url: string;
	public parsedDateTime: Date;

	public constructor(
		private sanitizer: DomSanitizer,
		private route: ActivatedRoute) {}

	public ngOnInit() {
		//Pull the encoded URL from query params, decode it, sanitize it, save string and SafeResourceUrl versions
		this.route.queryParams.subscribe((params) => {
			this.url = decodeURI(params['reportUrl']);
			this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
			this.parsedDateTime = this.parseDatetimeFromUrl(this.url);
		});
	}

	// Rip the unformatted UTC datetime string from the url and convert it into a Date in local time
	private parseDatetimeFromUrl(url: string): Date {
		//Past the last _ and before .pdf is the datetime portion of the url we extract
		const regex = /_(\d+)\.pdf$/;
		const match = url.match(regex);
		const datetimeStringUnformatted = match[1];

		const DATE_FORMAT = 'yyMMddHHmmssX';

		// add Z to the datetime string so it knows the starting timezone is utc
		const parsedDate = parse(datetimeStringUnformatted + 'Z', DATE_FORMAT, new Date());
		return parsedDate;
	}
}