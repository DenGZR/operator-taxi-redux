import {  browserHistory } from 'react-router'
import { Authorisation } from "../utils/authorisation"
import { LOGIN, LOGOUT, START, SUCCESS, FAIL, CHECK_AUTH, SET_TOKEN, REMOVE_TOKEN } from '../constants'
//checkAuthorisation middlewares

export default store => next => action => {
  const { type, response } = action
  const backUpToken = Authorisation.getToken()
  const { auth } = store.getState()
  const isLogin = auth.get('isLogin')
  const token = auth.get('token')
// debugger
  switch (type) {
      case CHECK_AUTH:
        if(!isLogin && !token && backUpToken) {
          store.dispatch({ type: SET_TOKEN, token: backUpToken })
        }
        break;

      case LOGIN + SUCCESS:
        Authorisation.setToken(response.data.token);
        break;

      case LOGOUT + SUCCESS:
        Authorisation.removeToken();
        break;
  }
  next(action)
}
