import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Item, Input, Toast } from 'native-base';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import RNPickerSelect from 'react-native-picker-select';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import * as Font from 'expo-font';
import RadioForm from 'react-native-simple-radio-button';
import { connectionState } from '../app/actions';
import { IsConnected } from '../../components/network/IsConnected';
import * as mutations from '../../graphql/mutations';
import species from '../data/species';
import locations from '../data/locations';

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
    isDisabled: true
  };

  static navigationOptions = () => ({
    animationEnabled: true
  });

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      'PermanentMarker-Regular': require('../../../assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    });

    await this.getCurrentUser();

    await this.getCurrentLocation();
  }

  handleConnectionChange = isConnected => {
    this.setState({ isConnected });
    console.log(`Connection type: ${isConnected.type}`);
    console.log(`this.state.status: ${this.state.status}`);
  };

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    Location.getCurrentPositionAsync({})
      .then(location => {
        this.setState({ currentPosition: location.coords });
        const latLong = `lat:=${location.coords.latitude} long:=${location.coords.longitude}`;

        if (location.coords) {
          Location.reverseGeocodeAsync({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          }).then(area => {
            if (area.length) {
              const { city, region, country, name } = area[0];
              const locatedArea = city + ', ' + region + ', ' + country;
              console.log('location NAME:', name);
              this.setState({ tagArea: locatedArea });
            }
          });
        }
        this.setState({
          location: latLong,
          message: 'Please enter the required tag report data'
        });
      })
      .catch(e => console.log(e));
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
      tagLocationCode
    } = this.state;

    const { phone_number, email } = user;

    Toast.show({
      text: 'Tag successfully submitted!',
      buttonText: 'Okay',
      duration: 5000,
      position: 'bottom',
      type: 'success'
    });

    const tagReport = await this.formatTagReport(
      tagArea,
      email,
      fishType,
      comment,
      tagLocationCode,
      tagNumber,
      location,
      fishLength,
      user,
      phone_number
    );

    try {
      const result = await API.graphql(
        graphqlOperation(mutations.createTagReports, {
          input: tagReport
        })
      );

      this.clearTagReportState();
      this.getLocation();
    } catch (err) {
      console.log('Warning!!! - error creating tarReport...', err);
      this.setState({
        errorMessage: 'Unable to submit tag report'
      });
      alert(err.message);
      Toast.hide();
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
    phone_number
  ) => {
    return {
      tagArea,
      email,
      fishType,
      comment,
      tagNumber: tagLocationCode + '-' + tagNumber,
      tagDate: moment().format(),
      tagLocation: location,
      fishLength: fishLength + ' ' + user['custom:preferredMeasure'],
      guideName: user['custom:firstName'] + ' ' + user['custom:lastName'],
      phone: phone_number
    };
  };

  isEmpty = str => {
    return !str || 0 === str.length;
  };

  enableSubmission = value => {
    const { tagNumber, fishType, fishLength, location, user } = this.state;

    const isButtonDisabled =
      this.isEmpty(tagNumber) ||
      this.isEmpty(fishType) ||
      this.isEmpty(fishLength) ||
      this.isEmpty(location) ||
      this.isEmpty(user);

    this.setState({ isDisabled: isButtonDisabled });

    if (value.length === 0 && !isButtonDisabled) {
      this.setState({ isDisabled: true });
    }
  };

  getCurrentUser = async () => {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user.attributes }))
      .catch(err => console.log(err));
  };

  getCurrentLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
      this.setState({ tagArea: 'Key Largo, FL' });
    } else {
      await this.getLocation();
    }
  };

  clearTagReportState() {
    this.setState({
      fishLength: '',
      tagNumber: '',
      tagArea: null,
      comment: '',
      tagDate: null
    });
  }
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

  render() {
    let message = 'Locating.....';

    if (this.state.errorMessage) {
    } else if (this.state.location) {
      message = this.state.message;
    }

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView>
          <ScrollView>
            <View
              style={[
                styles.container,
                {
                  margin: 20
                }
              ]}
            >
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
                  padding: 10,
                  paddingBottom: 30
                }}
                onPress={value => {
                  this.setState({ fishType: value });
                }}
              />
              <View style={styles.dropDownInput}>
                {this.renderLocationTag()}
              </View>
              <Item style={styles.itemStyle}>
                <Input
                  style={styles.input}
                  placeholderTextColor="#adb4bc"
                  onChangeText={v => this.onChange('tagNumber', v)}
                  value={this.state.tagNumber}
                  placeholder="Tag Number"
                />
              </Item>
              <Item style={styles.itemStyle}>
                <Input
                  style={styles.input}
                  placeholderTextColor="#adb4bc"
                  onChangeText={v => this.onChange('fishLength', v)}
                  value={this.state.fishLength}
                  placeholder="Fish Length"
                  keyboardType={'phone-pad'}
                />
              </Item>
              <Item style={styles.itemStyle}>
                <Input
                  placeholderTextColor="#adb4bc"
                  style={styles.textInput}
                  onChangeText={v => this.onChange('comment', v)}
                  value={this.state.comment}
                  placeholder="Comment"
                />
              </Item>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  renderLocation = () => {
    return this.state.tagArea ? (
      <Text style={styles.locationText}>{this.state.tagArea}</Text>
    ) : null;
  };

  getConnectionInfo = () => {
    return !this.state.isConnected ? (
      <IsConnected isConnected={this.state.isConnected} />
    ) : null;
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateConnectionState: status => dispatch(connectionState(status))
  };
}

export default connect(null, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#0B7EA0'
  },
  paragraph: {
    margin: 10,
    fontSize: 17,
    textAlign: 'center',
    color: '#efefef',
    marginBottom: 30
  },
  locationText: {
   // fontFamily: 'PermanentMarker-Regular',
    margin: 10,
    fontSize: 22,
    textAlign: 'center',
    color: '#efefef',
    marginBottom: 30
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
    fontWeight: 'bold',
    //fontFamily: 'PermanentMarker-Regular'
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },

  itemStyle: {
    marginBottom: 10
  },
  dropDownInput: {
    height: 55,
    margin: 5,
    width: Platform.OS === 'ios' ? 340 : 370,
    borderColor: '#efefef',
    borderWidth: 0.5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
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
