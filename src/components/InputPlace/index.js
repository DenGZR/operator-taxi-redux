import React, {Component} from 'react'
import {Point} from '../../structures/Point'

export class InputPlace extends Component {

    state = {
        text: this.props.point.placeName
    }

    componentDidMount() {
      this.setAutocomplete();
      console.log('input props', this.props);
    }


    render() {
      const {point} = this.props;

      let text = this.state.text;

      return (
          <div className="input-group" style={{marginBottom: "15px"}}>
              <input ref={input=>this._input = input}
                 type="text"
                 className="form-control"
                 onChange={this.handleChange}
                 value={text}/>
              <span className="input-group-btn">
                  <a className="btn btn-danger" onClick={this.handleDelete}>&times;</a>
              </span>
          </div>
      )
    }

    setAutocomplete() {
        const options = {
          types: ['address'],
          componentRestrictions: {country: 'ua'}
        };

        const { maps } = this.props
        const input = this._input
        const autocomplete = new window.google.maps.places.Autocomplete(input,options)
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) { //если мы выбрали место из автокомплита, то нам приходит .geometry
                this.savePlace(place)
            } else if (place.name) {
                // если мы ввели текстом, то нам не приходит .geometry. Тогда пытаемся
                // получить .geometry через геокодер
                this.geocodeAddress(place.name, this.savePlace);
            } else {
                console.error(Error("Autocomplete place wrong"))
            }
        });
    }

    geocodeAddress(address, cb) {
        const g = new google.maps.Geocoder();
        g.geocode({
            address: address
        }, function (data) {
            cb(data[0]);
        })
    }

    savePlace = (place) => {
      console.log("Geocoding address")
      if (place && place.geometry) {
          const {geometry} = place
          const point = new Point(geometry.location.lat(), geometry.location.lng(), place.formatted_address);
          this.props.onChange(point);

          this.setState({
              text: place.formatted_address
          });

      } else {
          console.error(Error("Geocoder place wrong"))
      }
    }

    handleChange = (e) => {
      e.preventDefault()
        this.setState({
            text: e.target.value
        });
    }

    handleDelete = (e) => {
        e.preventDefault()
        this.setState({
            text: ''
        });
        this.props.onDelete();
    }
}
