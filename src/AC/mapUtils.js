//  import map style
import * as style from '../../components/MapLayout/utils/mapStyle'

import { incomingNotice } from './notifier'
import { calculateTripCost, fare, calculatingProcessed, orderDestinations } from './order'

export const ADD_MARKER = 'ADD_MARKER'
export const CREATE_MAP = 'CREATE_MAP'
export const USER_LOCATION = 'USER_LOCATION'
export const ERROR_RECEIVE = 'ERROR_RECEIVE'
export const REMOVE_ALL_MARKERS = 'REMOVE_ALL_MARKERS'
export const REMOVE_MARKER = 'REMOVE_MARKER'
export const MAP_VIEW_CHANGE = 'MAP_VIEW_CHANGE'
export const ADD_EVENT = 'ADD_EVENT'
export const TRIP_DIST_AND_DUR = 'TRIP_DIST_AND_DUR'
export const DRAGEND = 'DRAGEND'

export function addMarker (data = []) {
  return {
    type: ADD_MARKER,
    payload: data
  }
}

export function wasDragend (data = false) {
  return {
    type: DRAGEND,
    payload: data
  }
}

export function tripDistAndDur (routesData = {}) {
  return {
    type: TRIP_DIST_AND_DUR,
    payload: routesData
  }
}

export function addEvent (data = {}) {
  return {
    type: ADD_EVENT,
    payload: data
  }
}

export function removeMarker (data = []) {
  return {
    type: REMOVE_MARKER,
    payload: data
  }
}

export function removeAllMarkers () {
  const data = []
  return {
    type: REMOVE_ALL_MARKERS,
    payload: data
  }
}

export function errorReceive (data = '') {
  return {
    type: ERROR_RECEIVE,
    payload: data
  }
}

export function whereIAm (data = {}) {
  return {
    type: USER_LOCATION,
    payload: data
  }
}

export function addMapToState (data = {}) {
  return {
    type: CREATE_MAP,
    payload: data
  }
}

export function mapViewChange (data = {}) {
  return {
    type: MAP_VIEW_CHANGE,
    payload: data
  }
}

export function initMap (mapHolder = 'map', userCoords = {}) {
  return function (dispatch, getState) {
    //debugger
    //console.log("initMap getState",getState());
    const googleMaps = getState().mapUtils.google
    const MapObj = new googleMaps.Map(document.getElementById(mapHolder), {
      zoom: userCoords.zoom,
      center: new googleMaps.LatLng( userCoords.latitude, userCoords.longitude ), // Kiev coords
      disableDefaultUI: true
    })
    MapObj.set('styles', style.mapStyle)

    MapObj.panBy(-Math.floor(MapObj.getDiv().offsetWidth / 4), 0)

    dispatch(addMapToState(MapObj))
    if (!getState().mapUtils.usedEvents) {
      //  add click, dragend and resize events
      dispatch(addEvents())
    }
  }
}

