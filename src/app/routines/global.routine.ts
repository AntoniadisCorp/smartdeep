import { firstbar, qport, sprotocol, serHost, port} from '../variables';

export const isEmpty = (obj: object) => !obj || !Object.keys(obj).some(x => obj[x] !== void 0);

export const EmptyObj = (obj: Array<any>) => {

    // for all properties of shallow/plain object
    for (const key in obj) {
      // this check can be safely omitted in modern JS engines
      if (obj.hasOwnProperty(key)) { delete obj[key]; }
    }
 };

export const isEmptyArray = (obj: any) => obj && obj.length > 0 ? false : true;

export const strRemofarray = (array: string[], sterm: string) => {

  const index = array.indexOf(sterm);    // <-- Not supported in <IE9

  if (index !== -1) {
      array.splice(index, 1);
  }
};


export const setServerUrl =  (_SERHOST?: string, _PORT?: number, _SPROTOCOL?: string): string => {

      return `${(_SPROTOCOL ? _SPROTOCOL : sprotocol)}${firstbar}${_SERHOST ? _SERHOST :
          serHost}${_PORT && _PORT > 0 ? (qport + _PORT) : (port && port > 0 ? (qport + port) : '')}`;
};
