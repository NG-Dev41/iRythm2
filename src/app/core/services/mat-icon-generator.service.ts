import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import assetsManifest from '../../../assets/assets-manifest.json'

@Injectable({
    providedIn: 'root'
})
export class MatIconGeneratorService {
    private assetsManifest = assetsManifest;

    constructor(private matIconRegistry: MatIconRegistry,
                private domSanitizer: DomSanitizer) {
    }

    public generateIcons(): void {
        for(let file of this.assetsManifest.img.icons.files) {

            if(file.fileName.split('.').length !== 2) {
                console.error(`FileName: ${file.fileName} is Invalid`);
                continue;
            }

            if(file.fileName.split('.')[1] !== 'svg') {
                console.error(`FileName: ${file.fileName} must be an svg file`);
                continue;
            }

            this.matIconRegistry.addSvgIcon(
                file.fileName.split('.')[0],
                this.domSanitizer.bypassSecurityTrustResourceUrl(file.filePath)
            )
        }
    }
}
