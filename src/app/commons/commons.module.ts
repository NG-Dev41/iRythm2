import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AppLogoComponent } from 'app/commons/components/app-logo/app-logo.component';
import { RecordLongestEpisodeTimeFormatPipe } from 'app/commons/pipes/record-longest-episode-time-format.pipe';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from 'app/modules/material/material.module';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { FindingsMacroReplacePipe } from './pipes/macro-replace/findings-macro-replace.pipe';
import { RouterLink } from '@angular/router';
import { AutosizeTextAreaDirective } from './directives/autosize-text-area.directive';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppLogoComponent,
        LoadingSpinnerComponent,
	    RecordLongestEpisodeTimeFormatPipe,
	    FindingsMacroReplacePipe,
        AutosizeTextAreaDirective
    ],
    imports: [
        MaterialModule,
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        RouterLink
    ],
    exports: [
	    MatAutocompleteModule,
        AppLogoComponent,
        LoadingSpinnerComponent,
	    RecordLongestEpisodeTimeFormatPipe,
        TranslateModule,
	    FindingsMacroReplacePipe,
	    AutosizeTextAreaDirective
    ]
})
export class CommonsModule {}
