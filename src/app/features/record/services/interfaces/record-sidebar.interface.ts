import { SidebarTab } from 'app/features/record/services/enums/channel.enum';

export * from './channel.interface';


export interface IRecordSideBar {
	activeTab: SidebarTab;
	rhythmsDisabled?: boolean;
	ectopicsDisabled?: boolean;
    hrBarDisabled?: boolean;
}
