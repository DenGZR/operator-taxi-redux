import React, {PropTypes, Component} from 'react';
import './marker.css'

class Marker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: this.props.showInfo || false
        };
    }

    handleShowInfo(e) {
      let toggleShowInfo = !this.state.showInfo;
      let data = this.props.data;
      this.props.onSelection(data);
      this.setState({
        showInfo: toggleShowInfo
      })
    }

    render() {
      // console.log("orderId, showInfo", this.props.id, this.state.showInfo );
      const styleMarkerMapInfo = this.state.showInfo ? 'marker-map-info-show' : 'hide';
      let id = this.props.data.id;
      let currentStyle;
      switch (this.props.markerType) {
           case "order":
                currentStyle = 'marker-order';
                break
           case "driversFree":
                currentStyle = 'marker-driver-free';
                break
           case "driversBusy":
                currentStyle = 'marker-driver-busy';
                break
          case "point":
               currentStyle = 'marker-point';
               break
      }

      return (
         <div className="marker-map" onClick={this.handleShowInfo.bind(this)}>
            <div className={"marker-map-info " + styleMarkerMapInfo}>
               {'ID : ' + id}
            </div>
            <div className={"marker-map-icon " + currentStyle}></div>
         </div>
      );
    }

}



export default Marker;
