import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import {Grid, Row, Col} from 'react-bootstrap'

class Root extends Component {
    static propTypes = {

    };

    render() {
        return (
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
        )
    }
}

export default Root
