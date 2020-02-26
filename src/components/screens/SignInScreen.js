import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Container, Item, Input } from 'native-base';

import Auth from '@aws-amplify/auth';
const logo = require('../images/site-logo.png');

export default class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(0),
    isHidden: false,
  };
  componentDidMount() {
    this.fadeIn();
  }
  fadeIn() {
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    this.setState({ isHidden: true });
  }
  fadeOut() {
    Animated.timing(this.state.fadeOut, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    this.setState({ isHidden: false });
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value,
    });
  }

  async signIn() {
    const { username, password } = this.state;
    await Auth.signIn(username, password)
      .then(user => {
        this.setState({ user });
        this.props.navigation.navigate('Authloading');
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when signing in: ', err);
          Alert.alert('Error when signing in: ', err);
        } else {
          console.log('Error when signing in: ', err.message);
          Alert.alert('Error when signing in: ', err.message);
        }
      });
  }
  render() {
    let { fadeOut, fadeIn, isHidden } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                {isHidden ? (
                  <Animated.Image
                    source={logo}
                    style={{
                      opacity: fadeIn,
                      width: 172,
                      height: 81,
                    }}
                  />
                ) : (
                  <Animated.Image
                    source={logo}
                    style={{ opacity: fadeOut, width: 172, height: 81 }}
                  />
                )}
              </View>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-person" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#adb4bc"
                      keyboardType={'email-address'}
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onSubmitEditing={event => {
                        this.refs.SecondInput._root.focus();
                      }}
                      onChangeText={value =>
                        this.onChangeText('username', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#adb4bc"
                      returnKeyType="go"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref="SecondInput"
                      onChangeText={value =>
                        this.onChangeText('password', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.signIn()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 300,
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#0B7EA0',
  },
  itemStyle: {
    marginBottom: 20,
  },
  iconStyle: {
    color: '#fff',
    fontSize: 30,
    marginRight: 15,
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
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 150,
    bottom: 425,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});
