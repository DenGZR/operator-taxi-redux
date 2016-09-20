import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import GoogleMap from 'google-map-react'
import {Grid, Row, Col} from 'react-bootstrap'
import { connect } from 'react-redux'
// import { getTariff, getTariffAddons } from '../AC/createOrder'
import { checkLoadMaps } from '../AC/mapsUtils'
import {Point} from '../structures/Point'
import Marker from "../components/Marker"

import {priceTypeName} from '../dicts/priceTypes'
import FormCreateOrder from '../containers/FormCreateOrder'

class OrderCreatePage extends Component {

    static defaultProps = {
        center: {lat: 50.450000 , lng: 30.500000},
        zoom: 10
    };

    state = {
        markers: {}
    };

    componentDidMount() {
      this.props.checkLoadMaps()
    }

    render() {
      console.log('OrderCreatePage');
      // console.log('props', this.props);
      // let markers = this.state.markers;
      // let MarkerList = this.createMarkers(markers);
      // console.log(MarkerList);
        return (
          <Row>
            <Col xs={6} style={{height: '600px'}}>
              <GoogleMap
                 bootstrapURLKeys={{
                   key: 'AIzaSyCWK6ZJN_I1B7yR_WvOh9jmK8KU-LOA1IA',
                   language: 'ru'
                  }}
                 defaultCenter={this.props.center}
                 defaultZoom={this.props.zoom}>
             </GoogleMap>
            </Col>
            <Col xs={6}>
              <FormCreateOrder/>
            </Col>
          </Row>
        )
    }

    handleMarker( actionType, point, pointId ) {
      let {markers, center} = this.state;
      switch (actionType) {
        case 'deleteMarker':
          delete markers[pointId];
          break;
        case 'changeMarker':
          markers[pointId] = {
            'id' : pointId,
            'lat' : point.lat,
            'lng' : point.lng
          }
          break;
        case 'deleteAllMarker':
          markers = {}
          break;
      }
      this.setState({ markers: markers });
    }

    createMarkers( dataMarkers ) {
      let ArrMarkersList = [];
      for (let marker in dataMarkers) {
        if (dataMarkers.hasOwnProperty(marker)) {
          let listItem = <Marker
            // required props
            key={dataMarkers[marker].id}
            lat={dataMarkers[marker].lat}
            lng={dataMarkers[marker].lng}
            // any user props
            markerType="point"
            id={dataMarkers[marker].id}/>

          ArrMarkersList.push(listItem);
        }
      }
      return ArrMarkersList;
    }


}

export default connect((state) => {
    const order = state.blankOrder
    return { order }
}, { checkLoadMaps })(OrderCreatePage)
