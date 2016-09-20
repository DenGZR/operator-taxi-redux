import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap'
import { Field, reduxForm } from 'redux-form'
import { setDriverToOrder } from '../../AC/driver'
import { connect } from 'react-redux'

let FormSetDriverToOrder = (props) => {
    const { selectOrder, selectDriver, onRequest } = props

    const orderId = selectOrder.id || '';
    const driverId = selectDriver.id || '';
    const disabledBtn = selectOrder.id && selectDriver.id ? '' : 'disabled'

    const handleSubmit = (ev) => {
      ev.preventDefault()
      onRequest()
    }

    return (
        <Row className="panel panel-default form-add-driver-to-order">
            <div className="panel-heading">
              <h3 className="panel-title">Назначить водителя на заказ : </h3>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                  <Col xs={4} >
                    <div className="input-group">
                      <span className="input-group-addon" id="basic-addon1">ID заказа</span>
                      <input
                        name="orderId"
                        type="text"
                        value={orderId}
                        className="form-control"
                        placeholder="ID заказа ... "/>
                    </div>
                    <div className="input-group">
                      <span className="input-group-addon" id="basic-addon1">ID водителя</span>
                      <input
                        name="driverId"
                        type="text"
                        value={driverId}
                        className="form-control"
                        placeholder="ID водителя ... "/>
                    </div>
                  </Col>
                  <Col xs={4} >
                    <div className="input-group">
                       <Field
                        name="notes"
                        component="textarea"
                        id="comments"
                        className="form-control"
                        placeholder="Комментарии ..."/>
                    </div>
                  </Col>
                  <Col xs={4} >
                    <div className="input-group">
                      <button type="submit" className={"btn btn-primary " + disabledBtn }>Назначить</button>
                    </div>
                  </Col>
              </form>
            </div>
        </Row>

    )
};
// <textarea
//   name="comments"
//   rows="3"
//   id="comments"
//   className="form-control"
//   placeholder="Комментарии ..."/>

export default reduxForm({
  form: 'formSetDriverToOrder'  // a unique identifier for this form
})(FormSetDriverToOrder)
