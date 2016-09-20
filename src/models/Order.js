import moment from 'moment'
import {statusName} from '../dicts/statuses'
import {Point} from '../structures/Point'
import {User} from './User'

const OTHER_STATUSES = Symbol('OTHER_STATUSES');

const configs = {
    incomeDateFormat: "HH:mm:ss DD.MM.YYYY",
    outputDateFormat: "DD/MM/YYYY HH:mm",
    // In seconds
    statusDurations: {
        active: 30 * 60,
        accepted: 15 * 60,
        [OTHER_STATUSES]: 15 * 60
    }
};

export class OrderCollection {
    constructor(ordersMap = new Map(), timeStamp = 0) {
        this._timeStamp = timeStamp;
        this._mapOfOrders = ordersMap;
    }

    fromArray() {
      let mapOfOrders = this._mapOfOrders;
      let arrOfOrders = Array.from(mapOfOrders);

      return arrOfOrders;
    }

    fromServer(serverData) {

        let mapOfOrders = this._mapOfOrders;
        for (let orderId in serverData.orders) {
            const orderObj = serverData.orders[orderId];
            const /*Order*/ order = new Order(orderObj);
            mapOfOrders.set(order.id, order);
        }
        //console.log(mapOfOrders);
        this._timeStamp = serverData.time_stamp;
        this._mapOfOrders = mapOfOrders;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    get(id) {
        return this._mapOfOrders.get(id);
    }

    filter(fn) {
        const mapOfOrders = new Map();
        const timeStamp = this._timeStamp;

        this._mapOfOrders.forEach((order, i) => {
            if (fn(order, i)) {
                mapOfOrders.set(order.id, order);
            }
        });

       return new OrderCollection(mapOfOrders,timeStamp);
    }

    /*Array<Order>*/
    toArray() {
        const /*Array<Order>*/ orderArray = [];

        this._mapOfOrders.forEach((order, i) => {
            orderArray.push(order);
        });

        return orderArray;
    }

    sortByDuration() {
      const byStatusDuration = ((/*Order*/a, /*Order*/b)=> {
          let result = 0;
          if (a.statusDurationPct < b.statusDurationPct || a.id > b.id) {
              result = 1;
          } else if (a.statusDurationPct > b.statusDurationPct || a.id < b.id) {
              result = -1;
          }
          return result;
      });
      return this.toArray().sort(byStatusDuration);
    }

    getArrayByIDs(/*Array*/ ids) {
        return ids
            .map(id=>this.get(id))
            .filter(order=>!!order);
    }

    getByOperator(operatorId) {
        return this.filter(order=>order.operatorId == operatorId)
    }

    getByNotOperator(operatorId) {
        return this.filter(order=>order.operatorId != operatorId)
    }

    getFreeOrders() {
        return this.filter(order=>!(order.isHasOperator)&&(order.status == "new"))
    }

    getNewOrders() {
        return this.filter(order=> order.status == "new")
    }

    getСlosedOrders() {
        return this.filter(order=> order.status == "closed")
    }

    getOrderByState(currentState) {
      if(currentState === "all") {
        return this
      }
        return this.filter(order=> order.currentState == currentState)
    }

    getOrderByPhone(phone) {
      if(!phone || phone === "" ) {
        return this
      }
      return this.filter(order=> order.orderPhones.indexOf(phone) != -1)
    }
}

export class Order {
    constructor(order) {
        this._order = order;
    }

    //From data
    get id() {
        return this._order.id;
    }

    get client() {
        return new User(this._order.client);
    }

    get driver() {
        return new User(this._order.driver);
    }

    get driverInfo() {
        return this._order.driver;
    }

    get operatorId() {
        return this._order.operator_id;
    }

    get status() {
        return this._order.status;
    }

    get currentState() {
        return this._order.current_state;
    }

    get clientInfo() {
      return this._order.client;
    }

    get carInfo() {
      return this._order.car;
    }

    get tariffAddons() {
      return this._order.tariff_addons;
    }

    get createdAt() {
        return this._order.created_at;
    }

    get scheduledAt() {
        return this._order.scheduled_at;
    }

    get stateChangedAt() {
        return this._order.state_changed_at;
    }

    get operatorComment() {
        return this._order.operator_comment;
    }

    get driverComment() {
        return this._order.driver_comment;
    }

    get clientComment() {
        return this._order.client_comment;
    }

    get passengerCount() {
        return this._order.passengers;
    }

    get statusChangeTime() {
        return moment(this.stateChangedAt);
    }

    get orderDateTime() {
        return moment(this._order.createdAt);
    }

    get dateTime() {
        return moment(this._order.scheduledAt);
    }

