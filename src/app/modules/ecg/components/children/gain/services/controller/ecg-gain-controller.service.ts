import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';

import { IEcgGainOption, IEcgControllerInit, IEcgResetViewChannel } from 'app/modules/ecg/interfaces';
import { EcgChannelKey, EcgComponentKey, EcgResetViewType } from 'app/modules/ecg/enums';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';


/**
 * EcgGainController
 *
 * Class to handle gain related logic.
 */
@Injectable()
export class EcgGainController extends EcgBaseController implements OnDestroy {


    private resetViewSubs: Subscription;
    /**
     * Ctor
     */
    public constructor(
        private notifier: EcgNotifier,
        public config: EcgConfigDto
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.GAIN;
    }


    /**
     * Init gain functionality.
     *
     * @param  {IEcgConfigGain}                 config
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        // Set default selected gain index
        this.config.ct.gain.selectedGainIndex = this.config.ct.gain.baseOptions.indexOf(1);

        // Build out main gain options using the base gain options
        this.config.ct.gain.options = this.config.ct.gain.baseOptions.map((value: number) => {
            return {
                gain: value,
                percent: (value * 100)
            };
        });

        this.initListeners();

        return of({
            success: true
        });
    }


    /**
     * Listens on the RESET_VIEW channel.
     * Specifically listening for the command to reset the GAIN
     * to the default state.
     * After resetting it sends out it's own notification that the
     * gain has been changed.
     */
    public initListeners(): void {

       this.resetViewSubs =  this.notifier
            .listen(EcgChannelKey.RESET_VIEW)
            .subscribe((data: IEcgResetViewChannel) => {

                // Reset gain to default state
                switch(data.resetViewState) {
                    case EcgResetViewType.RESET:

                        // Set gain index to the default
                        this.config.ct.gain.selectedGainIndex = this.config.ct.gain.defaultGainIndex;

                        // Emit change that gain has been reset
                        this.emitGainChange(false);
                        break;
                }
            });
    }


    /**
     * Emits notification over the GAIN_CHANGE channel when gain has been modified
     *
     * @param {IEcgNotifyGainChange} data
     */
    public emitGainChange(sendResetViewNotification: boolean = true): void {

        this.config.ct.gain.selectedGainValue = this.config.ct.gain.baseOptions[this.config.ct.gain.selectedGainIndex];

        // Send notification that gain has been changed
        this.notifier.send(EcgChannelKey.GAIN_CHANGE, null);

        // Send notification that the view has been modified
        if(sendResetViewNotification === true) {
            this.notifier.send(EcgChannelKey.RESET_VIEW, {
                resetViewState: EcgResetViewType.CHANGED
            });
        }
    }


    /**
     * Increases gain
     */
    public increaseGain(): void {
    	this.config.ct.gain.selectedGainIndex = Math.min(this.config.ct.gain.selectedGainIndex + 1, this.config.ct.gain.options.length - 1);
        this.emitGainChange();
    }


    /**
     * Descreases gain
     */
    public decreaseGain(): void {
    	this.config.ct.gain.selectedGainIndex = Math.max(this.config.ct.gain.selectedGainIndex - 1, 0);
        this.emitGainChange();
    }


    /**
     * Set gain index.
     *
     * @param {number} selectedIndex
     */
    public setGainIndex(selectedIndex: string): void {
        this.config.ct.gain.selectedGainIndex = parseInt(selectedIndex);
        this.emitGainChange();
    }


    /**
     * Convenience method to access the selected EcgGainOption object.
     *
     * @return {IEcgGainOption}
     */
    public get gain(): IEcgGainOption {
    	return this.config.ct.gain.options[this.config.ct.gain.selectedGainIndex];
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(){
        this.resetViewSubs?.unsubscribe();
    }
}
