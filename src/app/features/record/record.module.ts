import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { MaterialModule } from 'app/modules/material/material.module';
import { RecordRoutingModule } from './record-routing.module';
import { HeaderOptionsModule } from './header-options/header-options.module';
import { EcgModule } from 'app/modules/ecg/ecg.module';
import { CommonsModule } from 'app/commons/commons.module';

// Components
import { RecordComponent } from './record.component';
import { RecordSidebarComponent } from './sidebar/record-sidebar.component';
import { RecordHeaderComponent } from './header/record-header.component';
import { RecordFindingsComponent } from './findings/record-findings.component';
import { RecordPatientInfoComponent } from './patient-info/record-patient-info.component';
import { RecordSubNavigationComponent } from './sub-navigation/record-sub-navigation.component';
import { RecordNavigationComponent } from './navigation/record-navigation.component';
import { RecordSinusAfComponent } from './sinus-af/record-sinus-af.component';
import { RecordMdnModalComponent } from 'app/features/record/mdn-modal/record-mdn-modal.component';
import { ApproveReportComponent } from './approve-report/approve-report.component';

// Pipes
import { RecordKeyboardShortcutPipe } from './services/pipes/record-keyboard-shortcut.pipe';
import { RecordChapterPagePipe } from './services/pipes/record-chapter-page.pipe';
import { RecordShowChildPipe } from './services/pipes/record-show-child.pipe';
import { CheckEctopicPatternsPipe } from './services/pipes/check-ectopic-patterns.pipe';
import { HideCountBubblePipe } from './services/pipes/hide-count-bubble.pipe';
import { ActiveNavSubTab } from 'app/commons/pipes/active-nav-sub-tab.pipe';
import { RecordActiveNavigationPipe } from './services/pipes/record-active-navigation.pipe';
import { RecordLinkPipe } from './services/pipes/record-link.pipe';
import { RecordMetricPipe } from './services/pipes/record-metric.pipe';
import { RecordNavigationStatusPipe } from './services/pipes/record-navigation-status.pipe';
import { RhythmTypeMetaPipe } from './services/pipes/rhythm-type-meta.pipe';
import { RecordShowParentPipe } from './services/pipes/record-show-parent.pipe';
import { RecordQualityCheckStatusPipe } from './services/pipes/record-quality-check-status.pipe';

// Directives
import { RecordNavigationStatusDirective } from './services/directives/record-navigation-status.directive';
import { RecordUndoComponent } from './record-undo/record-undo.component';
import { EctopicPatternsComponent } from './ectopic-patterns/ectopic-patterns.component';
import { RecordEditBarComponent } from 'app/features/record/edit-bar/record-edit-bar.component';
import { RecordPaintRhythmsComponent } from './edit-bar/paint-rhythms/record-paint-rhythms.component';
import { RecordMarkEctopyComponent } from './edit-bar/mark-ectopy/record-mark-ectopy.component';
import { RecordHrBarActionsComponent } from './edit-bar/hr-bar-actions/record-hr-bar-actions.component';
import { EditBarUtilService } from 'app/features/record/edit-bar/services/edit-bar-util.service';
import { DisableOverlayDirective } from './services/directives/disable-overlay.directive';
import { LeavePageModalComponent } from './leave-page-modal/leave-page-modal.component';
import { RecordLayoutToggleComponent } from './layout-toggle/record-layout-toggle.component';
import { RecordUndoDialogComponent } from './record-undo/record-undo-dialog/record-undo-dialog.component';
import { ApproveReportModalComponent } from './approve-report/approve-report-modal/approve-report-modal/approve-report-modal.component';
import { ReportPreviewModalComponent } from './report-preview/report-preview-modal/report-preview-modal.component';
import { RightColMultiLineModalComponent } from './right-col-multi-line-modal/right-col-multi-line-modal.component';


// TODO: Let's make sure these components/modules need to be loaded here
// or can be loaded down in more specific modules or higher
@NgModule( {
	declarations: [
		RecordComponent,
		RecordSidebarComponent,
		RecordHeaderComponent,
        RecordEditBarComponent,
		RecordFindingsComponent,
		RecordPatientInfoComponent,
		RecordNavigationComponent,
		RecordSinusAfComponent,
        RecordMdnModalComponent,
        RecordSubNavigationComponent,
        RecordLinkPipe,
        RhythmTypeMetaPipe,
        RecordMetricPipe,
        RecordNavigationStatusDirective,
        RecordQualityCheckStatusPipe,
        RecordNavigationStatusPipe,
        RecordActiveNavigationPipe,
        RecordUndoComponent,
        RecordUndoDialogComponent,
        RecordChapterPagePipe,
        RecordShowChildPipe,
        ActiveNavSubTab,
        EctopicPatternsComponent,
        RecordShowParentPipe,
        RecordPaintRhythmsComponent,
        RecordMarkEctopyComponent,
        RecordHrBarActionsComponent,
        RecordKeyboardShortcutPipe,
        DisableOverlayDirective,
        CheckEctopicPatternsPipe,
        HideCountBubblePipe,
        LeavePageModalComponent,
        RecordLayoutToggleComponent,
        ApproveReportComponent,
        ApproveReportModalComponent,
        ReportPreviewModalComponent,
        RightColMultiLineModalComponent
    ],
    imports: [
        CommonModule,
	    CommonsModule,
        RecordRoutingModule,
        HeaderOptionsModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        EcgModule
    ],
    exports: [
        RecordEditBarComponent
    ],
    providers: [
        RecordMetricPipe,
        RecordShowChildPipe,
        EditBarUtilService
    ]
})
export class RecordModule { }
