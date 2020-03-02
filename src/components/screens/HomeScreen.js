import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
    area: null,
    currentPosition: null,
    tagNumber: '123',
    fishType: 'Permit',
    tagDate: '02/28/2002',
    tagLocation: '87.90 -123.33',
    tagArea: 'Key Largo, FL',
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
              this.setState({ area: locatedArea });
            }
          });
        }
        this.setState({ location: latLong });
      })
      .catch(e => console.log(e));
  };

  createTagReport = async () => {
    const { name, description, city, location, area, user } = this.state;
    const { phone_number, email } = user;
    const todaysDate = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');

    const tagReport = {
      tagNumber: '123',
      fishType: 'Bone',
      tagDate: todaysDate,
      tagLocation: location,
      tagArea: area,
      comment: 'double digitsss',
      guideName: user['custom:firstName'],
      fishLength: '30',
      email: email,
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
      await API.graphql(
        graphqlOperation(mutations.createTagReports, {
          input: tagReport,
        }),
      );
      console.log('item created!');
      this.setState({
        area: 'Tag successfully submitted!',
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
      area = 'Locating.....';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = this.state.location;
      area = this.state.area;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>{area}</Text>

        <TouchableOpacity
          onPress={() => this.createTagReport()}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonText}>Submit Tag Report</Text>
        </TouchableOpacity>
      </View>
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
});
