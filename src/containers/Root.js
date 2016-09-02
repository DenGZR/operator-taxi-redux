import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import { Link } from 'react-router'
import {Grid, Row, Col} from 'react-bootstrap'

class Root extends Component {
    static propTypes = {

    };

    render() {
        return (
            <Provider store = {store}>
              <Grid>
                <Row className="page-layout">
                  <Col xs={12}>
                    <span>Header</span>
                  </Col>
                  <Col xs={12}>
                    {this.props.children}
                  </Col>
                </Row>
              </Grid>
            </Provider>
        )
    }
}

export default Root
//
// <Provider store = {store}>
//   <Grid>
//     <Row className="page-layout">
//       <Col xs={12}>
//         <Header currentLocation={location.pathname}/>
//       </Col>
//       <Col xs={12}>
//         {this.props.children}
//       </Col>
//     </Row>
//   </Grid>
// </Provider>
