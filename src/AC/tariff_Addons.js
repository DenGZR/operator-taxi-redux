// ** AC **
import {  TARIFF, TARIFF_ADDONS, LOAD, START, SUCCESS, FAIL } from '../constants'
import { Authorisation } from "../utils/authorisation"
import {makeRequest, Endpoints} from  "../utils/api"


export function getTariff() {
    return (dispatch, state) => {
        let { auth } = store.getState()
        let token = auth.get('token')

        dispatch({
            type: TARIFF + LOAD + START
        })

        makeRequest(token, Endpoints.GET_CURRENT_TARIFF())
          .then(response=> {
              if (response.data) {
                dispatch({ type: TARIFF + LOAD + SUCCESS, response })
              }
          })
          .catch(error=> {
              dispatch({ type: TARIFF + LOAD + FAIL, error })
          })
    }
}

export function getTariffAddons() {
    return (dispatch, state) => {
        let { auth } = store.getState()
        let token = auth.get('token')

        dispatch({
            type: TARIFF_ADDONS + LOAD + START
        })

        makeRequest(token, Endpoints.GET_TARIFF_ADDONS())
          .then(response=> {
              if (response.data) {
                dispatch({ type: TARIFF_ADDONS + LOAD + SUCCESS, response })
              }
          })
          .catch(error=> {
              dispatch({ type: TARIFF_ADDONS + LOAD + FAIL, error })
          })
    }
}