export function drawDirections () {
  return function (dispatch, getState) {
    const Map = getState().mapUtils.appMap
    let waypoints = []
    let waypointsArr = []
    const markersArray = getState().mapUtils.mapMarkers

    let origin = {
      lat: markersArray.slice(0)[0].position.lat(),
      lng: markersArray.slice(0)[0].position.lng(),
      addr_string: markersArray.slice(0)[0].addr_string
    }
    let destination = {
      lat: markersArray.slice(-1)[0].position.lat(),
      lng: markersArray.slice(-1)[0].position.lng(),
      addr_string: markersArray.slice(-1)[0].addr_string
    }
    // push in to two arrays because goggle api dont work with formatted address,
    // make clone by slice(0) work slow, while cloning also delete formatted address
    if (markersArray.length > 2) {
      for (var i = 1; i < markersArray.length - 1; i++) {
        // for taxi api order
        waypoints.push({
          lat: markersArray[i].position.lat(),
          lng: markersArray[i].position.lng(),
          addr_string: markersArray[i].addr_string
        })
        // for google api directions
        waypointsArr.push({
          location: {
            lat: markersArray[i].position.lat(),
            lng: markersArray[i].position.lng()
          },
          stopover: true
        })
      }
    }

    dispatch(orderDestinations({
      start_point: Object.assign({}, origin),
      end_point: Object.assign({}, destination),
      way_points: waypoints
    }))

    delete origin['addr_string']
    delete destination['addr_string']

    getState().mapUtils.DirectionsDisplay.setDirections({ routes: [] })
    getState().mapUtils.DirectionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypointsArr,
      travelMode: 'DRIVING'
    }, function (response, status) {
      var move = null
      var moveMap = null
      var screenDelta = null
      if (status === getState().mapUtils.google.DirectionsStatus.OK) {
        // console.log(response)
        getState().mapUtils.DirectionsDisplay.setMap(Map)
        getState().mapUtils.DirectionsDisplay.setOptions({ suppressMarkers: true, polylineOptions: {
          strokeWeight: 4,
          strokeOpacity: 0.5,
          strokeColor: 'red'
        }})
        getState().mapUtils.DirectionsDisplay.setDirections(response)
        let farWest = null
        let farEast = null
        response.routes[0].legs.forEach((item, index) => {
          farWest = Math.min(item.start_location.lng(), item.end_location.lng(), (farWest || 999))
          farEast = Math.max(item.start_location.lng(), item.end_location.lng(), (farEast || 0))
        })
        const pointsDelta = farEast - farWest

        move = function () {
          screenDelta = Map.getBounds().getNorthEast().lng() - Map.getBounds().getCenter().lng()
          var SWNE = Map.getBounds().toJSON()
          Map.fitBounds({
            south: SWNE.south,
            west: SWNE.west - screenDelta * 0.5,
            north: SWNE.north,
            east: SWNE.east - screenDelta * 0.5
          })
        }
        moveMap = function (pointsDelta, farEast, farWest) {
          screenDelta = getScreenDelta()
          if (screenDelta > pointsDelta) {
            move()
            if (needBigger()) {
              makeBigger()
            }
          } else {
            makeSmaller()
            move()
            if (needBigger()) {
              makeBigger()
            }
          }

          function needBigger () {
            screenDelta = getScreenDelta()
            return screenDelta > pointsDelta * 0.7
          }

          function makeSmaller () {
            Map.setZoom(Map.getZoom() - 1)
          }

          function makeBigger () {
            Map.setZoom(Map.getZoom() + 1)
          }

          function getScreenDelta () {
            return Map.getBounds().getNorthEast().lng() - Map.getBounds().getCenter().lng()
          }
        }

        setTimeout(() => {
          moveMap(pointsDelta, farEast, farWest)
        }, 0)

        dispatch(routeDistanceAndDuration(response))
      } else {
        dispatch(incomingNotice({
          isFail: true,
          errorMessage: 'Directions request failed due to ' + status
        }))
      }
    })
  }
}

