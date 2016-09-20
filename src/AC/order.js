import { ORDER, START, SUCCESS, FAIL, LOAD, SET_TO_CURRENT } from '../constants'
import {makeRequest, Endpoints} from  "../utils/api"

export function setToCurrentOrder(order) {
    return {
        type: SET_TO_CURRENT + ORDER,
        order
    }
}

export function getOrders() {
    return (dispatch, state) => {
        let { auth, orders } = store.getState()
        let token = auth.get('token')
        let timeStamp = orders.get('orderCollection').timeStamp

        dispatch({
            type: ORDER + LOAD + START
        })

        makeRequest( token, Endpoints.GET_ORDER_LIST_AT_TIME(timeStamp) )
          .then(response=> {
              //debugger;
              console.log("ORDER + LOAD ",response.data.orders);
              if (response.data && response.data.orders) {
                console.log("ORDER + LOAD + SUCCESS");
                dispatch({ type: ORDER + LOAD + SUCCESS, response })
              }
          })
          .catch(error=> {
              console.log("ORDER + LOAD + FAIL");
              dispatch({ type: ORDER + LOAD + FAIL, error })
          })
    }
}
