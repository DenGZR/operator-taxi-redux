const data = {
    id: 1,
    startPoint: 0,
    endPoint: 5
};

order = new Order(data);

order = {
    _prop: data,

    get id(){
        return this._prop.id;
    },

    get waypoints() {
        return [
            this.startPoint,
            this.endPoint
        ];
    }
};

order = {
    id: 1,
    startPoint: 0,
    endPoint: 5,
    waypoints: [0, 5]
};


let orderCollection = {
    fromServer(data){
        this.ordersMap = data.orders.map(order => new Order(order));
    },
    ordersMap: []
};

//let StoreOrder = {
//    orderCollection: {
//      fromServer(){},
//      ordersMap: [
//          {
//              id: 1,
//              id(){
//                  return this._prop.id;
//              }
//          },
//          {
//              id: 2,
//              id(){
//                  return this._prop.id;
//              }
//          }
//      ]
//    }
//};

let StoreOrder = [{id: 1}, {id: 2}];

Order = {
    waypoints(startPoint, endPoint) {
        return [
            startPoint,
            endPoint
        ];
    }
};

Order.waypoints();

const actionSuccess = (res) => {
    orderCollection.fromServer(res.data);

    StoreOrder = {
        orderCollection
    };
};

const actionSuccess = (res) => {
    //  orderCollection.fromServer(res.data);

    return res.data;
};



fetch('/url').then((err, res) => {
    if(err) {
        // ACTION + ERROR
    } else {
        // ACTION_SUCCESS
        actionSuccess(res);
    }
});

// Component

const Component = (orders) => {
    return (
        <div>
            {   orders.map(order => <h1>{order.id}</h1>)    }
        </div>
    );
};

Component(StoreOrder);