export function askUserLocation () {
  return function (dispatch, getState) {

    navigator.geolocation.getCurrentPosition((response) => {
      console.log("geolocation",response)
      const { latitude, longitude } = response.coords

      dispatch(whereIAm({latitude: latitude, longitude: longitude, isLocated: true}))
    }, (error) => {
      console.warn('ERROR(' + error.code + '): ' + error.message)
      dispatch(errorReceive({error: `ERROR(${error.code}):${error.message}`}))
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  }
}

export function setCurrentPositionToMap () {
  return function (dispatch, getState) {
    // console.log('setCurrentPositionToMap getState', getState());
    const Map = getState().mapUtils.appMap
    const { latitude, longitude } = getState().mapUtils.currentLocation

    Map.setCenter({lat: latitude, lng: longitude})
    Map.setZoom(12)
    Map.panBy(-Math.floor(Map.getDiv().offsetWidth / 4), 0)

    dispatch(mapViewChange({appMap: Map}))
    // доделать после изменения заказа центровку на положении пользователя
    // Добавить отрисовку маршрута который отдает сервер
  }
}

export function clearMap () {
  return function (dispatch, getState) {
    getState().mapUtils.DirectionsDisplay.setDirections({ routes: [] })
    let markerArr = getState().mapUtils.mapMarkers
    markerArr.forEach(function (marker) {
      marker.setMap(null)
    })
    dispatch(removeAllMarkers())
  }
}

export function clearPolyline () {
  return function (dispatch, getState) {
    getState().mapUtils.DirectionsDisplay.setDirections({ routes: [] })
  }
}

export function addEvents () {
  return function (dispatch, getState) {
    const Map = getState().mapUtils.appMap
    const Maps = getState().mapUtils.google
    const usedEvents = getState().mapUtils.usedEvents
    if (!usedEvents) {
      const mapResizeListener = Maps.event.addDomListener(window, 'resize', () => {
        const center = Map.getCenter()
        Maps.event.trigger(Map, 'resize')
        Map.setCenter(center)
      })
      const mapClickListener = Map.addListener('click', (e) => {
        const markersArray = getState().mapUtils.mapMarkers
        if (markersArray.length <= 5) {
          dispatch(reverseGeocoding({'location': e.latLng}))
        }
      })
      dispatch(addEvent({
        mapResizeListener: mapResizeListener,
        mapClickListener: mapClickListener
      }))
    }
  }
}

export const createMarker = (latlng = {}, formatedAddress = '') => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      const appMap = getState().mapUtils.appMap
      const google = getState().mapUtils.google
      const markersArray = [...getState().mapUtils.mapMarkers]
      const fromIMG = getState().mapUtils.fromIMG
      const toIMG = getState().mapUtils.toIMG

      const markerImage = markersArray.length >= 1 ? toIMG : fromIMG
      const Marker = new google.Marker({
        position: latlng,
        draggable: true,
        animation: google.Animation.DROP,
        icon: {
          url: markerImage,
          origin: new google.Point(0, 0),
          anchor: new google.Point(38, 45),
          scaledSize: new google.Size(75, 75)
        },
        map: appMap
      })
      Marker.addListener('dblclick', function () {
        const _this = this
        const markersArray = getState().mapUtils.mapMarkers
        let newArr = []
        let id = null
        for (var key in _this) {
          if (key.indexOf('closure_uid') === 0) {
            id = key
          }
        }
        if (markersArray.slice(-1)[0][id] === _this[id]) {
          markersArray.forEach((item, i) => {
            console.log(`item: ${item[id]} | _this: ${_this[id]}`)
            if (item[id] === _this[id]) {
              google.event.clearInstanceListeners(item)
              Marker.setMap(null)
            } else {
              newArr.push(item)
            }
          })
          dispatch(addMarker(newArr))
          if (markersArray.length >= 2) {
            setTimeout(() => {
              dispatch(drawDirections())
            }, 500)
          }
        } else {
          dispatch(incomingNotice({
            notice: 'Можно удалить только последний добавленый маркер'
          }))
        }
      })
      Marker.addListener('dragend', function (e) {
        dispatch(wasDragend({dragend: true}))
        dispatch(reverseGeocoding({
          'location': {lat: e.latLng.lat(), lng: e.latLng.lng()}
        }, true, this))
        if (getState().mapUtils.mapMarkers.length >= 2) {
          setTimeout(() => {
            dispatch(drawDirections())
          }, 500)
        }
      })
      Marker['addr_string'] = formatedAddress
      markersArray.push(Marker)
      dispatch(addMarker(markersArray))
      if (getState().mapUtils.mapMarkers.length >= 2) {
        setTimeout(() => {
          dispatch(drawDirections())
        }, 500)
      }
      resolve()
    })
  }
}

export const reverseGeocoding = (latlng, dragend, currentMarker) => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      const Geocoder = getState().mapUtils.Geocoder
      const google = getState().mapUtils.google
      Geocoder.geocode(latlng, (results, status) => {
        if (status === google.GeocoderStatus.OK) {
          if (results[1]) {
            dispatch(googlePlaceParser(results[0]))
            results.forEach((item) => {
              if (item.types.indexOf('country') !== -1 && item.address_components[0].short_name === 'UA') {
                if (!dragend) {
                  const address = results[0].formatted_address.replace('Unnamed Road,', '')
                  console.log(latlng.location)
                  dispatch(createMarker(latlng.location, address))
                }
                if (dragend) {
                  currentMarker['addr_string'] = results[0].formatted_address.replace('Unnamed Road,', '')
                }
              } else if (item.types.indexOf('country') !== -1 && item.address_components[0].short_name !== 'UA') {
                dispatch(incomingNotice({
                  notice: 'Выберите маршрут в пределах Украины.'
                }))
              }
            })
          } else {
            console.log('No results found')
          }
        } else {
          console.log('Geocoder failed due to: ' + status)
        }
      })
      resolve()
    })
  }
}

