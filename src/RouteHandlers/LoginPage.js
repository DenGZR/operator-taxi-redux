import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import {Grid, Row, Col} from 'react-bootstrap'
import { getAuthToken, checkAuth } from '../AC/auth'
import { Authorisation } from '../utils/authorisation'
import {Loading} from '../components/Loading'



class LoginPage extends Component {

    static propTypes = {
        auth : PropTypes.object.isRequired
    };

    state = {
        login: "",
        password: "",
        // login: "380500000001",
        // password: "Pipilatz123",
        isLoading: false

    };
    componentWillReceiveProps(nextProps) {
      const { auth } = nextProps;
      const isLoading = auth.get('isLoading');
      const isLogin = auth.get('isLogin');

      if( isLogin ) {
        console.log('redirect to orders');
        browserHistory.push('/orders')
      }
      if( this.state.isLoading !== isLoading ) {
        this.setState({ isLoading })
      }
    }

    componentWillMount() {
      this.props.checkAuth()
    }

    render() {
        let { login, password, isLoading } = this.state;

        return (
          <Row>
            <Col xs={4} xsOffset={4}>
              <Loading loading={ isLoading }/>
              <h1 className="text-center">Taxi system</h1>
              <h4 className="text-center">Авторизуйтесь чтобы продолжить</h4>
              <div className="account-wall">
                  <form className="form-signin" onSubmit={this.handleSubmit}>
                      <div className="form-group">
                          <input type="text"
                                 className="form-control"
                                 placeholder="Логин"
                                 value={login}
                                 onChange={this.handleChange('login')}/>
                      </div>
                      <div className="form-group">
                          <input type="password"
                                 className="form-control"
                                 placeholder="Пароль"
                                 value={password}
                                 onChange={this.handleChange('password')}/>
                      </div>
                      <div className="form-group">
                          <button className="btn btn-primary btn-block" type="submit">
                              Войти
                          </button>
                      </div>
                  </form>
              </div>
            </Col>
          </Row>
        );
    }

    handleChange = element => ev => {
      console.log("onChange",element);

      this.setState({
        [element]: ev.target.value
      })
    }

    handleSubmit = ev => {
      ev.preventDefault();
      console.log("submit");
      const { login, password, isLoading } = this.state;
      this.props.getAuthToken(login,password);

      this.setState({ isLoading : true })
    }
}

export default connect((state) => {
    const auth = state.auth
    return { auth }
}, { getAuthToken, checkAuth })(LoginPage)
