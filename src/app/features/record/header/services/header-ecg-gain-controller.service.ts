import { Injectable } from '@angular/core';
import { IEcgConfigGainInput } from 'app/modules/ecg/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HeaderEcgGainControllerService {
    $gainChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);
    defaultHeaderGain: IEcgConfigGainInput;
    ecgConfigs: { listIndex: number; gain: IEcgConfigGainInput }[] = [];

    constructor() {
        this.defaultHeaderGain = {
            show: true,
            baseOptions: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4],
            defaultGainIndex: 3,
            selectedGainIndex: 3,
            selectedGainValue: 1,
            options: [
                {
                    gain: 0.25,
                    percent: 25,
                },
                {
                    gain: 0.5,
                    percent: 50,
                },
                {
                    gain: 0.75,
                    percent: 75,
                },
                {
                    gain: 1,
                    percent: 100,
                },
                {
                    gain: 1.25,
                    percent: 125,
                },
                {
                    gain: 1.5,
                    percent: 150,
                },
                {
                    gain: 1.75,
                    percent: 175,
                },
                {
                    gain: 2,
                    percent: 200,
                },
                {
                    gain: 2.5,
                    percent: 250,
                },
                {
                    gain: 3,
                    percent: 300,
                },
                {
                    gain: 3.5,
                    percent: 350,
                },
                {
                    gain: 4,
                    percent: 400,
                },
            ],
        };
    }

    addECGConfig(config: { listIndex: number; gain: IEcgConfigGainInput }): void {
        this.ecgConfigs.push(config);
    }

    increaseSelectedIndex(): void {
        this.defaultHeaderGain.selectedGainIndex = Math.min(
            this.defaultHeaderGain.selectedGainIndex + 1,
            this.defaultHeaderGain.options.length - 1
        );
        this.changeEcgConfigs();

        console.log(this.defaultHeaderGain.selectedGainIndex);
    }

    decreaseSelectedIndex(): void {
        this.defaultHeaderGain.selectedGainIndex = Math.max(this.defaultHeaderGain.selectedGainIndex - 1, 0);
        this.changeEcgConfigs();

        console.log(this.defaultHeaderGain.selectedGainIndex);
    }

    setGainIndex(selectedIndex: string): void {
        this.defaultHeaderGain.selectedGainIndex = parseInt(selectedIndex);
        this.changeEcgConfigs();
    }

    changeEcgConfigs(): void {
        this.ecgConfigs.forEach((d) => {
            d.gain.selectedGainIndex = this.defaultHeaderGain.selectedGainIndex;
        });

        this.$gainChanged.next(true);
    }
}
