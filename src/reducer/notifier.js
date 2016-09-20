import { INCOMING_NOTICE, CLEAR_NOTICE  } from '../constants'
import { Record, OrderedMap, Map, List, fromJS} from 'immutable'

// messageType notice = false, error = true
const initial = fromJS({
  isFail: false,
  errorMessage: null,
  errorCode: null,
  notice: null
})


export default (state = initial, action) => {
    const { type, data } = action

    switch (type) {
// INCOMING_NOTICE
        case INCOMING_NOTICE :
          console.log('INCOMING_NOTICE');
          return state.setIn(['tariff', 'isLoading'], true)


// CLEAR_NOTICE
           case CLEAR_NOTICE :
             console.log('CLEAR_NOTICE');

             return state.setIn(['order', 'data' ], order)




    }

    return state
}
