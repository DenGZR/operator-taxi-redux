import { INCOMING_NOTICE, CLEAR_NOTICE  } from '../constants'
/* Actions */
export function incomingNotice (data = {}) {
  return {
    type: INCOMING_NOTICE,
    data
  }
}
export function clearNotice (data = {}) {
  return {
    type: CLEAR_NOTICE,
    data
  }
}
