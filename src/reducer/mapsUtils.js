import { MAPS, LOAD, COMPLETE, CHECK } from '../constants'
import Immutable, { Map, List } from 'immutable'

let initial = {
  googleMaps: {
    isLoading: false,
    loaded: false,
    maps: null
  },
  mapMarkers: [],
  usedEvents: null,
  autocompleteList: [],
  currentLocation: {
    isLocated: false,
    latitude: null,
    longitude: null
  },
  calculating: false,
  routeData: {
    distance: 0,
    duration: 0
  }
}

initial = Immutable.fromJS(initial)

export default (state = initial, action) => {
  const { type, googleMaps } = action

  switch (type) {
    // case CHECK + LOAD + MAPS :

    case MAPS + LOAD + COMPLETE :
      return state
        .setIn(['googleMaps' , 'loaded'], true)
        .setIn(['googleMaps' , 'maps'], googleMaps)
        // .set('Autocomplete', new googleMaps.places.Autocomplete)
        // .set('SearchBox', new googleMaps.places.SearchBox)
        // .set('Geocoder', new googleMaps.Geocoder())
        // .set('DirectionsService', new googleMaps.DirectionsService())

  }
  return state

}
//
// DirectionsDisplay: new window.google.maps.DirectionsRenderer(),
// Geocoder: new window.google.maps.Geocoder(),
// Marker: new window.google.maps.Marker(),
// Autocomplete: window.google.maps.places.Autocomplete,
// SearchBox: window.google.maps.places.SearchBox
