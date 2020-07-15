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

  species = [
    { label: 'Bonefish    ', value: 'bonefish' },
    { label: 'Permit      ', value: 'permit' }
  ];

  locations = [
    { label: 'US', value: 'BTT' },
    { label: 'Belize', value: 'BZ' },
    { label: 'Mexico', value: 'MX' },
    { label: 'Bahamas', value: 'BA' }
  ];

  static navigationOptions = () => ({
    animationEnabled: true
  });

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user.attributes }))
      .catch(err => console.log(err));

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
      this.setState({ tagArea: 'Key Largo, FL' });
    } else {
      await this.getLocation();
    }

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
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
      position: 'bottom'
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

    //console.log(tagReport);
    //this.refs.radioForm.updateIsActiveIndex(-1);

    try {
      const result = await API.graphql(
        graphqlOperation(mutations.createTagReports, {
          input: tagReport
        })
      );
      console.log('DB active - item created!', result);
      this.props.updateConnectionState(true);

      this.clearTagReportState();
    } catch (err) {
      //console.log('error creating tarReport...', err);
      this.setState({
        errorMessage: 'Unable to submit tag report'
      });
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
      tagDate: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
      tagLocation: location,
      fishLength: fishLength + ' ' + user['custom:preferredMeasure'],
      guideName: user['custom:firstName'] + ' ' + user['custom:lastName'],
      phone: phone_number
    };
  };

  enableSubmission = (value) => {
    const { tagNumber, fishType, fishLength, location, user } = this.state;

    const isButtonDisabled = tagNumber && fishType && fishLength && location && user ? false : true;

    this.setState({ isDisabled: isButtonDisabled });

    if (value.length === 0 && !isButtonDisabled) {
      this.setState({ isDisabled: true });
    }
  }

  clearTagReportState() {
    this.setState({
    
      fishLength: null,
      tagNumber: null,
      tagArea: null,
      fishType: null,
      comment: null,
      tagDate: null,
      tagLocation: null,
      tagLocationCode: null
    });

    this.getLocation();
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
        items={this.locations}
        style={styles.input}
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
            <View style={styles.container}>
              {this.getConnectionInfo()}
              {this.renderLocation()}
              <Text style={styles.paragraph}>{message}</Text>
              <RadioForm
                ref="radioForm"
                radio_props={this.species}
                initial={this.state.fishType}
                formHorizontal={true}
                labelHorizontal={true}
                buttonColor={'#2196f3'}
                animation={true}
                buttonSize={20}
                buttonOuterSize={30}
                labelStyle={{ fontSize: 15, color: 'white' }}
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
      <Text style={styles.location}>{this.state.tagArea}</Text>
    ) : null;
  };

  getConnectionInfo = () => {
    return !this.state.isConnected ? (
      <IsConnected isConnected={this.state.isConnected} />
    ) : null;
  };
}

// const mapDispatchToProps = () => {
//     connectionState;
// };

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
    margin: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#efefef'
  },
  location: {
    margin: 15,
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
    width: 350
    //  left: Platform.OS == "ios" ? 15: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold'
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
    width: 380,
    borderColor: '#efefef',
    borderWidth: 0.5,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  }
});
