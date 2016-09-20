import React, {Component} from 'react'
import Loader from 'react-loader'
import {InputPlace} from '../../components/InputPlace'
import { connect } from 'react-redux'
import { getTariff, getTariffAddons } from '../../AC/tariff_Addons'
import { changeOrder } from '../../AC/createOrder'
// import {  } from '../AC/mapsUtils'
// import { Point } from '../structures/Point'

class FormCreateOrder extends Component {

  state = {
    addons: []
  }

  componentWillReceiveProps(newProps) {

  }

  componentDidMount() {

    this.props.getTariff()
    this.props.getTariffAddons()
  }

  render() {
// debugger
    const { order, googleMaps, isMapLoaded } = this.props;
    console.log('googleMaps', googleMaps);
    console.log('order', order);

    return (
      <Loader loaded={isMapLoaded}>
          <form onSubmit={this.handleCreate} className="order-create" >
              <InputPlace
                  point={order.way_points.start}
                  key={'start'}
                  onChange={this.placeChange(order.startPoint)}
                  onDelete={this.placeDelete(order.startPoint)}/>


                <InputPlace
                    key={'end'}
                    point={order.way_points.end}
                    onChange={this.placeChange(order.endPoint)}
                    onDelete={this.placeDelete(order.endPoint)}/>

                <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={this.handleAddWayPoint} >+</button>
                </div>
          </form>
      </Loader>
    )
  }
  placeChange = typePoint => point=> {
      const {order,changeOrder} = this.props

      // order.setWayPoint(typePoint.id, point)
      changeOrder(order)
      console.log('placeChange order', order)
  }

  placeDelete = typePoint => point=> {
      const {order, changeOrder} = this.props
      // this.props.onHandleMarker('deleteMarker', null ,pointId);
      // order.removeWayPoint(typePoint.id)
      changeOrder(order)
      console.log('placeDelete order', order)

  }

  handleAddWayPoint = () => {
  //  добавим новые чистый input для дополнительной точки
    const {order, changeOrder} = this.props;
    // order.addMiddlePoint();
    changeOrder(order)
  }
}