export const routeDistanceAndDuration = (response = {}) => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      let distance = 0
      let duration = 0
      response.routes.forEach((item, index) => {
        item.legs.forEach((leg, i) => {
          distance += leg.distance.value
          duration += leg.duration.value
        })
      })
      dispatch(tripDistAndDur({distance: distance, duration: duration}))
      if (!!distance && !!duration) {
        setTimeout(() => {
          dispatch(calculateTripCost())
        }, 500)
      } else {
        dispatch(calculatingProcessed({calculating: true}))
        setTimeout(() => {
          dispatch(fare(0))
          dispatch(calculatingProcessed({calculating: false}))
        }, 200)
      }
      resolve()
    })
  }
}

export const googlePlaceParser = (addressArr = []) => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      var _parsPlace = null
      var _parsePlaceResponse = null
      _parsPlace = function (arr, searchWord) {
        let result = null
        arr.forEach(function (i) {
          if (i.types.indexOf(searchWord) !== -1) {
            result = i.long_name
          }
        })
        return result
      }

      _parsePlaceResponse = function (place) {
        const formatedPlace = {
          lat: place.geometry.location.lat() || '',
          lng: place.geometry.location.lng() || '',
          title: place.formatted_address.replace('Unnamed Road', '') || '',
          addr_str: place.formatted_address.replace('Unnamed Road', '') || '',
          postcode: _parsPlace(place.address_components, 'postal_code') || '',
          country: _parsPlace(place.address_components, 'country') || '',
          state: _parsPlace(place.address_components, 'administrative_area_level_1') || '',
          city: _parsPlace(place.address_components, 'locality') || '',
          street: _parsPlace(place.address_components, 'locality') || '',
          district: _parsPlace(place.address_components, 'sublocality_level_1') || '',
          building: _parsPlace(place.address_components, 'street_number') || ''
        }
        console.log(formatedPlace)
      }
      _parsePlaceResponse(addressArr)
      resolve()
    })
  }
}

export const actions = {
  reverseGeocoding,
  initMap,
  addMarker,
  removeMarker,
  removeAllMarkers,
  addMapToState,
  drawDirections,
  whereIAm,
  askUserLocation,
  clearMap,
  mapViewChange,
  setCurrentPositionToMap,
  addEvent,
  addEvents,
  clearPolyline,
  createMarker,
  routeDistanceAndDuration,
  tripDistAndDur,
  googlePlaceParser,
  wasDragend
}

const ACTION_HANDLERS = {
  [ADD_MARKER]: (state, action) => Object.assign({}, state, {mapMarkers: [...action.payload]}),
  [REMOVE_ALL_MARKERS]: (state, action) => Object.assign({}, state, {mapMarkers: [...action.payload]}),
  [REMOVE_MARKER]: (state, action) => Object.assign({}, state, {mapMarkers: [...action.payload]}),
  [CREATE_MAP]: (state, action) => Object.assign({}, state, {appMap: action.payload}),
  [USER_LOCATION]: (state, action) => Object.assign({}, state, {currentLocation: action.payload}),
  [ERROR_RECEIVE]: (state, action) => Object.assign({}, state, action.payload),
  [MAP_VIEW_CHANGE]: (state, action) => Object.assign({}, state, action.payload),
  [ADD_EVENT]: (state, action) => Object.assign({}, state, {usedEvents: action.payload}),
  [TRIP_DIST_AND_DUR]: (state, action) => Object.assign({}, state, {routeData: action.payload}),
  [DRAGEND]: (state, action) => Object.assign({}, state, action.payload)
}

const initial = {
  appMap: null,
  google: window.google.maps,
  mapMarkers: [],
  usedEvents: null,
  autocompleteList: [],
  currentLocation: {
    isLocated: false,
    latitude: null,
    longitude: null
  },
  DirectionsService: new window.google.maps.DirectionsService(),
  DirectionsDisplay: new window.google.maps.DirectionsRenderer(),
  Geocoder: new window.google.maps.Geocoder(),
  Marker: new window.google.maps.Marker(),
  Autocomplete: window.google.maps.places.Autocomplete,
  SearchBox: window.google.maps.places.SearchBox,
  error: null,
  notice: null,
  calculating: false,
  toIMG: '/images/marker_ico/geo_to.svg',
  fromIMG: '/images/marker_ico/geo_from_shadow.svg',
  routeData: {
    distance: 0,
    duration: 0
  },
  dragend: false
}

export default function mapUtils (state = initial, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
