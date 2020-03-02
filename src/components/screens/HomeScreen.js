import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import moment from 'moment';

import * as mutations from '../../graphql/mutations';

export default class HomeScreen extends React.Component {
  state = {
    user: null,
    location: null,
    errorMessage: null,
    tagArea: null,
    currentPosition: null,
    tagNumber: '123',
    fishType: 'Permit',
    tagDate: '02/28/2002',
    tagLocation: '87.90 -123.33',
    message: 'Loading location...',
    comment: 'good fish',
    guideName: 'some guide',
    fishLength: '30',
    email: 'kb@aol.com',
    phone: '9492443191',
  };

  async componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user.attributes }))
      .catch(err => console.log(err));

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      await this.getLocation();
    }
  }

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let locatedArea = null;

    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    Location.getCurrentPositionAsync({})
      .then(location => {
        this.setState({ currentPosition: location.coords });
        const latLong = `lat:=${location.coords.latitude} long:=${location.coords.longitude}`;

        if (location.coords) {
          Location.reverseGeocodeAsync({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          }).then(area => {
            if (area.length) {
              const { city, region, country } = area[0];
              locatedArea = city + ', ' + region + ', ' + country;
              this.setState({ tagArea: locatedArea });
            }
          });
        }
        this.setState({
          location: latLong,
          message: 'Please enter the required tag report data',
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
    } = this.state;
    const { phone_number, email } = user;
    const todaysDate = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');

    const tagReport = {
      fishLength,
      tagNumber,
      tagArea,
      email,
      fishType,
      comment,
      tagDate: todaysDate,
      tagLocation: location,

      guideName: user['custom:firstName'],
      phone: phone_number,
    };

    console.log(tagReport);

    // TODO  - perform an optimistic response to update the UI immediately
    // const restaurants = [...this.state.restaurants, restaurant];

    // this.setState({
    //   restaurants,
    //   name: '',
    //   description: '',
    //   city: '',
    // });

    try {
      // await API.graphql(
      //   graphqlOperation(mutations.createTagReports, {
      //     input: tagReport,
      //   }),
      // );
      console.log('item created!');
      this.setState({
        message: 'Tag successfully submitted!',
      });
    } catch (err) {
      console.log('error creating tarReport...', err);
      this.setState({
        errorMessage: 'Unable to submit tag report',
      });
    }
  };

  onChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    let text,
      message = 'Locating.....';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = this.state.location;
      message = this.state.message;
    }

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>{this.state.tagArea}</Text>
        <Text style={styles.paragraph}>{message}</Text>

        <TextInput
          style={styles.textInput}
          onChangeText={v => this.onChange('tagNumber', v)}
          value={this.state.tagNumber}
          placeholder=" Tag Number"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={v => this.onChange('fishLength', v)}
          value={this.state.fishLength}
          placeholder="Fish Length"
        />
        <TextInput
          style={styles.textInput}
          onChangeText={v => this.onChange('comment', v)}
          value={this.state.comment}
          placeholder=" Comment"
        />
        <TouchableOpacity
          onPress={() => this.createTagReport()}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonText}>Submit Tag Report</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#0B7EA0',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#727b7a',
    padding: 14,
    marginBottom: 20,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  textInput: {
    height: 50,
    margin: 5,
    width: 300,
    backgroundColor: '#ddd',
    padding: 5,
  },
});
