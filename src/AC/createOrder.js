import {  TARIFF, TARIFF_ADDONS, CHANGE, ORDER, LOAD, START, SUCCESS, FAIL } from '../constants'
import { Authorisation } from "../utils/authorisation"
import {makeRequest, Endpoints} from  "../utils/api"

export function changeOrder(order) {
  return {
    type: CHANGE + ORDER,
    order
  }
}
