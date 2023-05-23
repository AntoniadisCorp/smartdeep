import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon'
import { Injectable } from '@angular/core'

@Injectable()
export class SvgIconService {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) { }
    setSvg(iconName: string, svgIurl: string) {
        this.matIconRegistry.addSvgIcon(
            iconName,
            this.domSanitizer.bypassSecurityTrustResourceUrl(svgIurl)
        )
    }

    getSvg(iconName: string) {
        this.matIconRegistry.getNamedSvgIcon(iconName)
    }

    getSvgFromUrl(svgIurl: string) {
        this.matIconRegistry.getSvgIconFromUrl(this.domSanitizer.bypassSecurityTrustResourceUrl(svgIurl))
    }
}