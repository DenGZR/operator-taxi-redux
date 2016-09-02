import {makeRequest, Endpoints} from  "../utils/api"

export class Authorisation {
    static checkAuthorisation( nextState, replace ) {
      let token = localStorage.getItem("token");
      if( !token ) {
        replace('/login')
      }
    }

    static getLogout( nextState, replace ) {
      localStorage.removeItem("token");
      replace('/login');
    }

    static setToken(token) {
        localStorage.setItem("token", token);
    }

    static getToken() {
        return localStorage.getItem("token");
    }     
}
