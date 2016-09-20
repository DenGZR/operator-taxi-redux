import { LOGIN, LOGOUT, START, SUCCESS, FAIL, CHECK_AUTH, SET_TOKEN, REMOVE_TOKEN } from '../constants'
import { Record, OrderedMap, Map, List } from 'immutable'

// auth
const auth = new Map({
    login: null,
    password: null,
    token: null,
    isLogin: false,
    isLoading: false,
    loaded: false,
    errors: false,
})

export default (state = auth, action) => {
    const { type, response, token } = action

    switch (type) {
        case SET_TOKEN:
          console.log('SET_TOKEN', token);          
            return state
              .set('token', token)
              .set('isLogin', true)

        case REMOVE_TOKEN:
          console.log('REMOVE_TOKEN');
            return state
              .set('token', null)
              .set('isLogin', false)
// LOGIN
        case LOGIN + START:
          console.log('LOGIN + START');
            return state.set('isLoading', true)

        case LOGIN + SUCCESS:
          console.log('LOGIN + SUCCESS');
            return state
                .set('isLoading', false)
                .set('loaded', true)
                .set('token', response.data.token)
                .set('isLogin', true)

        case LOGIN + FAIL:
          console.log('LOGIN + FAIL');
            return state
              .set('errors', true)
              .set('isLoading', false)
// LOGOUT
        case LOGOUT + START:
          console.log('LOGOUT + START');
            return state.set('isLoading', true)

        case LOGOUT + SUCCESS:
          console.log('LOGOUT + SUCCESS');
            return state
                .set('isLoading', false)
                .set('loaded', true)
                .set('token', null)
                .set('isLogin', false)

        case LOGOUT + FAIL:
          console.log('LOGOUT + FAIL');
            return state
              .set('errors', true)
              .set('isLoading', false)
    }

    return state
}
