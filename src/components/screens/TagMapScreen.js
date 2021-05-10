import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  Image
} from 'react-native';

import { DataStore } from '@aws-amplify/datastore';
import { TagReports } from '../../models';
import { Container, Content, List, ListItem, Left, Body } from 'native-base';
import moment from 'moment';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {
  WebViewLeaflet,
  WebViewLeafletEvents,
  AnimationType
} from 'react-native-webview-leaflet';

import COLORS from '../../constants/constants';
const bonefish = require('../../../assets/bonefish.png');
const permit = require('../../../assets/permit.png');
import { Auth } from 'aws-amplify';

export default class TagMapScreen extends React.Component {
  state = {
    tagReports: [],
    mapMarkers: [],
    currentLocation: {},
    zoomLevel: 9,
    user: {}
  };

  async componentDidMount() {
    const { navigation } = this.props;

    await this.loadUserTags();

    DataStore.observe(TagReports).subscribe(async () => {
      //console.log('SUBSCRIPTION_UPDATE', msg);
      await this.loadUserTags();
    });

    // this.navFocusListener = await navigation.addListener(
    //   'didFocus',
    //   async () => {
    //     console.log('Map screen focus');
    //     this.loadUserTags();
    //   }
    // );
  }

  getCurrentUser = async () => {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user.attributes }))
      .catch(err => console.log(err));
  };

  loadTagReports = async userEmail => {
    try {
      const mapMarkers = [];

      if (!userEmail) {
        alert('no users');
        return;
      }

      const tagReports = await DataStore.query(TagReports, c =>
        c.email('eq', userEmail)
      );

    
      if (tagReports.length) {
        tagReports.forEach((x, i) => {
          const location = x.tagLocation.split(',');
          const latLong = { lat: location[0], lng: location[1] };
          const mapMarker = {
            id: 1,
            position: latLong,
            size: [32, 32],
            icon: '&#128031'
          };
          mapMarkers.push(mapMarker);
        });
        const currentLocation = mapMarkers[0].position;

        this.setState({
          mapMarkers: mapMarkers,
          currentLocation: currentLocation,
          zoomLevel: 10
        });
      } else {
        //alert('no tag report');
        this.setState({
          zoomLevel: 10,
          currentLocation:  {"lat":25.165173368663954,"lng":-90},
          zoomLevel: 4
        });
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  async loadUserTags() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        if (user.attributes.email) {
          this.loadTagReports(user.attributes.email);
        } else {
        }
      })
      .catch(err => console.log(err));
  }

  loadStaticMarkers(mapMarkers) {
    const mapMarker = {
      icon: '&#128031',
      position: this.state.currentLocation,
      size: [32, 32]
    };

    const mapMarker2 = {
      icon: '&#128031',
      position: this.state.currentLocation,
      size: [32, 32]
    };

    const mapMarker22 = {
      icon: '&#128031',
      position: this.state.currentLocation,
      size: [32, 32]
    };

    mapMarkers.push(mapMarker);
    mapMarkers.push(mapMarker2);
    mapMarkers.push(mapMarker22);
    this.setState({
      mapMarkers: mapMarkers,
      currentLocation: this.state.currentLocation,
      zoomLevel: 10
    });
  }

  componentWillUnmount() {
    // this.navFocusListener.remove();
  }

  onMapSelection = message => {
    switch (message.event) {
      case WebViewLeafletEvents.ON_MAP_MARKER_CLICKED:
        // alert(
        //   `Map Marker Touched, ID: ${message.payload.mapMarkerID || "unknown"}`
        // );

        break;
      case WebViewLeafletEvents.ON_MAP_TOUCHED:
        const position = message.payload;

        console.log(
          `Map Touched at:`,
          `${JSON.stringify(position.touchLatLng)}`
        );

        break;
      default:
      //console.log("App received", message);
    }
  };

  renderMap = () => {
    const baseLayerMaps = [
      {
        zIndex: 1,
        subdomains: '0123',
        maxZoom: 22,
        attribution: 'Google maps',
        url:  'http://mt{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
      }
    ];

    return true ? (
      <WebViewLeaflet
        onMessageReceived={this.onMapSelection}
        mapLayers={baseLayerMaps}
        mapCenterPosition={this.state.currentLocation}
        ownPositionMarker={{
          position: this.state.currentLocation,
          size: [32, 32],
          animation: {
            duration: 2500,
            delay: 0
          }
        }}
        zoom={this.state.zoomLevel}
        mapMarkers={this.state.mapMarkers}
      />
    ) : (
      <View
        style={{
          height: 275,
          backgroundColor: '#ccc',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            marginTop: 0
          }}
        >
          Loading Current Location...
        </Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>{this.renderMap()}</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  textStyle: {
    fontSize: 14,
    padding: 2,
    color: '#fff',
    fontWeight: 'bold'
  },
  textStyleSM: {
    fontSize: 18,
    paddingTop: 2,
    color: '#fff',
    
  },
  speciesType: {
    fontSize: 16,
    fontWeight: 'bold',
    
    color: '#fff'
  },
  iconStyle: {
    color: '#fff',
    fontSize: 15,
    marginTop: 5,
    paddingRight: 3
  }
});
