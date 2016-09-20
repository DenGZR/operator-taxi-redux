import auth from './auth'
import orders from './orders'
import drivers from './drivers'
import tariffAddons from './tariff_Addons'
import { reducer as formReducer } from 'redux-form';
import blankOrder from './createOrder'
import mapsUtils from './mapsUtils'

import { combineReducers } from 'redux'

export default combineReducers({
    auth,
    orders,
    drivers,
    tariffAddons,
    blankOrder,
    mapsUtils,
    form: formReducer
})
