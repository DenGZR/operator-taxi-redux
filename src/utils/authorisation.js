import {makeRequest, Endpoints} from  "../utils/api"

export class Authorisation {
    // static checkAuthInBackUp( nextState, replace ) {
    //   let token = localStorage.getItem("token");
    //   if( !token ) {
    //     replace('/login')
    //   }
    // }

    static removeToken() {
      localStorage.removeItem("token");
    }

    static setToken(token) {
        localStorage.setItem("token", token);
    }

    static getToken() {
        return localStorage.getItem("token");
    }
}
