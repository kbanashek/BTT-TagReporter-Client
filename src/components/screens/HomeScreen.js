import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  Keyboard
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Item, Input, Toast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import RNPickerSelect from 'react-native-picker-select';
import { Auth } from 'aws-amplify';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import * as Font from 'expo-font';
import RadioForm from 'react-native-simple-radio-button';
import * as _ from 'lodash';
import OfflineNotice from '../../components/screens/OfflineNotice';
import species from '../data/species';
import catchType from '../data/catchType';
import locations from '../data/locations';
import COLORS from '../../constants/constants';

import { DataStore } from '@aws-amplify/datastore';
import { TagReports } from '../../models';
import {
  WebViewLeaflet,
  WebViewLeafletEvents,
  AnimationType
} from 'react-native-webview-leaflet';

// const icon = WebViewLeaflet.icon({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// })

const appIcon = require('../../../assets/icon.png');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isConnected: true,
    user: null,
    location: null,
    errorMessage: null,
    tagArea: null,
    currentPosition: null,
    tagNumber: '',
    fishType: null,
    fishTypeX: -1,
    tagDate: '',
    tagLocation: '',
    message: 'Loading location...',
    comment: '',
    guideName: '',
    fishLength: '',
    tagLocationCode: '',
    email: '',
    phone: '',
    isDisabled: true,
    recapture: 'false',
    showToast: false,
    positionMarker: {},
    mapMarkers: [],
    mapZoom: 16,
    showMap: true
  };

  static navigationOptions = () => ({
    animationEnabled: true
  });

  async componentDidMount() {
    const { navigation } = this.props;

    // this.navFocusListener = await navigation.addListener(
    //   'didFocus',
    //   async () => {
    //     // do some API calls here
    //     console.log('focused$$$$$');
    //     await this.getCurrentLocation();
    //   }
    // );

    // await Font.loadAsync({
    //   Roboto: require('native-base/Fonts/Roboto.ttf'),
    //   Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //   'PermanentMarker-Regular': require('../../../assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    // });
  }

  componentDidMount = async () => {
    await this.getCurrentUser();

    await this.getCurrentLocation();

    const headerHeight = 78;
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('keyboard shown');
        this.setState({
          // containerHeight: height - endCoordinates.height - headerHeight,
          showMap: false
        });
      }
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('keyboard hidden');
        this.setState({
          // containerHeight: height - headerHeight,
          showMap: true
        });
      }
    );
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handleConnectivityChange = state => {
    this.setState({ isConnected: state.isConnected });

    if (state.isConnected) {
      console.log('Online');
    } else {
      console.log('Offline');
      Toast.show({
        text: 'Your device currently does not have connectivity',
        buttonText: 'Okay',
        duration: 13000,
        position: 'bottom',
        type: 'success'
      });
    }
  };

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      // enableHighAccuracy: true
      timeout: 5000
    })
      .then(location => {
        this.setState({ currentPosition: location.coords });
        console.log('location.coords.latitude', location.coords.latitude);
        const latLong = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        };

        console.log('>> LOCATION', latLong);

        this.setState({
          location: latLong,
          message:
            'Please select the tag location on the map and enter the required tag report data'
        });

        // if (location.coords) {
        //   Location.reverseGeocodeAsync({
        //     longitude: location.coords.longitude,
        //     latitude: location.coords.latitude
        //   }).then(area => {
        //     if (area.length) {
        //       const { city, region, country, name } = area[0];
        //       const locatedArea = city + ', ' + region + ', ' + country;
        //       console.log('location NAME:', name);
        //       this.setState({ tagArea: locatedArea });
        //     }
        //   });
        // }
      })
      .catch(e => {
        console.log('Unable to locate device', e);

        const latLong = {
          lat: 37.0902,
          lng: -95.7129
        };

        this.setState({
          location: latLong,
          message:
            'Please select the tag location on the map and enter the required tag report data',
          mapZoom: 3
        });
      });
  };

  createTagReport = async () => {
    const {
      comment,
      tagNumber,
      fishType,
      fishLength,
      location,
      tagArea,
      user,
      tagLocationCode,
      recapture,
      mapMarkers
    } = this.state;

    const { phone_number, email } = user;

    // if (!tagLocationLatLong) {
    //   alert('Please select a tag location on the map');
    //   return;
    // }

    const tagLocationLatLong = `${mapMarkers[0].position.lat},${mapMarkers[0].position.lng}`;

    const tagReport = await this.formatTagReport(
      tagArea,
      email,
      fishType,
      comment,
      tagLocationCode,
      tagNumber,
      tagLocationLatLong,
      fishLength,
      user,
      phone_number,
      recapture
    );

    try {
      Toast.show({
        text: 'Tag successfully submitted!',
        buttonText: 'Okay',
        duration: 5000,
        position: 'bottom',
        type: 'success'
      });

      const submitSuccess = await DataStore.save(
        new TagReports({ ...tagReport })
      );

      await this.clearTagReportState();

      await this.getLocation();
    } catch (err) {
      console.log('Warning!!! - error creating tarReport...', err);
      this.setState({
        errorMessage: 'Unable to submit tag report'
      });
      alert(err.message);

      Toast.show({
        text: 'Unable to submit tag report',
        buttonText: 'Okay',
        duration: 5000,
        position: 'bottom'
      });
    }
  };

  onChange = (key, value) => {
    this.setState({ [key]: value });
    this.enableSubmission(value);
  };

  formatTagReport = async (
    tagArea,
    email,
    fishType,
    comment,
    tagLocationCode,
    tagNumber,
    location,
    fishLength,
    user,
    phone_number,
    recapture
  ) => {
    const country = _.find(locations, { value: tagLocationCode }).label;

    console.log('country code:', country);
    return {
      tagArea: tagArea ? tagArea : country,
      email,
      fishType,
      comment,
      recapture,
      tagNumber: tagLocationCode + '-' + tagNumber,
      tagDate: moment().format(),
      tagLocation: location ? location : country,
      fishLength: fishLength + ' ' + user['custom:preferredMeasure'],
      guideName: user['custom:firstName'] + ' ' + user['custom:lastName'],
      phone: phone_number
    };
  };

  isEmpty = str => {
    return !str || 0 === str.length;
  };

  enableSubmission = value => {
    const {
      tagNumber,
      fishType,
      fishLength,
      tagLocationCode,
      user,
      mapMarkers
    } = this.state;

    const isButtonDisabled =
      this.isEmpty(tagNumber) ||
      this.isEmpty(fishType) ||
      this.isEmpty(fishLength) ||
      this.isEmpty(tagLocationCode) ||
      this.isEmpty(user);

    this.setState({ isDisabled: isButtonDisabled });

    if (value.length === 0 && !isButtonDisabled) {
      this.setState({ isDisabled: true });
    }
  };

  getCurrentUser = async () => {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user.attributes }))
      .catch(err => console.log('could not authenticate user >>>>', err));
  };

  getCurrentLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
      console.log('NOT calling getLocation$$$$$');
      this.setState({ tagArea: 'Key Largo, FL' });
    } else {
      console.log('calling getLocation$$$$$');
      await this.getLocation();
    }
  };

  clearTagReportState = async () => {
    this.setState({
      fishLength: '',
      tagNumber: '',
      tagArea: null,
      comment: '',
      tagDate: null,
      recapture: null,
      isDisabled: true
    });
  };

  renderLocationTag = () => {
    const locationSelectPlaceHolder = {
      label: 'Select tag region...',
      value: null,
      color: '#fff',
      fontWeight: 'bold'
    };

    return (
      <RNPickerSelect
        placeholder={locationSelectPlaceHolder}
        onValueChange={value => this.setState({ tagLocationCode: value })}
        items={locations}
        style={pickerStyles}
      />
    );
  };

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
        const mapMarker = {
          id: '1',
          position: position.touchLatLng,
          icon: '&#128031',
          title: 'Selected Tag Location',
          size: [32, 32]
        };
        const mapMarkers = [];
        mapMarkers.push(mapMarker);
        this.setState({ mapMarkers: mapMarkers });
        this.enableSubmission(mapMarkers);
        break;
      default:
      //console.log("App received", message);
    }
  };

  renderLocation = () => {
    return this.state.tagArea ? (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Ionicons name="ios-pin" style={styles.iconStyle} />
        <Text style={styles.locationText}>{this.state.tagArea}</Text>
      </View>
    ) : null;
  };

  renderMap = () => {
    const baseLayerMaps = [
      {
        zIndex: 1,
        subdomains: '0123',
        maxZoom: 22,
        attribution: 'Google maps',
        url: 'http://mt{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga'
      }
    ];

    return this.state.location ? (
      <View style={{ height: 275, backgroundColor: '#ccc', zIndex: 100 }}>
        <WebViewLeaflet
          onMessageReceived={this.onMapSelection}
          mapLayers={baseLayerMaps}
          mapCenterPosition={this.state.location}
          ownPositionMarker={{
            position: this.state.location,
            size: [32, 32],
            animation: {
              duration: 220,
              delay: 0
            }
          }}
          zoom={this.state.mapZoom}
          mapMarkers={this.state.mapMarkers}
        />
      </View>
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

  SCREEN_HEIGHT = Dimensions.get('screen').height;

  render() {
    let message = '';

    let fishLengthPlaceHolder = this.getFishLengthPlaceHolderText();

    if (this.state.errorMessage) {
    } else if (this.state.location) {
      message = this.state.message;
    }

    return (
      <View style={{ flex: 1 }}>
        {this.state.showMap ? <View>{this.renderMap()}</View> : null}
        <KeyboardAwareScrollView enableOnAndroid={true} keyboardOpeningTime={0}>
          <View style={styles.container}>
            {this.getConnectionInfo()}
            {this.renderLocation()}
            <Text style={styles.paragraph}>{message}</Text>
            <RadioForm
              ref="radioForm"
              radio_props={species}
              initial={this.state.fishType}
              formHorizontal={true}
              labelHorizontal={true}
              buttonColor={'#2196f3'}
              animation={true}
              buttonSize={50}
              buttonOuterSize={55}
              labelStyle={{
                fontSize: 17,
                color: 'white',
                padding: 10
              }}
              onPress={value => {
                this.setState({ fishType: value });
              }}
              style={{
                padding: 5
              }}
            />
            <View style={styles.dropDownInput}>{this.renderLocationTag()}</View>
            <Item style={styles.itemStyle}>
              <Input
                style={styles.input}
                placeholderTextColor={COLORS.MEDIUM_GREY}
                onChangeText={v => this.onChange('tagNumber', v)}
                value={this.state.tagNumber}
                placeholder="Tag Number (do not include prefix)"
              />
            </Item>
            <Item style={styles.itemStyle}>
              <Input
                style={styles.input}
                placeholderTextColor={COLORS.MEDIUM_GREY}
                onChangeText={v => this.onChange('fishLength', v)}
                value={this.state.fishLength}
                placeholder={fishLengthPlaceHolder}
                keyboardType={'phone-pad'}
              />
            </Item>
            <Item style={styles.itemStyle}>
              <Input
                placeholderTextColor={COLORS.MEDIUM_GREY}
                style={styles.input}
                onChangeText={v => this.onChange('comment', v)}
                value={this.state.comment}
                placeholder="Comment"
              />
            </Item>
            <RadioForm
              radio_props={catchType}
              initial={this.state.recapture}
              formHorizontal={true}
              labelHorizontal={true}
              buttonColor={'#2196f3'}
              animation={true}
              buttonSize={30}
              buttonOuterSize={35}
              labelStyle={{
                color: 'white'
              }}
              onPress={value => {
                this.setState({ recapture: value });
              }}
            />
            <View style={styles.loginButtonSection}>
              <TouchableOpacity
                onPress={() => this.createTagReport()}
                style={[
                  styles.buttonStyle,
                  {
                    backgroundColor: this.state.isDisabled
                      ? '#efefef'
                      : '#00BCB4'
                  }
                ]}
                disabled={this.state.isDisabled}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: this.state.isDisabled ? '#ccc' : '#fff'
                    }
                  ]}
                >
                  Submit Tag Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  getConnectionInfo = () => {
    return !this.state.isConnected ? <OfflineNotice /> : null;
  };

  getFishLengthPlaceHolderText() {
    const { user } = this.state;

    let fishLengthPlaceHolder = 'Fish Length';
    if (user) {
      const preferredMeasure = user['custom:preferredMeasure'];
      fishLengthPlaceHolder = `Fish Length (${preferredMeasure})`;
    }
    return fishLengthPlaceHolder;
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: 700,
    backgroundColor: '#0B7EA0',
    paddingLeft: 20,
    paddingRight: 20
  },
  screen: {
    backgroundColor: '#0B7EA0'
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
    fontStyle: 'italic'
  },
  locationText: {
    margin: 10,
    fontSize: 24,
    textAlign: 'center',
    color: '#efefef',
    marginBottom: 20
  },
  location: {
    margin: 5,
    fontSize: 24,
    textAlign: 'center',
    color: '#efefef',
    fontWeight: 'bold'
  },
  loginButtonSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#00BCB4',
    padding: 14,
    marginTop: 20,
    borderRadius: 4,

    width: Platform.OS === 'ios' ? 330 : 350
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  textInput: {
    width: '80%',
    backgroundColor: COLORS.LIGHT_GREY,
    color: COLORS.DARK_GREY,
    borderRadius: 4,
    height: 50,
    marginBottom: 20,
    paddingLeft: 20,
    justifyContent: 'center',
    fontSize: 20
  },
  input: {
    height: 50,
    fontSize: 20,
    padding: 15,
    borderRadius: 4,
    paddingLeft: 20,
    color: COLORS.DARK_GREY,
    backgroundColor: COLORS.LIGHT_GREY
  },
  itemStyle: {
    marginBottom: 20
  },
  dropDownInput: {
    height: 55,
    margin: 5,
    marginBottom: 20,
    width: Platform.OS === 'ios' ? 340 : 370,
    borderColor: '#efefef',
    borderWidth: 0.5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  iconStyle: {
    color: '#fff',
    fontSize: 19,
    marginTop: 18
  }
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    color: 'white',
    borderRadius: 5,
    fontSize: 17,
    paddingTop: 20,
    paddingHorizontal: 20,
    fontWeight: 'normal'
  },
  placeholder: {
    color: 'white',
    paddingTop: 20
  },
  inputAndroid: {
    color: 'white',
    paddingHorizontal: 20,
    borderRadius: 5,
    fontWeight: 'bold'
  }
});
