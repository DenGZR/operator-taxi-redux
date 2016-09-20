import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import {Grid, Row, Col} from 'react-bootstrap'
import { getOrders } from '../AC/order'
import {Table, Field} from "../components/Table"
import {DateTime} from "../components/DateTime"
import {StatusTimer} from "../components/StatusTimer"
import {StatusSelect} from "../components/StatusSelect"
import {PopupOrderDescription, BtnOrderDescription} from "../components/PopupOrderDescription"
import {User} from "../components/User"
import {Waypoints} from "../components/Waypoints"
import { AlertPopup, TYPE_ERROR, TYPE_INFO, TYPE_SUCCESS} from '../components/Alert'

class OrdersPage extends Component {

  state = {
      currentOrder: null
  }
  componentDidMount() {
    this.props.getOrders();
      // this.loadData();
      // this._autoUpdate = setInterval( () => {
      //   this.loadData();
      // } , 5000);
  }

  componentWillUnmount() {
      // clearInterval(this._autoUpdate);

  }

  render() {
    console.log("orders");
    const orders = this.props.orders.get('orderCollection');
    const orderPull = orders.getFreeOrders().sortByDuration();

    return (
      <Row className="order-list">
        <Col xs={12} >
          <Table
            data={orderPull}
            fields={this.mainTableFields}/>
        </Col>
      </Row>

    );
  }

  mainTableFields = [
          new Field("Создан",
              (/*Order*/order) => <DateTime>{order.createdAt}</DateTime>, 10),
          new Field("Желаемое время",
              (/*Order*/order) => <DateTime>{order.scheduledAt}</DateTime>, 10),
          new Field("Заказ",
              (/*Order*/order) => <BtnOrderDescription order={order} togglePopup={this.togglePopup} />, 10),
          new Field("Статус",
              (/*Order*/order) => <span>{order.statusName}</span>, 10),
          new Field("Без ответа",
              (/*Order*/order) => <StatusTimer order={order}/>, 10),
          new Field("Путь",
              (/*Order*/order) => <Waypoints>{order.waypoints}</Waypoints>, 15),
          new Field("Стоимость",
              (/*Order*/order) => <span>{order.price}</span>, 10),
          new Field("Клиент",
              (/*Order*/order) => <User>{order.client}</User>, 10),
          // new Field("Водитель",
          //     (/*Order*/order) => <User>{order.driver}</User>, 10),
          new Field("Комментарий",
              (/*Order*/order) => <p>{order.operatorComment}</p>, 10)
      ];
}

export default connect((state) => {
    const orders = state.orders
    return { orders }
}, { getOrders })(OrdersPage)
