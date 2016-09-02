import { LOGIN, LOGOUT, START, SUCCESS, FAIL } from '../constants'
import { Record, OrderedMap, Map, List } from 'immutable'

// user
const user = new Map({
    login: null,
    password: null,
    token: null,
    isLogin: false,
    isLoading: false,
    loaded: false,
    errors: false,
})

export default (state = user, action) => {

    const { type, payload, response } = action

    switch (type) {
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
    }

    return state
}
