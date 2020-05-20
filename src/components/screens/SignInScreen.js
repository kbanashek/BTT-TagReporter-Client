import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-navigation'

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
    isSignInDisabled: true,
  };

  
  componentDidMount() {
    this.fadeIn();
    //this.refs.radioForm.updateIsActiveIndex(1);
  }

  fadeIn() {
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
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

    const { username, password } = this.state;
    username && password
      ? this.setState({
          isSignInDisabled: false,
        })
      : null;
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
        
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                {isHidden ? (
                   <Image source={logo} style={{ width: 252, height: 101 }} />
                ) : (
                  <Animated.Image
                    source={logo}
                    style={{ opacity: fadeOut, width: 172, height: 81  }}
                  />
                )}
              </View>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-person" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Email"
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
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: this.state.isSignUpDisabled
                          ? '#607D8B'
                          : '#009688',
                      },
                    ]}
                    activeOpacity={0.5}
                    disabled={this.state.isSignInDisabled}
                  >
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
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
    backgroundColor: '#00BCB4',
    padding: 14,
    marginBottom: 20,
    borderRadius: 4,
   
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 2,
    color: '#fff',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 400,
    bottom: 180,
    
    alignItems: 'center',
   // justifyContent: 'center',
    flex: 1,
  },
});
