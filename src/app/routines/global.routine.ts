import { firstbar, qport, sprotocol, serHost, port } from '../variables';
import { FormControl } from '@angular/forms';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { filter, map, tap } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { StateGroup } from '../interfaces';
import { ImageSnippet } from '../classes';
// import { isObject, isArray } from 'util';

export const isEmpty = (obj: object) => !obj || !Object.keys(obj).some(x => obj[x] !== void 0);

export const EmptyObj = (obj: Array<any>) => {

  // for all properties of shallow/plain object
  for (const key in obj) {
    // this check can be safely omitted in modern JS engines
    if (obj.hasOwnProperty(key)) { delete obj[key]; }
  }
}

export const globalSort = (arr: string[] | number[] | Date[], sortBy?: string): void => {
  arr.sort((a: string | number | Date, b: string | number | Date) => {
     if (sortBy === 'date') {
        return new Date(a).getDate()-new Date(b).getDate()
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

export const isEmptyArray = (obj: any) => obj && obj.length > 0 ? false : true;

export const strRemofarray = (array: string[], sterm: string) => {

  const index = array.indexOf(sterm);    // <-- Not supported in <IE9

  if (index !== -1) {
    array.splice(index, 1);
  }
};


export const setServerUrl = (_SERHOST?: string, _PORT?: number, _SPROTOCOL?: string): string => {

  return `${(_SPROTOCOL ? _SPROTOCOL : sprotocol)}${firstbar}${_SERHOST ? _SERHOST :
    serHost}${_PORT && _PORT > 0 ? (qport + _PORT) : (port && port > 0 ? (qport + port) : '')}`;
};


export const requiredFileType = (type: string, required?: boolean) => {
  return (control: FormControl) => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (type.toLowerCase() !== extension.toLowerCase()) {
        return {
          requiredFileType: required || false
        }
      }

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
function isArray(val) {
  const toString = ({}).toString;
  return toString.call(val) === '[object Array]';
}

function isObject(val) {
  return !isArray(val) && typeof val === 'object' && !!val;
}