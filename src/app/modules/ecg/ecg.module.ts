import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { MaterialModule } from '../material/material.module';
import { CommonsModule } from 'app/commons/commons.module';

// Components
import { EcgListComponent } from './components/list/ecg-list.component';
import { EcgComponent } from './components/ecg.component';
import { EcgInfoComponent } from './components/children/info/ecg-info.component';
import { EcgGainComponent } from './components/children/gain/ecg-gain.component';
import { EcgToggleMinMaxComponent } from './components/children/toggle-min-max/ecg-toggle-min-max.component';
import { EcgStripsComponent } from './components/children/strip/ecg-strips.component';
import { EcgStripGroupComponent } from './components/children/strip/children/strip-group/ecg-strip-group.component';
import { EcgStripComponent } from './components/children/strip/children/strip/ecg-strip.component';
import { EcgToggleExpandViewComponent } from './components/children/toggle-expand-view/ecg-toggle-expand-view.component';
import { EcgConvertArtifactComponent } from './components/children/convert-artifact/ecg-convert-artifact.component';
import { EcgConvertSinusComponent } from './components/children/convert-sinus/ecg-convert-sinus.component';
import { EcgResetViewComponent } from './components/children/reset-view/ecg-reset-view.component';
import { EcgNavigationArrowComponent } from './components/children/strip/children/strip/services/controller/navigation-arrow/ecg-navigation-arrow.component';
import { EcgSecondsTextComponent } from './components/children/strip/children/strip/services/controller/seconds-text/ecg-seconds-text.component';
import { EcgAxisGridComponent } from './components/children/strip/children/strip/services/controller/axis-grid/ecg-axis-grid.component';
import { EcgBeatsAddLineComponent } from './components/children/strip/children/strip/services/controller/beats/ecg-beats-add-line.component';
import { ActionMenuComponent } from './components/children/action-menu/action-menu.component';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { DisplaySortTypePipe } from './services/pipes/display-sort-type.pipe';
import { EcgSplitDuoComponent } from './components/ecg-split-duo/ecg-split-duo.component';
import { EpisodeDurationTextComponent } from './components/children/strip/children/strip/services/controller/episode-duration-text/episode-duration-text.component';
import { EpisodeHRTextComponent } from './components/children/strip/children/strip/services/controller/episode-hr-text/episode-hr-text.component';
import { SplitStripComponent } from './components/children/split-strip/split-strip.component';
import { EcgPrimaryEpisodeIndicatorComponent } from './components/children/strip/children/strip/services/controller/primary-episode-indicator/ecg-primary-episode-indicator.component';
import { EcgListRowComponent } from './components/children/list-row/ecg-list-row.component';
import { EcgTestBedComponent } from './components/ecg-test-bed/ecg-test-bed.component';
import { FocusIndicatorComponent } from './components/children/strip/children/strip/services/controller/focus-indicator/focus-indicator.component';

@NgModule({
    imports: [
        CommonModule,
	    CommonsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [
        EcgListComponent,
        EcgComponent,
        EcgInfoComponent,
        EcgGainComponent,
        EcgToggleMinMaxComponent,
        EcgStripsComponent,
        EcgStripGroupComponent,
        EcgStripComponent,
        EcgToggleExpandViewComponent,
        EcgConvertArtifactComponent,
        EcgConvertSinusComponent,
        EcgResetViewComponent,
        EcgNavigationArrowComponent,
        EcgSecondsTextComponent,
        EcgAxisGridComponent,
        ActionMenuComponent,
        EcgBeatsAddLineComponent,
        EcgPrimaryEpisodeIndicatorComponent,
        EcgListRowComponent,
        DisplaySortTypePipe,
        EcgSplitDuoComponent,
        EpisodeDurationTextComponent,
        EpisodeHRTextComponent,
        SplitStripComponent,
        EcgTestBedComponent,
        FocusIndicatorComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EcgListComponent,
        EcgComponent,
        EcgInfoComponent,
        EcgGainComponent,
        EcgToggleMinMaxComponent,
        EcgStripsComponent,
        EcgStripGroupComponent,
        EcgStripComponent,
        EcgConvertArtifactComponent,
        EcgConvertSinusComponent,
        EcgNavigationArrowComponent,
        EcgSecondsTextComponent,
        EcgAxisGridComponent,
        EcgBeatsAddLineComponent,
        EcgPrimaryEpisodeIndicatorComponent,
        EcgListRowComponent,
        EcgPrimaryEpisodeIndicatorComponent
    ],
    providers: [
        EcgConfigDto
    ]
})
export class EcgModule {}
