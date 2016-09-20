// **  reducer **
import { TARIFF, TARIFF_ADDONS, ORDER, CHANGE, START, SUCCESS, FAIL, LOAD  } from '../constants'
import { Record, OrderedMap, Map, List, fromJS} from 'immutable'
import { OrderForServer } from "../models/Order"
import { Point } from '../structures/Point'

const initial = fromJS({
    client:{
        first_name: "",
        gender: "",
        id: 0,
        last_name: "",
        middle_name: "",
        phone: "",
        service_id: 0
    },
    way_points: {
      start: new Point(),
      end: new Point(),
      middle: []
    },
    comment: null,
    scheduled: false,
    scheduled_at: '',
    passengers: 1,
    tariff_addons: [],
    on_city: false
})

export default (state = initial, action) => {
    const { type, response, order } = action

    switch (type) {
 // CHANGE ORDER
       case CHANGE + ORDER :
         console.log('CHANGE + ORDER ', order);
        debugger
         return state.setIn(['order', 'data' ], order)




    }

    return state
}
