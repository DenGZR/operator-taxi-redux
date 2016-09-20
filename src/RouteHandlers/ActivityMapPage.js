import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
// import shouldPureComponentUpdate from 'react-pure-render/function'
import GoogleMap from 'google-map-react'
import {Grid, Row, Col} from 'react-bootstrap'
import {makeRequest, Endpoints} from '../utils/api'
import Marker from "../components/Marker"
import FormSetDriverToOrder from "../containers/FormAddDriverToOrder"

import { getDrivers, setToCurrentDriver, setDriverToOrder } from '../AC/driver'
import { getOrders, setToCurrentOrder } from '../AC/order'

class ActivityMapPage extends Component {

  static defaultProps = {
      center: {lat: 50.450000 , lng: 30.500000},
      zoom: 10
  };

  // shouldComponentUpdate = shouldPureComponentUpdate;



  componentWillReceiveProps(nextProps) {

  }

  componentWillMount() {
    const { orders, drivers } = this.props;

    if( !orders.get('loaded') ) {
      this.props.getOrders();
    }
    if( !drivers.get('loaded') ) {
      this.props.getDrivers();
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    console.log("ActivityMap");
    const orders = this.props.orders.get('orderCollection');
    const drivers = this.props.drivers.get('driverCollection');
    const currentOrder = this.props.orders.get('currentOrder');
    const currentDriver = this.props.drivers.get('currentDriver');

    const orderPull = orders.getFreeOrders().toArray();
    const freeDriversPull = drivers.getDriverFreeOnline().toArray();
    const busyDriversPull = drivers.getDriverBusyOnline().toArray();

    // console.log("orderPull",orderPull);
    // console.log("freeDriversPull",freeDriversPull);
    // console.log("busyDriversPull",busyDriversPull);
    // console.log("currentOrder", currentOrder);
    // console.log("currentDriver", currentDriver);

    let markersOrders = orderPull
      .map((order, index) => {
          let showCurrent = false;
          if( currentOrder ) {
            let showCurrent  = order.id === currentOrder.id ? true : false;
          }

          return (
            <Marker
              // required props
              key={order.id}
              lat={order.startPoint.lat}
              lng={order.startPoint.lng}
              // any user props
              markerType="order"
              showInfo={ showCurrent }
              onSelection={this.props.setToCurrentOrder}
              data={order}/>
          )
      });

    let markersDriversFree = freeDriversPull
        .map((driver, index) => (
          <Marker
            // required props
            key={driver.id}
            lat={driver.lastLat}
            lng={driver.lastLng}
            // any user props
            markerType="driversFree"
            onSelection={this.props.setToCurrentDriver}
            data={driver}/>
        ));

    let markersDriversBusy = busyDriversPull
        .map((driver, index) => (
          <Marker
            // required props
            key={driver.id}
            lat={driver.lastLat}
            lng={driver.lastLng}
            // any user props
            markerType="driversBusy"
            onSelection={this.setToCurrentDriver}
            data={driver}/>
      ));

      return (
          <Row className="activity-map">
            <Col xs={12}>
              <FormSetDriverToOrder
                selectOrder={currentOrder}
                selectDriver={currentDriver}
                onRequest={this.handlerMakeRequest}/>
            </Col>
            <Col xs={12} style={{height: '75vh'}}>
                <GoogleMap
                   bootstrapURLKeys={{
                     key: 'AIzaSyCWK6ZJN_I1B7yR_WvOh9jmK8KU-LOA1IA',
                     language: 'ru'
                    }}
                   defaultCenter={this.props.center}
                   defaultZoom={this.props.zoom}>
                   {markersOrders}
                   {markersDriversFree}
                   {markersDriversBusy}
                </GoogleMap>
            </Col>
          </Row>
      )
  }

  handleChange = element => id => {
    console.log(id);
    this.setState({
      [element]: id
    })
  }

  handlerMakeRequest = () => {
    this.props.setDriverToOrder()
  }
}

export default connect((state) => {
    const drivers = state.drivers
    const orders = state.orders
    return { orders,drivers }
}, { getDrivers, getOrders, setToCurrentDriver, setToCurrentOrder, setDriverToOrder })(ActivityMapPage)
