/* 
Author: Sebastian Mancipe
Date: 
Last update: August 25 - 2019
Description: 
This component contains the normal map, markers and polylines loaded on it from civilizations or tags. 
Executes methods to get distance, join markers manually, by stack (arrive order) or to a specific point
Last update comment: Added information section
*/

import React, { Component } from "react";
//import config from "../../../others/config.js";
import LeftButtonsMap from "../operations/LeftButtonsMap";
import BottomButtonsMapFree from "../operations/BottomButtonsMapFree";
import { Map, GoogleApiWrapper, Marker, Polyline } from "google-maps-react";
import mapStyles from "../../../styles/mapStyles"; //Uncomment to mapStyles

// Imports to apollo-client and connection to graphql
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import "../../../styles/map_full.css";

const httpLink = createHttpLink({
  uri: "config.HOST",
});

// 3
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const R = 6371e3; // Earth’s radius in meter

//TODO: Check a way to conserve the polyline when getting angles
class MapFull extends Component {
  constructor(props) {
    super(props);
    //Load basic markers for testing purpose
    this.state = {
      //markers: [{ id: '', lat: '', lng: '', text_mark: '' }],
      /*markers: [{ id:'1',lat: '5.6494393', lng: '-73.5163933', text_mark: "Desierto El Infiernito" },
                { id:'2',lat: '4.977777', lng: '-73.775097', text_mark: "Laguna de Guatavita" },
                { id:'3',lat: '5.709184', lng: '-72.923647', text_mark: "Templo del Sol" },
                { id:'4',lat: '4.598083', lng: '-74.076043', text_mark: "Plaza Simón Bolivar" }],*/
      markers: [
        { id: 1, lat: 25.774, lng: -80.19, text_mark: "Place 1", tag: "Tag 1" },
        {
          id: 2,
          lat: 18.466,
          lng: -66.118,
          text_mark: "Place 2",
          tag: "Tag 1",
        },
        {
          id: 3,
          lat: 32.321,
          lng: -64.757,
          text_mark: "Place 3",
          tag: "Tag 1",
        },
      ] /* Bermuda's markers*/,
      markers2PolyStack: [{ id: "", name: "", lat: "", lng: "", dist: "" }],
      markers2PolyManually: [{ id: "", name: "", lat: "", lng: "", dist: "" }],
      markers2PolyMany2One: [{ id: "", name: "", lat: "", lng: "", dist: "" }],
      center: {
        lat: 15.5,
        lng: 45.5,
      },
      zoom: 4,
      //Control variables to show or no the polylines
      drawPolylinesStack: false,
      drawPolylinesManually: false,
      drawPolylinesMany2One: false,
      getAngle: false,
      markers2Angle: [{ id: "", name: "", lat: "", lng: "" }],
      angle: "",
      id_figure: "",
      markerFromProjection: {},
      isProjectable: false,
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  setAngles(isReset) {
    if (isReset) {
      this.setState({ getAngle: false });
      this.setState({ angle: "" });
      let markers2Angle = [{ id: "", name: "", lat: "", lng: "" }];
      this.setState({ markers2Angle });
    } else {
      var getAngle = this.state.getAngle ? false : true; //Issue, the state doesnt update in fact
      this.setState({ getAngle });
    }
    if (getAngle) {
      this.setState({ drawPolylinesStack: false });
      this.setState({ drawPolylinesMany2One: false });
      this.setState({ drawPolylinesManually: false });
    }
  }

  generatePolylineStack() {
    this.setState({
      drawPolylinesStack: this.state.drawPolylinesStack ? false : true,
    });
    //Set the other options in false
    if (this.state.drawPolylinesStack) {
      this.setState({ drawPolylinesManually: false });
      this.setState({ drawPolylinesMany2One: false });
    }
  }

  //Method that reset, show or no the polyline of manually input
  generatePolylineManually(isReset) {
    if (isReset) {
      this.setState({ drawPolylinesManually: false });
      let markers2PolyManually = [
        { id: "", name: "", lat: "", lng: "", dist: "" },
      ];
      this.setState({ markers2PolyManually });
    } else
      this.setState({
        drawPolylinesManually: this.state.drawPolylinesManually ? false : true,
      });

    //Set the other options in false
    if (this.state.drawPolylinesManually) {
      this.setState({ drawPolylinesStack: false });
      this.setState({ drawPolylinesMany2One: false });
      this.setState({ getAngle: false });
    }
  }

  //Method that reset, show or no the polyline of many to one input
  generatePolylineMany2One(isReset) {
    if (isReset) {
      this.setState({ drawPolylinesMany2One: false });
      let markers2PolyMany2One = [
        { id: "", name: "", lat: "", lng: "", dist: "" },
      ];
      this.setState({ markers2PolyMany2One });
    } else
      this.setState({
        drawPolylinesMany2One: this.state.drawPolylinesMany2One ? false : true,
      });
    //Set the other options in false
    if (this.state.drawPolylinesMany2One) {
      this.setState({ drawPolylinesStack: false });
      this.setState({ drawPolylinesManually: false });
      this.setState({ getAngle: false });
    }
  }

  isProjectable(isReset) {
    if (isReset) {
      this.setState({ markerFromProjection: {} });
      this.setState({ isProjectable: false });
      console.log("Is reset projectable");
      //Delete or not the projected marker?
    } else this.setState({ isProjectable: true });
  }

  //Method called from BottomButtonsMap that resets all states
  //Here its reseted the id_figure to avoid resend with the same id
  resetAll() {
    let markers = [{ id: "", text_mark: "", lat: "", lng: "", dist: "" }];
    this.setState({ markers });
    let markers2PolyMany2One = [
      { id: "", name: "", lat: "", lng: "", dist: "" },
    ];
    this.setState({ markers2PolyMany2One });
    let markers2PolyManually = [
      { id: "", name: "", lat: "", lng: "", dist: "" },
    ];
    let markers2Angle = [{ id: "", name: "", lat: "", lng: "" }];
    this.setState({ markers2Angle });
    this.setState({ markers2PolyManually });
    this.setState({ drawPolylinesManually: false });
    this.setState({ drawPolylinesMany2One: false });
    this.setState({ drawPolylinesStack: false });
    this.setState({ getAngle: false });
    this.setState({ isProjectable: false });
    this.setState({ markerFromProjection: {} });
    this.setState({ angle: "" });
    this.setState({ id_figure: "" });
  }

  //Method that join two markers with a polyline
  markersJoinManually(markerSelected) {
    var p2 = {
      id: markerSelected.id,
      lat: markerSelected.lat,
      lng: markerSelected.lng,
      name: markerSelected.text_mark,
    };
    let markers2PolyManually;
    if (this.state.markers2PolyManually[0].lat !== "") {
      let distance;
      markers2PolyManually = [...this.state.markers2PolyManually];
      //Get distance based in latitude and longitude of the markers
      distance = this.getDistance(
        markers2PolyManually[markers2PolyManually.length - 1],
        p2
      );
      markers2PolyManually.push({
        id: Number(p2.id),
        name: p2.name,
        lat: Number(p2.lat),
        lng: Number(p2.lng),
        dist: Number(distance),
      });
    } else
      markers2PolyManually = [
        {
          id: Number(p2.id),
          name: p2.name,
          lat: Number(p2.lat),
          lng: Number(p2.lng),
        },
      ];
    this.setState({ markers2PolyManually });
  }

  //Method that join all markers to one (the selected by the user)
  markersJoinMany2One(markerSelected) {
    let markers2PolyMany2One = [],
      markers = this.state.markers;
    markers.forEach((marker) => {
      if (marker.id !== markerSelected.id) {
        let distance;
        distance = this.getDistance(marker, markerSelected);
        markers2PolyMany2One.push({
          id: Number(marker.id),
          name: marker.text_mark,
          lat: Number(marker.lat),
          lng: Number(marker.lng),
        });
        markers2PolyMany2One.push({
          id: Number(markerSelected.id),
          name: markerSelected.text_mark,
          lat: Number(markerSelected.lat),
          lng: Number(markerSelected.lng),
          dist: Number(distance),
        });
      }
    });
    this.setState({ markers2PolyMany2One });
    console.log(this.state.markers2PolyMany2One);
  }

  onMarkerClick(props, marker, e) {
    const markersTemp = this.state.markers;
    //*Search for the place selected in the markers array
    const placeSelected = markersTemp.find(
      (place) =>
        place.text_mark === props.label &&
        place.lat === props.position.lat &&
        place.lng === props.position.lng
    );
    if (this.state.drawPolylinesManually) {
      this.markersJoinManually(placeSelected);
    } else if (this.state.drawPolylinesMany2One)
      this.markersJoinMany2One(placeSelected);
    else if (this.state.getAngle) this.getAngleBetweenMarkers(placeSelected);
    else if (this.state.isProjectable) {
      this.setState({ markerFromProjection: placeSelected });
    }
  }

  //Adds an array of markers in the map and update both, marker and markers2PolyStack.
  //Also moves the view to the marker created in the map
  addMarkers(places) {
    let markers;
    if (this.state.markers[0].id === "") markers = [];
    else markers = [...this.state.markers];
    places.forEach((place, index, array) => {
      var p2 = {
        id: place.Id,
        lat: place.Latitude,
        lng: place.Longitude,
        text: place.Name,
        tag: place.Tag,
      };
      if (markers.filter((marker) => marker.id === p2.id).length === 0)
        //Avoid duplicates
        markers.push({
          id: p2.id,
          lat: p2.lat,
          lng: p2.lng,
          text_mark: p2.text,
          tag: p2.tag,
        });
    });
    this.setState({ markers });
  }

  addMarker(id, latitude, longitude, text, tag) {
    var p2 = {
      id: id,
      lat: latitude,
      lng: longitude,
      text: text,
      tag: tag,
    };
    let markers = [...this.state.markers];
    markers.push({
      id: p2.id,
      lat: p2.lat,
      lng: p2.lng,
      text_mark: p2.text,
      tag: p2.tag,
    });
    this.setState({ markers });
    this.setState({
      center: {
        lat: Number(latitude),
        lng: Number(longitude),
      },
    });
    let zoom = 10;
    this.setState({ zoom });
  }

  //Utilities: Convert from grad to rad
  toRad(x) {
    return (x * Math.PI) / 180;
  }

  //Utilities: Return the distance between points p1 and p2 in meters, based geodesic
  getDistance(p1, p2) {
    var dLat = this.toRad(p2.lat - p1.lat);
    var dLong = this.toRad(p2.lng - p1.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(p1.lat)) *
        Math.cos(this.toRad(p2.lat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

  //Fulls the array with markers to get the angle between them
  getAngleBetweenMarkers(placeSelected) {
    var markers2Angle;
    if (this.state.markers2Angle[0].lat === "") {
      markers2Angle = [
        {
          id: placeSelected.id,
          name: placeSelected.text_mark,
          lat: placeSelected.lat,
          lng: placeSelected.lng,
        },
      ];
      this.setState({ markers2Angle });
    } else if (this.state.markers2Angle.length <= 2) {
      markers2Angle = [...this.state.markers2Angle];
      markers2Angle.push({
        id: placeSelected.id,
        name: placeSelected.text_mark,
        lat: placeSelected.lat,
        lng: placeSelected.lng,
      });
      this.setState({ markers2Angle });
      if (markers2Angle.length === 3) this.getAngle();
    }
  }

  //Angles and proyection = https://www.movable-type.co.uk/scripts/latlong.html,
  //https://math.stackexchange.com/questions/330843/angle-between-two-coordinateslatitude-longitude-from-a-position-on-earth?answertab=active#tab-top
  getAngle() {
    var markers2Angle = [...this.state.markers2Angle];

    var lato = markers2Angle[0].lat,
      lngo = markers2Angle[0].lng;
    var lat1 = markers2Angle[1].lat,
      lng1 = markers2Angle[1].lng;
    var lat2 = markers2Angle[2].lat,
      lng2 = markers2Angle[2].lng;

    var x1 = R * Math.cos(lat1) * Math.cos(lng1);
    var y1 = R * Math.cos(lat1) * Math.sin(lng1);
    var z1 = R * Math.sin(lat1);

    var x2 = R * Math.cos(lat2) * Math.cos(lng2);
    var y2 = R * Math.cos(lat2) * Math.sin(lng2);
    var z2 = R * Math.sin(lat2);

    var xo = R * Math.cos(lato) * Math.cos(lngo);
    var yo = R * Math.cos(lato) * Math.sin(lngo);
    var zo = R * Math.sin(lato);

    var vector1 = {
      x: x1 - xo,
      y: y1 - yo,
      z: z1 - zo,
    };
    console.log("Vector 1", vector1);
    var vector2 = {
      x: x2 - xo,
      y: y2 - yo,
      z: z2 - zo,
    };
    console.log("Vector 2", vector2);

    var dot_product =
      vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    console.log("Dot product", dot_product);
    //var magnitudes_product = this.getDistance(markers2Angle[1],markers2Angle[0])*this.getDistance(markers2Angle[2],markers2Angle[0])
    var magnitude_1 = Math.sqrt(
      Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2) + Math.pow(vector1.z, 2)
    );
    var magnitude_2 = Math.sqrt(
      Math.pow(vector2.x, 2) + Math.pow(vector1.y, 2) + Math.pow(vector1.z, 2)
    );
    console.log("Magnitude 1", magnitude_1, "Magnitude 2", magnitude_2);
    var magnitudes_product_2 = magnitude_1 * magnitude_2;
    //console.log("Magnitudes product with geodesic ",magnitudes_product,"Magnitudes product whitout geodesic",magnitudes_product_2)
    var angle_1 = Math.acos(dot_product / magnitudes_product_2);
    //var angle_2 = Math.acos(dot_product/magnitudes_product);
    console.log("Angle without geodesic", angle_1 * (180 / Math.PI), angle_1);
    //console.log("Angle with geodesic",angle_2*(180/Math.PI),angle_2)
    this.setState({ angle: angle_1 * (180 / Math.PI) });
    //this.setAngles(true) //Reset
  }

  render() {
    let edgesFigure; //Polyline to be sended to LeftButtonMap in order to create the figure. Check what type of join is selected
    if (
      this.state.drawPolylinesMany2One &&
      this.state.markers2PolyMany2One[0].lat !== ""
    ) {
      edgesFigure = this.state.markers2PolyMany2One;
      edgesFigure.typeJoin = "Many2One";
    } else if (
      this.state.drawPolylinesManually &&
      this.state.markers2PolyManually[0].lat !== ""
    ) {
      edgesFigure = this.state.markers2PolyManually;
      edgesFigure.typeJoin = "Manually";
    } else {
      edgesFigure = this.state.markers2PolyStack;
      edgesFigure.typeJoin = "Stack";
    }

    const triangleCoords = [
      { lat: 25.774, lng: -80.19 },
      { lat: 18.466, lng: -66.118 },
      { lat: 32.321, lng: -64.757 },
      { lat: 25.774, lng: -80.19 },
    ];

    const LeftButtonsMapProps = {
      addMarker: this.addMarkers.bind(this),
      edgesFigure: edgesFigure,
      id_figure: this.state.id_figure,
    };
    const BottomButtonsMapProps = {
      generatePolylineStack: this.generatePolylineStack.bind(this),
      generatePolylineManually: this.generatePolylineManually.bind(this),
      generatePolylineMany2One: this.generatePolylineMany2One.bind(this),
      setAngles: this.setAngles.bind(this),
      getAngle: this.state.getAngle,
      resetPolylines: this.resetAll.bind(this),
      addMarker: this.addMarker.bind(this),
      markerSelected: this.state.markerFromProjection,
      isProjectable: this.isProjectable.bind(this),
      anglesInformation: this.state.markers2Angle,
      angle: this.state.angle,
    };

    return (
      <ApolloProvider client={client}>
        <Map
          id="map_full"
          google={this.props.google}
          center={this.state.center}
          zoom={this.state.zoom}
          initialCenter={{
            lat: 4.624335,
            lng: -74.063644,
          }}
          mapTypeControl={false}
          styles={mapStyles}
        >
          <LeftButtonsMap LeftButtonsMapProps={LeftButtonsMapProps} />
          <BottomButtonsMapFree BottomButtonsMapProps={BottomButtonsMapProps} />
          {this.state.markers.map((marker, i) => {
            if (marker.lat !== "")
              return (
                <Marker
                  position={{ lat: marker.lat, lng: marker.lng }}
                  label={marker.text_mark}
                  title={marker.text_mark}
                  key={i}
                  onClick={this.onMarkerClick}
                />
              );
            else return null;
          })}
          {/*Check what figure can be rendered in the map based in length and selection by the user*/}
          {this.state.drawPolylinesStack &&
            this.state.markers2PolyStack[0].lat !== "" && (
              <Polyline path={triangleCoords} strokeColor="#0000FF" />
            )}
          {this.state.drawPolylinesManually &&
            this.state.markers2PolyManually[0].lat !== "" && (
              <Polyline
                path={this.state.markers2PolyManually}
                strokeColor="#00FF00"
              />
            )}
          {this.state.drawPolylinesMany2One &&
            this.state.markers2PolyMany2One[0].lat !== "" && (
              <Polyline
                path={this.state.markers2PolyMany2One}
                strokeColor="#FF0000"
              />
            )}
        </Map>
      </ApolloProvider>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.API_KEY,
})(MapFull);
// https://istarkov.github.io/google-map-thousands-markers/
