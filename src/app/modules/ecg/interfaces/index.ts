
export * from './ecg-config.interface';
export * from './ecg-channel.interface';
export * from './ecg-dao.interface';

import {
    EcgComponentKey,
    EcgComponentState
} from '../enums';


/**
 * Interface describes changes to component/logic load state
 */
export interface IEcgCompStateChange {
    component: EcgComponentKey;
    state: EcgComponentState;
}


/**
 * Interface describes any necessary return data from EcgController.initEcg method
 * NOTE: If a controller needs a more specific interface extend this one with the new interface
 */
export interface IEcgControllerInit {
    success: boolean;
}

/**
 * Interface extending IEcgControllerInit
 */

export interface IEcgDaoControllerInit {
}



/**
 * Interface describing properties available in the gainOptions array
 */
export interface IEcgGainOption {
    gain: number;
    percent: number;
}
