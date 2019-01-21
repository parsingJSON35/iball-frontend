import React, { Component } from 'react'
import ReactMapBoxGL, { Layer, Feature, Popup } from 'react-mapbox-gl'
import { Container } from 'semantic-ui-react'

const Map = ReactMapBoxGL({
  accessToken: process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN,
})


class MapDisplay extends Component {
  constructor(props){
    super(props)

    this.state = {
      loading: true,
      court: null,
      center: [0, 0],
      zoom: [12],
    }
  }


  /////////// COURT MAPPING ////////////

  mapCourts = () => this.props.courts.map(court => {
    return (
      <Feature
        key={court.id}
        properties={court}
        coordinates={[court.lng, court.lat]}
        onClick={(e) => {
          let court = e.feature.properties
          this.setState({
            center: [court.lng, court.lat],
            zoom: [15]
          })
          //this.map.flyTo({center: [court.lng, court.lat]})
          this.props.showCourt(e)
        }}
        onMouseEnter={(e, map) => this.hover(e, map)}
        onMouseLeave={this.exit}
      />
    )
  })

  hover = (e, map) => {
    console.log(map)
    this.setState({
      court: e.feature.properties
    })
  }

  exit = () => {
    this.setState({
      court: null
    })
  }


  /////////// LIFECYCLE /////////////

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        center: [position.coords.longitude, position.coords.latitude],
        loading: false
      })
    })
  }

  render() {
    return (
      !this.state.loading ?
      <Container id='map'>
        <Map
          ref={e => {this.map = e}}
          style='mapbox://styles/mapbox/light-v9'
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          center={this.state.center}
          zoom={this.state.zoom}
        >
          <Layer
            type="circle"

            paint={
              {
                'circle-color': 'red',
                'circle-stroke-width': 1,
                'circle-radius': 7
              }
            }
          >

            { this.mapCourts() }
          </Layer>
          {
            this.state.court ?
              <Popup coordinates={[this.state.court.lng,
                this.state.court.lat]}>
                <h4>{this.state.court.name}</h4>

              </Popup>
              :
              null
          }
        </Map>
      </Container> : null
    )
  }
}

export default MapDisplay

//[-77.032883, 38.898129]
