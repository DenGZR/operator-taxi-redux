import { DRIVER, START, SUCCESS, FAIL, LOAD, SET_TO_CURRENT, SET, TO_ORDER } from '../constants'
import { Record, OrderedMap, Map, List } from 'immutable'
import { DriverCollection} from "../models/Driver"

// get Order Collection
let DriverColl = new DriverCollection();
const drivers = new Map({
    isLoading: false,
    loaded: false,
    currentDriver: {},
    driverCollection: DriverColl
})

export default (state = drivers, action) => {
    const { type, response, driver } = action

    switch (type) {
//SET_TO_CURRENT
      case SET_TO_CURRENT + DRIVER :
        console.log('SET_TO_CURRENT + DRIVER', driver );
          return state.set('currentDriver', driver)
// ORDER  LOAD
      case DRIVER + LOAD + START :
        console.log('DRIVER + LOAD + START');
          return state.set('isLoading', true)

      case DRIVER + LOAD + SUCCESS:
        let driverCollection = state.get('driverCollection');
        driverCollection.fromServer(response.data);
        console.log('DRIVER + LOAD + SUCCESS, orderCollection' , driverCollection);
          return state
              .set('isLoading', false)
              .set('loaded', true)
              .set('driverCollection', driverCollection)

      case DRIVER + LOAD + FAIL:
        console.log('DRIVER + LOAD + FAIL');
          return state
              .set('isLoading', false)
              .set('loaded', false)

// SET + DRIVER + TO_ORDER
      case SET + DRIVER + TO_ORDER + START :
        console.log('SET + DRIVER + TO_ORDER + START');
          return state

      case SET + DRIVER + TO_ORDER + SUCCESS:
        console.log('SET + DRIVER + TO_ORDER + SUCCESS, response : ' , response);
          return state

      case DRIVER + LOAD + FAIL:
        console.log('SET + DRIVER + TO_ORDER + FAIL, response : ', response);
          return state

    }

    return state
}
