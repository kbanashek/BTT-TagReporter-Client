import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { DataStore } from '@aws-amplify/datastore';
import { TagReports } from '../../../src/models';

const logo = require('../images/site-logo.png');

export default class WelcomeScreen extends React.Component {
  handleRoute = async destination => {
    this.props.navigation.navigate(destination);
  };

  state = {
    fontsLoaded: false
  };

  async loadFontsAsync() {
    // await Font.loadAsync({
    //   'PermanentMarker-Regular': require('../../../assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    // });
    // this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
   console.log('welcome screen loaded');
  }

  componentWillUnmount() {
    this.willFocusListener.remove();
  }

  willFocusListener = this.props.navigation.addListener('willFocus', () => {
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.email
    ) {
      const email = this.props.navigation.state.params.email;
      console.log('Setting EmAIL*****', email);
      this.props.navigation.navigate('SignIn', { email });
    }
  });

  render() {

      return (
        <View style={styles.container}>
          <View
            style={{
              marginTop: 70,
              width: 292,
              marginBottom: 30,
              alignItems: 'center'
            }}
          >
            <Image
              source={logo}
              style={{
                transform: [{ scale: 1.5 }],
                marginTop: 60,
                width: 220,
                height: 140
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontWeight: 'normal',
                fontSize: 28,
                padding: 2,
                color: '#efefef',
                
              }}
            >
              Tag Reporter
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.handleRoute('SignUp')}
            style={styles.buttonStyle}
          >
            <Text style={styles.textStyle}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleRoute('SignIn')}
            style={styles.buttonStyle}
          >
            <Text style={styles.textStyle}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.handleRoute('ForgetPassword')}
            style={styles.buttonStyle}
          >
            <Text style={styles.textStyle}>Forgot password ?</Text>
          </TouchableOpacity>
        </View>
      );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    alignItems: 'center'
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#00BCB4',
    padding: 16,
    marginBottom: 24,
    borderRadius: 4,
    width: 300
  },
  textStyle: {
    fontSize: 24,
    padding: 2,
    color: '#efefef',
    // fontFamily: 'PermanentMarker-Regular'
  }
});
