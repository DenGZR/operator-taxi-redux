import React from 'react'
import { Router, hashHistory, browserHistory, Route, Redirect, IndexRedirect, IndexRoute } from 'react-router'
import store from './store'
import { CHECK_AUTH } from './constants'
import { Provider } from 'react-redux'
import Root from './containers/Root'
import ActivityMapPage from './RouteHandlers/ActivityMapPage'
import DriversPage from './RouteHandlers/DriversPage'
import OrdersPage from './RouteHandlers/OrdersPage.js'
import LoginPage from './RouteHandlers/LoginPage.js'
import OrderCreatePage from './RouteHandlers/OrderCreatePage'
import NotFound from './RouteHandlers/NotFound'
import { Authorisation } from './utils/authorisation';

const routes = (store) => {
  const requireLogin = (nextState, replace) => {

    console.log("checkAuth run");
    const { auth } = store.getState();
    const isLogin = auth.get('isLogin');
// debugger
    if ( isLogin ) {
      console.log("you isLogin")
    } else {
      if(Authorisation.getToken()) {
        store.dispatch({type: CHECK_AUTH})
      } else {
        console.log("Redirect to LoginPage")
        replace('/login')
      }
    }
  }
  /**
   * Please keep routes in alphabetical order
   */
  return  (
    <Provider store = {store}>
      <Router history = {browserHistory}>
          <Route path='/' component={ Root } >
              <IndexRoute component= { LoginPage }/>
              <Route onEnter={requireLogin}>
                  <Route path='activity_map' component={ ActivityMapPage }/>
                  <Route path='drivers' component={ DriversPage }>
                      <Route path=':driverId' component={ DriversPage }/>
                   </Route>
                  <Route path='orders' component={ OrdersPage }>
                      <Route path = ":orderId" component = {OrdersPage}/>
                  </Route>
                  <Route path='order_create' component={ OrderCreatePage }/>
              </Route>
              <Route path="login" component={LoginPage}/>
          </Route>
          <Route path='*' component={NotFound}/>
      </Router>
    </Provider>
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
