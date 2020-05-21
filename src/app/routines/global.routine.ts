import { firstbar, qport, sprotocol, serHost, port } from '../variables';
import { FormControl } from '@angular/forms';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { filter, map, tap, debounceTime, catchError } from 'rxjs/operators';
import { pipe, Observable } from 'rxjs';
import { StateGroup, OptionEntry } from '../interfaces';
import { ImageSnippet } from '../classes';
import { MatDialog } from '@angular/material/dialog';
import { SmartEngineService } from '../services';
import { ObjectID } from 'bson';
// import { isObject, isArray } from 'util';


export const globalSort = (arr: string[] | number[] | Date[], sortBy?: string): void => {
  arr.sort((a: string | number | Date, b: string | number | Date) => {
    if (sortBy === 'date') {
      return new Date(a).getDate() - new Date(b).getDate()
    } else {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    }
  });
}

export const _AlphaBeticSort = (value: string[]): StateGroup[] => {
  const sg: StateGroup[] = [];
  let k: string[] = [];



  if (!value.length) { return sg; }


  globalSort(value)



  let charIndex = value[0].charAt(0);

  value.forEach((element: string) => {

    if (charIndex < element.charAt(0)) {

      sg.push({
        letter: charIndex,
        name: k,
      });

      k = [];
    }
    k.push(element);
    charIndex = element.charAt(0);
  });

  sg.push({
    letter: charIndex,
    name: k
  });

  k = []; charIndex = '';

  return sg;
}

export function _filter(opt: string[], value: string): string[] {
  //  .splice(0, 10)
  return opt.filter(option => option.toLowerCase().includes(value.toLowerCase()))
}
export function escapeRegex(text: string) {

  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const isEmptyArray = (obj: any) => obj && obj.length > 0 ? false : true;

export const strRemofarray = (array: string[], sterm: string) => {

  const index = array.indexOf(sterm);    // <-- Not supported in <IE9

  if (index !== -1) {
    array.splice(index, 1);
  }
};

export function openMatDialog(matDialogObj: MatDialog, data: any, componentOrTemplateRef: any, width?: string, height?: string): any {

  const dialogRef = matDialogObj.open(componentOrTemplateRef, {
    // tslint:disable-next-line: no-bitwise
    width: width ? width : '250px',
    data,
    height: height ? height : '450px'
  });

  return dialogRef
}

export const setServerUrl = (_SERHOST?: string, _PORT?: number, _SPROTOCOL?: string): string => {

  return `${(_SPROTOCOL ? _SPROTOCOL : sprotocol)}${firstbar}${_SERHOST ? _SERHOST :
    serHost}${_PORT && _PORT > 0 ? (qport + _PORT) : (port && port > 0 ? (qport + port) : '')}`;
};


export const requiredFileType = (type: string[], required?: boolean) => {
  return (control: FormControl) => {
    const vfile = control.value;
    if (vfile) {
      let extension = ''
      if (!vfile.name) {
        if (vfile.file && vfile.file.name) extension = vfile.file.name.split('.')[1].toLowerCase()
      }
      else extension = vfile.name.split('.')[1].toLowerCase();

      type.forEach(element => {
        if (element.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: required || false
          }
        }
      });


      return null;
    }

    return null;
  }
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function saveByHttpwithProgress(httpService: SmartEngineService, formData: any, URL: string, progressActionDataBar: number): Observable<OptionEntry> {

  /*  */
  return httpService.saveTaskswithProgress(formData, URL)
    .pipe(
      uploadProgress((progress: number) => (progressActionDataBar = progress)),
      toResponseBody(),
      debounceTime(500),
      tap((result) => {
        console.log('Saved results -->', result);

        return result;
      }),
      catchError(httpService.handleError<any>('saveByHttpwithProgress'))
    );
}


export function toFormData<T>(formValue: T, carryFormData?: FormData): FormData {
  const formData = carryFormData || new FormData();

  for (const key of Object.keys(formValue)) {
    const fv = formValue[key];
    /* if (isArray(formValue[key]) || isObject(formValue[key]))
      toFormData(formValue[key], formData) */
    formData.append(key, fv);
  }

  return formData;
}


export function convertJsontoFormData<T>(formValue: T, parentKey?: any, carryFormData?: FormData): FormData {

  let formData = carryFormData || new FormData();
  let index = 0;

  for (const key of Object.keys(formValue)) {
    if (formValue.hasOwnProperty(key)) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        var propName = parentKey || key;
        if (parentKey && isObject(formValue)) {
          propName = key/* parentKey + '[' + key + ']' */;
        }
        if (parentKey && isArray(formValue)) {
          propName = index/*  parentKey + '[' + index + ']' */;
        }
        if (formValue[key] instanceof File) {
          const fv = formValue[key]
          formData.append(propName, fv);
        } else if (formValue[key] instanceof FileList) {
          for (var j = 0; j < formValue[key].length; j++) {
            const fv = formValue[key]
            formData.append(propName + '[' + j + ']', fv.item(j));
          }
        } else if (isArray(formValue[key]) || isObject(formValue[key])) {
          // const fv = formValue[key]
          convertJsontoFormData(formValue[key], propName, formData);
        } else if (typeof formValue[key] === 'boolean') {
          const fv = formValue[key]
          formData.append(propName, +fv ? '1' : '0');
        } else {
          const fv = formValue[key]
          formData.append(propName, fv);
        }
      }
    }
    index++;
  }
  return formData;
}

export function isArray(val) {
  const toString = ({}).toString;
  return toString.call(val) === '[object Array]';
}

export function isObject(val) {
  return !isArray(val) && typeof val === 'object' && !!val;
}

export const isEmpty = (obj: object) => !obj || !Object.keys(obj).some(x => obj[x] !== void 0);

export function escapeRegExp(str: string) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function EmptyObj(obj: Array<any>) {

  // for all properties of shallow/plain object
  for (const key in obj) {
    // this check can be safely omitted in modern JS engines
    if (obj.hasOwnProperty(key)) { delete obj[key]; }
  }
}

export function addObjAttr(object: any, key: string, value: any): void {

  object[key] = value;
}

export function delObjAttr(object: any, key) {

  delete object[key]
}

export function uid(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function MongoId(_id: string): ObjectID {

  return new ObjectID(_id)
}