export default connect((state) => {
 // debugger
    const order = state.blankOrder.toJS()
    const addons = state.tariffAddons.getIn(['tariffAddons', 'data'])
    const isMapLoaded = state.mapsUtils.getIn(['googleMaps' , 'loaded'])
    return { order, addons, isMapLoaded }
}, { getTariff, getTariffAddons, changeOrder })(FormCreateOrder)




    //
    // handleCreateOrder(e) {
    //     e.preventDefault();
    //     let {order, serverResponse, showPortal } = this.state;
    //     let createdOrder = order.prepare();
    //     let cleanMap = this.props.onHandleMarker;
    //     // добавлено для теста отправки order
    //     console.log(" send order",  order.prepare());
    //
    //     makeRequest(Endpoints.POST_CREATE_ORDER(), createdOrder )
    //        .then(response=>{
    //          let {netWorkManager} = response;
    //          showPortal = netWorkManager.result.isError;
    //          serverResponse = netWorkManager;
    //          if(!serverResponse.result.isError) {
    //             order = new Order();
    //             cleanMap('deleteAllMarker');
    //          }
    //          this.setState({showPortal,serverResponse,order});
    //        })
    //        .catch(error=>{
    //          console.log('Server response Error :', error)
    //        });
    // }
    //
    // placeAdd(point) {
    //     const {order} = this.state;
    //     order.addWayPoint(point);
    //     point.fillPlaceName()
    //         .then(this.update);
    // }
    //
    // placeChange(pointId, point) {
    //     const {order} = this.state;
    //
    //     order.setWayPoint(pointId, point);
    //     this.props.onHandleMarker('changeMarker', point, pointId );
    //     point.fillPlaceName()
    //         .then(this.update);
    // }
    //
    // placeDelete(pointId) {
    //     const {order} = this.state;
    //     this.props.onHandleMarker('deleteMarker', null ,pointId);
    //     order.removeWayPoint(pointId);
    //     this.update();
    // }
    //
    // update() {
    //     const {order} = this.state;
    //     this.setState({order});
    // }
    //
    //
    //
    // handleAddWayPoint() {
    //     //  добавим новые чистый input для дополнительной точки
    //     let point =  new Point();
    //     this.placeAdd(point);
    //
    // }
    //
    // handleAddon(e) {
    //     const {order} = this.state;
    //     order.toggleAddon(e.target.dataset.addonid);
    //     this.update();
    // }
    //
    // handleClientInfo(e) {
    //   const {order} = this.state;
    //   let value = e.target.value;
    //   let inputName = e.target.getAttribute("data-input-name");
    //   if(inputName === 'client_phone') {
    //     //checkValidation()
    //     value = value;
    //   }
    //   if(inputName === 'passengers') {
    //     value = parseInt(value, 10);
    //   }
    //   //console.log('key',inputName , 'val', value );
    //   order.ClientInfo(inputName , value);
    //   this.update();
    // }
    //
    // handleAlertPopup() {
    //   let {showPortal} = this.state;
    //   showPortal = !showPortal;
    //   this.setState({showPortal});
    // }

  //   <form onSubmit={this.handleCreate} className="order-create" >
  //       <InputPlace key={order.startPoint.id}
  //           point={order.startPoint}
  //           onChange={this.placeChange.bind(this, order.startPoint.id)}
  //           onDelete={this.placeDelete.bind(this, order.startPoint.id)}/>
  //       {
  //           order.middlePoints.map((point, i) =>
  //               <InputPlace key={i}
  //                   point={point}
  //                   onChange={this.placeChange.bind(this, point.id)}
  //                   onDelete={this.placeDelete.bind(this, point.id)}/>
  //           )
  //       }
  //       <InputPlace key={order.endPoint.id}
  //         point={order.endPoint}
  //         onChange={this.placeChange.bind(this, order.endPoint.id)}
  //         onDelete={this.placeDelete.bind(this, order.endPoint.id)}/>
  //
  //       <div className="btn-group" role="group">
  //           <button type="button" className="btn btn-default" onClick={this.handleAddWayPoint.bind(this)} >+</button>
  //       </div>
  //       <ol className="addons-list">
  //           {this.state.addons.map((addon, i)=> {
  //               return (
  //                   <li key={i}>
  //                       <label ><input type="checkbox"
  //                                  data-addonid={addon.id}
  //                                  onChange={this.handleAddon}
  //                                  checked={order.hasAddon(addon.id)}/>
  //                           {` ${addon.title} (${addon.price} ${priceTypeName(addon.price_type)})`}</label>
  //                   </li>
  //               );
  //           })}
  //       </ol>
  //
  //       <div className="form-group client-info">
  //           <label htmlFor ="client-phone">Информация о клиенте : </label>
  //           <div className="input-group">
  //               <span className="input-group-addon" >380</span>
  //               <input type="tel"
  //                  className="form-control"
  //                  id="client-phone"
  //                  aria-describedby="basic-addon3"
  //                  data-input-name="client_phone"
  //                  value={order.ClientInfo("client_phone")}
  //                  onChange={this.handleClientInfo.bind(this)}/>
  //           </div>
  //
  //           <div className="input-group">
  //               <span className="input-group-addon" >Имя : </span>
  //               <input type="text"
  //                  className="form-control"
  //                  id="client-first-name"
  //                  aria-describedby="basic-addon3"
  //                  data-input-name="client_first_name"
  //                  value={order.ClientInfo("client_first_name")}
  //                  onChange={this.handleClientInfo.bind(this)}/>
  //           </div>
  //           <label htmlFor ="sel1">Количество пассажиров :</label>
  //           <select className="form-control" id="sel1" data-input-name="passengers" onChange={this.handleClientInfo.bind(this)}>
  //               <option value="1">1</option>
  //               <option value="2">2</option>
  //               <option value="3">3</option>
  //               <option value="4">4</option>
  //           </select>
  //           <label htmlFor ="comments">Комментарии клиента :</label>
  //           <textarea className="form-control" rows="5" id="comments" data-input-name="comment" onChange={this.handleClientInfo.bind(this)} placeholder="Комментарии ..."/>
  //       </div>
  //       <button className="btn btn-primary"  onClick={this.handleCreateOrder.bind(this)}>Создать</button>
  //   </form>
  //
  // )
