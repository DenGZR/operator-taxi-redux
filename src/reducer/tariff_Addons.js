// **  reducer **
import {
  TARIFF,
  TARIFF_ADDONS,
  START,
  SUCCESS,
  FAIL,
  LOAD  } from '../constants'
import { Map, List, fromJS} from 'immutable'

const initial = fromJS({
  tariff: {
    isLoading: false,
    loaded: false,
    data: {}
  },
  tariffAddons: {
    isLoading: false,
    loaded: false,
    data: []
  }
})

export default (state = initial, action) => {
    const { type, response } = action

    switch (type) {
// LOAD TARIFF
        case TARIFF + LOAD + START:
          console.log('TARIFF + LOAD + START');
          return state.setIn(['tariff', 'isLoading'], true)

        case TARIFF + LOAD + SUCCESS:
          console.log('TARIFF + LOAD + SUCCESS, TARIFF ' , response.data);
            return state
                .setIn(['tariff', 'isLoading'], false)
                .setIn(['tariff', 'loaded'], true)
                .setIn(['tariff', 'data'], response.data)

         case TARIFF + LOAD + FAIL:
            console.log('TARIFF + LOAD + FAIL');
              return state
              .setIn(['tariff', 'isLoading' ], false)
              .setIn(['tariff', 'loaded' ], false)
              .setIn(['tariff', 'data' ], {})

  // LOAD TARIFF_ADDONS
          case TARIFF_ADDONS + LOAD + START:
            console.log('TARIFF_ADDONS + LOAD + START');
              // return state.setIn(['tariffAddons', 'isLoading' ], true)
            return state

          case TARIFF_ADDONS + LOAD + SUCCESS:
            console.log('TARIFF_ADDONS + LOAD + SUCCESS, TARIFF ' , response.data);
              return state
                  .setIn(['tariffAddons', 'isLoading' ], false)
                  .setIn(['tariffAddons', 'loaded' ], true)
                  .setIn(['tariffAddons', 'data' ], response.data)

           case TARIFF_ADDONS + LOAD + FAIL:
             console.log('TARIFF_ADDONS + LOAD + FAIL');
               return state
               .setIn(['tariffAddons', 'isLoading' ], false)
               .setIn(['tariffAddons', 'loaded' ], false)
               .setIn(['tariffAddons', 'data' ], [])

    }
    return state
}
