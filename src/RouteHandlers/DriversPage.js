import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getDrivers } from '../AC/driver'
import {Grid, Row, Col} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import {Link} from 'react-router'
import {Table, Field} from "../components/Table"
import {User} from "../components/User"
import {BtnToAddCache, PopupAddCacheToDriver} from "../components/PopupAddCacheToDriver"
import {Waypoints} from "../components/Waypoints"

class DriversPage extends Component {
  state = {
    paginate : {
      offset: 0,
      limit: 10
    }
  }

  componentDidMount() {
    this.props.getDrivers();
  }

  render() {
    console.log("drivers");
    let { paginate } = this.state;
    const drivers = this.props.drivers.get('driverCollection');
    let driverPull = drivers.toArray();

    let pageNum = Math.ceil(driverPull.length/paginate.limit);
    driverPull = driverPull.slice(paginate.offset,paginate.limit+paginate.offset);
    console.log("driverPull", driverPull);
    return (
        <Row className="driver-list">
          <Col xs={12} >
            <Table
              data={driverPull}
              fields={this.mainTableFields}/>
          </Col>
          <Col xs={6} xsOffset={5} >
            <ReactPaginate previousLabel={"<"}
              nextLabel={">"}
              breakLabel={<a href="">...</a>}
              breakClassName={"break-me"}
              pageNum={pageNum}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              clickCallback={this.handlePageClick('paginate')}
              containerClassName={"pagination "}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"} />
          </Col>
        </Row>
      );
  }

  mainTableFields = [
      new Field("ID", (/*Driver*/ driver) => <span>{driver.id}</span>, 10),
      new Field("Водитель", (/*Driver*/ driver) => <User>{driver}</User>, 20),
      new Field("$", (/*Driver*/ driver) => <span>{driver.amount}</span>, 10),
      new Field("Статус", (/*Driver*/ driver) => <span>{driver.statusName}</span>, 20),
      new Field("Состояние", (/*Driver*/ driver) => <span  className={driver.state}>{driver.state}</span>, 10),
      new Field("Подробнее", (/*Driver*/ driver) => <Link to={`/drivers/${driver.id}`}>Подробнее</Link>, 10),
      new Field("Пополнить", (/*Driver*/ driver) => <BtnToAddCache currentDriver={driver} togglePopup={this.togglePopup}/>, 20)
  ];

  handlePageClick = element => data => {
    let selected = data.selected;
    let { paginate } = this.state;
    let offset = Math.ceil(selected * paginate.limit);
    paginate.offset = offset;
    this.setState({paginate});
  }

    // handleAlertPopup() {
    //   let {showPortal} = this.state;
    //   showPortal = !showPortal;
    //   this.setState({showPortal});
    // }
    //
};

export default connect((state) => {
    const drivers = state.drivers
    return { drivers }
}, { getDrivers })(DriversPage)
