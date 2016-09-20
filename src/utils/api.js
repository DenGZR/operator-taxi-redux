import ajax from 'axios'
import * as _Endpoints from './endpoints'
import {Authorisation} from "./authorisation"
export {_Endpoints as Endpoints}

let ROOT;

if( NODE_ENV == 'development') {
  ROOT = 'http://testapi.combotaxi.com/';
} else {
  ROOT = 'https://api.psyco.com.ua';
}

console.log('NODE_ENV',NODE_ENV);
console.log("api root ", ROOT);

const config = {
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
};

export const makeRequest = ( token, {path, method}, userData = undefined ) => {
    if ( token ) {
        config.headers['Authorization-Token'] = token;
    }
    console.log("token", token);
    return ajax({
        method: method,
        headers: config.headers,
        url: `${ROOT}${path}`,
        data: userData
    })
    .then(res => {
      console.log('server response', res)
      return res
    })
};
