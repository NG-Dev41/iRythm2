import { Injectable } from '@angular/core';

import { RecordDto } from './dtos/record-dto.service';
import { SidebarChannelKey, SidebarChannelAction, SidebarTab } from './enums/channel.enum';
import { ISidebarActionChannel } from './interfaces/channel.interface';
import { RecordSidebarNotifier } from './notifiers/record-edit-bar-notifier.service';


@Injectable()
export class RecordSidebarService {


    /**
     * Ctor
     *
     * @param {RecordDto}             private recordDto
     * @param {RecordSidebarNotifier} private sidebarNotifier
     */
    public constructor(
        private recordDto: RecordDto,
        private sidebarNotifier: RecordSidebarNotifier
    ) {}



    /**
     * Init any RecordSidebar top level functionality
     */
    public init(): void {

        // Init action listener / channel
        this.initActionListener();
    }


    /**
     * Listens for actions the SideBar needs to react to
     * Currently listening for the command to switch tabs and painting an interval
     */
    private initActionListener(): void {

        this.sidebarNotifier
            .listen(SidebarChannelKey.ACTION)
            .subscribe((params: ISidebarActionChannel) => {

                // Switching tabs - update dto with new active tab
                if(params.action == SidebarChannelAction.SWITCH_TAB) {
                    this.recordDto.sidebar.activeTab = params.target;
                }
            });
    }


    /**
     * Sends out notification to switch tabs.
     *
     * @param {SidebarTab} targetTab Tab that should be opened
     */
    public switchTabs(targetTab: SidebarTab): void {

        this.sidebarNotifier
            .send(SidebarChannelKey.ACTION, {
                action: SidebarChannelAction.SWITCH_TAB,
                target: targetTab
            });
    }


    /**
     * Shows navigation tab
     */
    public showNavigationTab(): void {
        this.switchTabs(SidebarTab.NAVIGATION);
    }


    /**
     * Shows edit tools tab
     */
    public showEditToolsTab(): void {
        this.switchTabs(SidebarTab.EDIT);
    }


    /**
     * Disables rhythm edit tools
     */
    public disableEditRhythms(): void {
        this.recordDto.sidebar.rhythmsDisabled = true;
    }


    /**
     * Enables rhythm edit tools
     */
    public enableEditRhythms(): void {
        this.recordDto.sidebar.rhythmsDisabled = false;
    }


    /**
     * Interacting with Ecg Strip - Highlighting the strip
     * Enables Paint tools, disables Mark Ectopy and HR Bar Actions
     */
    public enablePaintingStrip(): void {
        // show edit tools tab when ecg-strip is clicked on
        this.showEditToolsTab();

        this.recordDto.sidebar.rhythmsDisabled = false;
        this.recordDto.sidebar.ectopicsDisabled = true;
        this.recordDto.sidebar.hrBarDisabled = true;
    }


    /**
     * Interacting with Ecg Strip - Clicking in HR Bar/Ectopy does the following:
     * Disables Paint tools, enables Mark Ectopy and HR Bar Actions
     */
    public disablePaintingStrip(): void {
        this.recordDto.sidebar.rhythmsDisabled = true;
        this.recordDto.sidebar.ectopicsDisabled = false;
        this.recordDto.sidebar.hrBarDisabled = false;
    }

    /**
     * Set intervals on the RecordDto
     * @param startInterval
     * @param endInterval
     */
    public setIntervals(startInterval: number, endInterval: number){
        this.recordDto.paintIntervalStart = startInterval;
        this.recordDto.paintIntervalEnd = endInterval;
    }
}
