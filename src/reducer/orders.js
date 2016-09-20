import { ORDER, START, SUCCESS, FAIL, LOAD, SET_TO_CURRENT  } from '../constants'
import { Record, OrderedMap, Map, List } from 'immutable'
import { OrderCollection } from "../models/Order"

// get Order Collection
let OrderColl = new OrderCollection();
const orders = new Map({
    isLoading: false,
    loaded: false,
    currentOrder: {},
    orderCollection: OrderColl
})

export default (state = orders, action) => {
    const { type, response, order } = action

    switch (type) {
// SET_TO_CURRENT
      case SET_TO_CURRENT + ORDER :
        console.log('SET_TO_CURRENT + ORDER');
          return state.set('currentOrder', order)
// LOAD ORDERS
      case ORDER + LOAD + START :
        console.log('ORDER + LOAD + START');
          return state.set('isLoading', true)

      case ORDER + LOAD + SUCCESS:
        let orderCollection = state.get('orderCollection');
        orderCollection.fromServer(response.data);
        console.log('ORDER + LOAD + SUCCESS, orderCollection' , orderCollection);
          return state
              .set('isLoading', false)
              .set('loaded', true)
              .set('orderCollection', orderCollection)

        case ORDER + LOAD + FAIL:
          console.log('ORDER + LOAD + FAIL');
            return state
                .set('isLoading', false)
                .set('loaded', false)

    }

    return state
}
