import { LOGIN, LOGOUT, START, SUCCESS, FAIL, CHECK_AUTH, SET_TOKEN, REMOVE_TOKEN } from '../constants'
import { Authorisation } from "../utils/authorisation"
import {makeRequest, Endpoints} from  "../utils/api"

export function checkAuth() {
    return {
        type: CHECK_AUTH
    }
}

export function setToken(token) {
    return {
        type: SET_TOKEN,
        token
    }
}

export function removeToken() {
    return {
        type: REMOVE_TOKEN
    }
}

export function getAuthToken(userLogin,userPassword) {
    return (dispatch, state) => {
        let { auth } = store.getState()
        let token = auth.get('token')
        dispatch({
            type: LOGIN + START
        })

        makeRequest(token, Endpoints.GET_AUTH_TOKEN(), {
          login: userLogin,
          password: userPassword
        })
          .then(response=> {
              //debugger;
              if (response.data && response.data.token) {
                // console.log("Authorisation SUCCESS");
                dispatch({ type: LOGIN + SUCCESS, response })
              }
          })
          .catch(error=> {
              // console.log("Authorisation FAIL");
              dispatch({ type: LOGIN + FAIL, error })
          })
    }
}

export function removeAuthToken(userLogin,userPassword) {
    return (dispatch, state) => {
        dispatch({
            type: LOGOUT + START
        })

        makeRequest( token, Endpoints.GET_AUTH_TOKEN(), {
          login: userLogin,
          password: userPassword
          })
          .then(response=> {
              //debugger;
              if (response.data ) {
                // console.log("Authorisation SUCCESS");
                dispatch({ type: LOGOUT + SUCCESS, response })
              }
          })
          .catch(error=> {
              // console.log("Authorisation FAIL");
              dispatch({ type: LOGOUT + FAIL, error })
          })
    }
}