    get waypoints() {
        return [
            this.startPoint,
            this.endPoint
        ];
    }

    get endPoint() {
        return Point.createFromData(this._order.end_point);
    }

    get startPoint() {
        return Point.createFromData(this._order.start_point);
    }

    get calulatedPrice() {
        return this._order.calculated_price;
    }

    get finalPrice() {
        return this._order.final_price;
    }

    get price() {
        return this.calulatedPrice;
    }

    get orderPhones() {
      let clientPhone = this._order.client.phone;
      let driverPhone = this._order.driver.phone;
      //console.log([ clientPhone, driverPhone ]);
      return [ clientPhone, driverPhone ]
    }

    //Evaluated
    get isHasOperator() {
        return this.operatorId != 0;
    }

    get statusDuration() {
        //console.log("moment", moment.duration(moment().diff(this.statusChangeTime)));
        return moment.duration(moment().diff(this.statusChangeTime));
    }

    get statusName() {
        return statusName(this.status);
    }

    get maxStatusDuration() {
        return configs.statusDurations[this.status] || configs.statusDurations[OTHER_STATUSES];
    }

    get statusDurationPct() {
        return 100 * this.statusDuration.asSeconds() / this.maxStatusDuration;
    }

    get statusDurationStr() {
        return `${Math.floor(this.statusDuration.asMinutes())}:${this.statusDuration.seconds()}`;
    }

}

export class OrderForServer extends Order {
   constructor(order) {
     super()
       this.addAddon = this.addAddon.bind(this);
       this.hasAddon = this.hasAddon.bind(this);
       this.toggleAddon = this.toggleAddon.bind(this);
       this.removeAddon = this.removeAddon.bind(this);
       this.middlePoint = this.middlePoint.bind(this);
       this.addMiddlePoint = this.addMiddlePoint.bind(this);
       this._order = order;
   }

   prepare() {
       return {
           client_phone: "380"+this._order.client.phone,
           client_first_name: this._order.client.first_name,
           client_last_name: this._order.client.last_name,
           client_middle_name: this._order.client.middle_name,
           scheduled_at: this._order.scheduled_at,
           start_point: this.startPoint.prepare(),
           end_point: this.endPoint.prepare(),
           way_points: this._order.way_points.map(point=>point.prepare()),
           tariff_addons: this.tariffAddons,
           comment: this._order.comment,
           passengers: this._order.passengers,
           scheduled: false,
           on_city: false
       }
   }

   get startPoint() {
        this._order.start_point.id = "start";
      return this._order.start_point;
   }

   get tariffAddons() {
       return this._order.tariff_addons;
   }

   get endPoint() {
       this._order.end_point.id = "end";
       return this._order.end_point;
   }

   get middlePointsList() {
       return this._order.middle_point_list;
   }

   middlePoint(id) {
     this._order.middle_point.id = id;
     return this._order.middle_point;
   }

   addMiddlePoint() {
     debugger
     const id = this._order.middle_point_list.length;
     const point = this.middlePoint(id);
     this._order.middle_point_list.push(point);
   }

   get waypoints() {
       return [this.startPoint, ...this.middlePointsList, this.endPoint].filter(point=>!point.isEmpty());
   }

   addWayPoint(point) {

       if (this.startPoint.isEmpty()) {
           this._order.start_point = point
       } else if (this.endPoint.isEmpty()) {
           this._order.end_point = point
       } else {
           this._order.way_points.push(point);
       }
   }

   removeWayPoint(index) {
       if (index == "start") {
           this._order.start_point = new Point(0, 0);
       } else if (index == "end") {
           this._order.end_point = new Point(0, 0);
       } else {
           this._order.way_points.splice(index, 1);
       }
   }

   setWayPoint(pointId, point) {
       if (pointId == "start") {
           this._order.start_point = point
       } else if (pointId == "end") {
           this._order.end_point = point
       } else {
           this._order.way_points[pointId] = point
       }
   }

   hasAddon(addonId) {
       return !!(this._order.tariff_addons.find((addon) => addon == addonId));
   }

   toggleAddon(addonId) {
       if (this.hasAddon(addonId)) {
           this.removeAddon(addonId);
       } else {
           this.addAddon(addonId);
       }
   }

   addAddon(addonId) {
       if (!this.hasAddon(addonId)) {
           this._order.tariff_addons.push(parseInt(addonId));
       }
   }

   removeAddon(addonId) {
       this._order.tariff_addons = this._order.tariff_addons.filter(addon => addon != addonId);
   }

   clientInfo(key, val) {
     if(!val) {
       return  this._order[key];
     }
     return this._order[key] = val;
   }
}
