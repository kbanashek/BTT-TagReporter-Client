import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  Modal,
  FlatList,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container, Item, Input } from 'native-base';
import Auth from '@aws-amplify/auth';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';
import data from '../countriesData';
const logo = require('../images/site-logo.png');

const defaultFlag = data.filter(obj => obj.name === 'United States')[0].flag;
const defaultCode = data.filter(obj => obj.name === 'United States')[0]
  .dial_code;

export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    fadeIn: new Animated.Value(0), // Initial value for opacity: 0
    fadeOut: new Animated.Value(1), // Initial value for opacity: 1
    isHidden: false,
    flag: defaultFlag,
    modalVisible: false,
    preferredMeasure: '',
    authCode: '',
    firstName: '',
    lastName: '',
    isSignUpDisabled: true,
    isConfirmDisabled: true
  };

  preferredMeasureSize = [
    { label: 'Inches    ', value: 'in' },
    { label: 'Centimeters      ', value: 'cm' }
  ];

  onChangeText(key, value) {
    this.setState(
      {
        [key]: value
      },
      this.enableSignUp(),
      this.enableConfirmSignUp()
    );
  }

  enableConfirmSignUp = () => {
    const { authCode } = this.state;

    const isConfirmDisabled = authCode ? true : false;

    console.log('isConfirmDisabled' + isConfirmDisabled);

    this.setState({
      isConfirmDisabled
    });

    console.log('authCode' + authCode);
  };

  enableSignUp = () => {
    const { firstName, lastName, email, password, phoneNumber } = this.state;
    const allRequiredFields =
      firstName && lastName && email && password && phoneNumber ? true : false;
    console.log('allRequiredFields' + allRequiredFields.toString());

    this.setState({
      isSignUpDisabled: !allRequiredFields
    });
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
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start();
    this.setState({ isHidden: false });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
    // refocus on phone Input after selecting country and/or closing Modal
    this.refs.FourthInput._root.focus();
    // console.log('Hidden')
  }

  async getCountry(country) {
    const countryData = await data;
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country
      )[0].dial_code;
      const countryFlag = await countryData.filter(
        obj => obj.name === country
      )[0].flag;
      // Set data from user choice of country
      this.setState({ phoneNumber: countryCode, flag: countryFlag });
      await this.hideModal();
    } catch (err) {
      console.log(err);
    }
  }

  async signUp() {
    const {
      username,
      password,
      email,
      phoneNumber,
      firstName,
      lastName,
      preferredMeasure
    } = this.state;

    const phone_number = phoneNumber;

    await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        phone_number,
        'custom:firstName': firstName,
        'custom:lastName': lastName,
        'custom:preferredMeasure': preferredMeasure
      }
    })
      .then(() => {
        console.log('sign up successful!');
        Alert.alert('Enter the confirmation code you received.');
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when signing up: ', err);
          Alert.alert('Error when signing up: ', err);
        } else {
          console.log('Error when signing up: ', err.message);
          Alert.alert('Error when signing up: ', err.message);
        }
      });
  }

  async confirmSignUp() {
    const { email, authCode } = this.state;
    await Auth.confirmSignUp(email, authCode)
      .then(() => {
        this.props.navigation.navigate('SignIn');
        console.log('Confirm sign up successful');
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when entering confirmation code: ', err);
          Alert.alert('Error when entering confirmation code: ', err);
        } else {
          console.log('Error when entering confirmation code: ', err.message);
          Alert.alert('Error when entering confirmation code: ', err.message);
        }
      });
  }

  async resendSignUp() {
    const { email } = this.state;
    await Auth.resendSignUp(email)
      .then(() =>
        Alert.alert(
          'A confirmation code has been resent to the provided email address',
          'Success'
        )
      )

      .catch(err => {
        if (!err.message) {
          console.log('Error requesting new confirmation code: ', err);
          Alert.alert('Error requesting new confirmation code: ', err);
        } else {
          console.log('Error requesting new confirmation code: ', err.message);
          Alert.alert('Error requesting new confirmation code: ', err.message);
        }
      });
  }

  render() {
    let { fadeOut, fadeIn, isHidden, flag } = this.state;
    const countryData = data;
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
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-person" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="#adb4bc"
                      returnKeyType="next"
                      ref="SecondInput"
                      keyboardType={'default'}
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={value =>
                        this.onChangeText('firstName', value)
                      }
                      onSubmitEditing={event => {
                        this.refs.SecondInput._root.focus();
                      }}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />

                    <Input
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="#adb4bc"
                      returnKeyType="next"
                      keyboardType={'default'}
                      autoCapitalize="words"
                      autoCorrect={false}
                      ref="SecondInput"
                      onChangeText={value =>
                        this.onChangeText('lastName', value)
                      }
                      onSubmitEditing={event => {
                        this.refs.ThirdInput._root.focus();
                      }}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>

                  {/* email section */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-mail" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#adb4bc"
                      keyboardType={'email-address'}
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref="ThirdInput"
                      onSubmitEditing={event => {
                        this.refs.Third._root.focus();
                      }}
                      onChangeText={value => this.onChangeText('email', value)}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>

                  {/*  password section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-lock" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#adb4bc"
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref="ThirdInput"
                      onSubmitEditing={event => {
                        this.refs.FourthInput._root.focus();
                      }}
                      onChangeText={value =>
                        this.onChangeText('password', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>

                  {/* phone section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-call" style={styles.iconStyle} />
                    {/* country flag */}
                    <View>
                      <Text style={{ fontSize: 30 }}>{flag}</Text>
                    </View>
                    {/* open modal */}
                    <Ionicons
                      name="md-arrow-dropdown"
                      style={[styles.iconStyle, { marginLeft: 5 }]}
                      onPress={() => this.showModal()}
                    />
                    <Input
                      style={styles.input}
                      placeholder="85757309..."
                      placeholderTextColor="#adb4bc"
                      keyboardType={'phone-pad'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      ref="FifthInput"
                      value={this.state.phoneNumber}
                      onChangeText={val => {
                        if (this.state.phoneNumber === '') {
                          // render UK phone code by default when Modal is not open
                          this.onChangeText('phoneNumber', defaultCode + val);
                        } else {
                          // render country code based on users choice with Modal
                          this.onChangeText('phoneNumber', val);
                        }
                      }}
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                    {/* Modal for country code and flag */}
                    <Modal
                      animationType="slide" // fade
                      transparent={false}
                      visible={this.state.modalVisible}
                    >
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 10,
                            paddingTop: 80,
                            backgroundColor: '#0B7EA0'
                          }}
                        >
                          <FlatList
                            data={countryData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                              <TouchableWithoutFeedback
                                onPress={() => this.getCountry(item.name)}
                              >
                                <View
                                  style={[
                                    styles.countryStyle,
                                    {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }
                                  ]}
                                >
                                  <Text
                                    style={{
                                      fontSize: 25
                                    }}
                                  >
                                    {item.flag}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: '#fff'
                                    }}
                                  >
                                    {item.name} ({item.dial_code})
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                            )}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => this.hideModal()}
                          style={styles.closeButtonStyle}
                        >
                          <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </Item>
                  <View style={{paddingBottom:10, paddingTop:10}}>
                    {/* <Text style={{ fontSize: 15, color: 'white' }}>Preferred Measurement</Text> */}
                    <RadioForm
                      ref="radioForm"
                      radio_props={this.preferredMeasureSize}
                      initial={this.preferredMeasureSize[0]}
                      formHorizontal={true}
                      labelHorizontal={true}
                      buttonColor={'#2196f3'}
                      animation={true}
                      buttonSize={20}
                      buttonOuterSize={30}
                      labelStyle={{ fontSize: 15, color: 'white' }}
                      onPress={value => {
                        this.setState({ preferredMeasure: value });
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => this.signUp()}
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: this.state.isSignUpDisabled
                          ? '#607D8B'
                          : '#009688'
                      }
                    ]}
                    activeOpacity={0.5}
                    disabled={this.state.isSignUpDisabled}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </TouchableOpacity>
                  {/* code confirmation section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="md-apps" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Confirmation code"
                      placeholderTextColor="#adb4bc"
                      keyboardType={'numeric'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      onChangeText={value =>
                        this.onChangeText('authCode', value)
                      }
                      onFocus={() => this.fadeOut()}
                      onEndEditing={() => this.fadeIn()}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.confirmSignUp()}
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: this.state.isSignUpDisabled
                          ? '#607D8B'
                          : '#009688'
                      }
                    ]}
                    activeOpacity={0.5}
                    disabled={this.state.isSignUpDisabled}
                  >
                    <Text style={styles.buttonText}>Confirm Sign Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.resendSignUp()}
                    style={styles.buttonStyle}
                    style={[
                      styles.buttonStyle,
                      {
                        backgroundColor: this.state.isConfirmDisabled
                          ? '#607D8B'
                          : '#009688'
                      }
                    ]}
                    activeOpacity={0.5}
                    disabled={this.state.isConfirmDisabled}
                  >
                    <Text style={styles.buttonText}>Resend code</Text>
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
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },
  radio: {
    flex: 1,
    flexDirection: 'row'
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 570,
    top:20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#0B7EA0'
  },
  itemStyle: {
    marginBottom: 10
  },
  iconStyle: {
    color: '#fff',
    fontSize: 18,
    marginRight: 15
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#00BCB4',
    padding: 14,
    marginBottom: 10,
    borderRadius: 4,
   
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 21,
    padding: 2,
    color: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 600,
    bottom: 270,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textStyle: {
    padding: 5,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  },
  countryStyle: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    borderTopColor: '#211f',
    borderTopWidth: 1,
    padding: 12
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#00BCB4'
  }
});
