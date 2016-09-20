import { DRIVER, ORDER, START, SUCCESS, FAIL, LOAD, SET_TO_CURRENT, TO_ORDER } from '../constants'
import {makeRequest, Endpoints} from  "../utils/api"

export function setToCurrentDriver(driver) {
    return {
        type: SET_TO_CURRENT + DRIVER,
        driver
    }
}

export function getDrivers() {
    return (dispatch, state) => {
        let { auth, drivers } = store.getState()
        let token = auth.get('token')

        dispatch({
            type: DRIVER + LOAD + START
        })

        makeRequest( token, Endpoints.GET_DRIVER_LIST() )
          .then(response=> {
              //debugger;
              console.log("DRIVER + LOAD ",response.data.data);
              if (response.data && response.data.data) {
                console.log("DRIVER + LOAD + SUCCESS");
                dispatch({ type: DRIVER + LOAD + SUCCESS, response })
              }
          })
          .catch(error=> {
              console.log("DRIVER + LOAD + FAIL");
              dispatch({ type: DRIVER + LOAD + FAIL, error })
          })
    }
}

export function setDriverToOrder() {
    return (dispatch, state) => {
        const { auth, drivers, orders, form } = store.getState()
        const token = auth.get('token')
        const currentOrder = orders.get('currentOrder')
        const currentDriver = drivers.get('currentDriver')
        const comment = form.formSetDriverToOrder.values ? form.formSetDriverToOrder.values.notes : ''
        console.log('comment', comment);

        dispatch({
            type: SET + DRIVER + TO_ORDER + START
        })

        makeRequest( token, Endpoints.POST_DRIVER_TO_ORDER(),{
          order_id: parseInt(currentOrder.id, 10),
          driver_id: parseInt(currentDriver.id,10),
          comment: comment
        })
          .then(response=> {
              //debugger;
              console.log("SET + DRIVER + TO_ORDER  ",response.data);
              if ( response.data ) {
                console.log("SET + DRIVER + TO_ORDER + SUCCESS");
                dispatch({ type: SET_TO_CURRENT + DRIVER, driver : {} })
                dispatch({ type: SET_TO_CURRENT + ORDER, order : {} })
              }
          })
          .catch(error=> {
              console.log("SET + DRIVER + TO_ORDER + FAIL");
              dispatch({ type: SET + DRIVER + TO_ORDER + FAIL, error })
          })
    }
}
