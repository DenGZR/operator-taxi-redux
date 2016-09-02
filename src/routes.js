import React from 'react'
import { Router, hashHistory, browserHistory, Route, Redirect, IndexRedirect, IndexRoute } from 'react-router'
import store from './store'
import Root from './containers/Root'
//import ActivityMapPage from './RouteHandlers/ActivityMapPage'
//import DriversPage from './RouteHandlers/DriversPage'
import OrdersPage from './RouteHandlers/OrdersPage.js'
import LoginPage from './RouteHandlers/LoginPage.js'
//import OrderCreatePage from './RouteHandlers/OrderCreatePage'
import NotFound from './RouteHandlers/NotFound'

// import { isLoaded as isAuthLoaded, load as loadAuth } from '../utils/Authorisation';

const routes = (store) => {
  const requireLogin = (nextState, replace, cb) => {
    console.log("checkAuth run");
    // function checkAuth() {
    //   const { auth: { user }} = store.getState();
    //   if (!user) {
    //     // oops, not logged in, so can't be here!
    //     replace('/');
    //   }
    //   cb();
    // }
    //
    // if (!isAuthLoaded(store.getState())) {
    //   store.dispatch(loadAuth()).then(checkAuth);
    // } else {
    //   checkAuth();
    // }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return  (
    <Router history = {browserHistory}>
        <Route path='/' component={ Root } >
            <IndexRoute component= { LoginPage }/>
            <Route onEnter={requireLogin}>
                <Route path='orders' component={ OrdersPage }>
                    <Route path = ":orderId" component = {OrdersPage}/>
                </Route>
            </Route>
            <Route path="login" component={LoginPage}/>
        </Route>
        <Route path='*' component={NotFound}/>
    </Router>
  )
};

export default routes(store);
//
// <Router history = {browserHistory}>
//     <Route path='/' component={ App } >
//         <IndexRoute component= { LoginPage }/>
//         <Route onEnter={requireLogin}>
//             <Route path='activity_map' component={ ActivityMapPage }/>
//             <Route path='drivers' component={ DriversPage }>
//                 <Route path=':driverId' component={ DriverDescription }/>
//             </Route>
//             <Route path='orders' component={ OrdersPage }>
//                 <Route path = ":orderId" component = {OrdersPage}/>
//             </Route>
//             <Route path='order_create' component={ OrderCreatePage }/>
//         </Route>
//         <Route path="login" component={LoginPage}/>
//     </Route>
//     <Route path='*' component={NotFound}/>
// </Router>
