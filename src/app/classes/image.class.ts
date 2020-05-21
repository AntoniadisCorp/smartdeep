import { DEFAULT_IMAGE, middlebar } from '../variables';
import { SmartEngineService } from '../services';
import { setServerUrl } from '../routines';

export class ImageSnippet {


    pending: boolean = false;
    status: string = 'init';
    src = DEFAULT_IMAGE
    storageUrl: string = '';

    constructor(src?: string, public file?: File, storageUrl?: string/* private httpService?: SmartEngineService */) {
        if (src && src.length > 1) {
            this.src = src
            // if (file) this.showPreviewPic(file)
        }
        /*  else {
             // this.httpService.getTasks(setServerUrl('localhost', 8080) + middlebar + 'task' + middlebar + 'book' +  )
         } */
    }

    showPreviewPic(file: File) {
        const reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = () => {

            this.src = reader.result as string
            this.file = file
            this.pending = true
        }

    }

    onSuccess(): void {

        this.pending = false;
        this.status = 'ok';
    }

    onError() {
        this.pending = false;
        this.status = 'fail';
        this.src = DEFAULT_IMAGE;
    }
}