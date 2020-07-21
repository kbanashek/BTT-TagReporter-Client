import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  Modal,
  FlatList,
  Animated,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container, Item, Input, Toast, Spinner } from 'native-base';
import Auth from '@aws-amplify/auth';
import * as Font from 'expo-font';
import RadioForm from 'react-native-simple-radio-button';
import countriesData from '../data/countriesData';

const defaultFlag = countriesData.filter(obj => obj.name === 'United States')[0]
  .flag;
const defaultCode = countriesData.filter(obj => obj.name === 'United States')[0]
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
    isConfirmDisabled: true,
    loading: false,
    membershipCode: ''
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

      this.enableConfirmSignUp()
    );
  }

  enableConfirmSignUp = () => {
    const { authCode } = this.state;
    const isConfirmDisabled = authCode.length === 0 ? true : false;
    this.setState({
      isConfirmDisabled
    });
  };

  isEmpty = str => {
    return !str || 0 === str.length;
  };

  enableSignUp = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      membershipCode
    } = this.state;

    let allRequiredFields =
      this.isEmpty(firstName) ||
      this.isEmpty(lastName) ||
      this.isEmpty(email) ||
      this.isEmpty(password) ||
      this.isEmpty(phoneNumber) || membershipCode !== 'btt#1'
        ? true
        : false;

    // console.log('this.isEmpty(firstName)' + this.isEmpty(firstName));
    // console.log('this.isEmpty(lastName)' + this.isEmpty(lastName));
    // console.log('this.isEmpty(email)' + this.isEmpty(email));
    // console.log('this.isEmpty(password)' + this.isEmpty(password));
    // console.log('this.isEmpty(phoneNumber)' + this.isEmpty(phoneNumber));

    console.log('isdisabled' + allRequiredFields);

    return allRequiredFields ;
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      'PermanentMarker-Regular': require('../../../assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    });
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
    const countryData = await countriesData;
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country
      )[0].dial_code;
      const countryFlag = await countryData.filter(
        obj => obj.name === country
      )[0].flag;
      // Set countriesData from user choice of country
      this.setState({ phoneNumber: countryCode, flag: countryFlag });
      await this.hideModal();
    } catch (err) {
      console.log(err);
    }
  }

  async signUp() {
    this.setState({ loading: true });
    const {
      password,
      email,
      phoneNumber: phone_number,
      firstName,
      lastName,
      preferredMeasure
    } = this.state;

    console.log('****', phone_number);
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
        this.setState({ loading: false });
        Toast.show({
          text: 'Enter the confirmation code you received.',
          buttonText: 'Okay',
          duration: 5000,
          position: 'bottom',
          type: 'success'
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        if (!err.message) {
          Toast.show({
            text: 'Unable to register user',
            buttonText: 'Okay',
            duration: 5000,
            position: 'bottom',
            type: 'danger'
          });
        } else {
          Toast.show({
            text: err.message,
            buttonText: 'Okay',
            duration: 5000,
            position: 'bottom',
            type: 'warning'
          });
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
    const { flag } = this.state;
    const enableRegistration = this.enableSignUp();
    const countryData = countriesData;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <Container style={styles.infoContainer}>
            <View style={[styles.container, { top: 50 }]}>
              <Item style={[styles.itemStyle, { top: 0 }]}>
                <Ionicons name="ios-person" style={styles.iconStyle} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#adb4bc"
                  returnKeyType="next"
                  ref="SecondInput"
                  keyboardType={'default'}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus={true}
                  onChangeText={value => this.onChangeText('firstName', value)}
                  selectionColor="white"
                />

                <TextInput
                  style={[styles.input, { marginLeft: 40, backgroundColor: 'grey' }]}
                  placeholder="Last Name"
                  placeholderTextColor="#adb4bc"
                  returnKeyType="next"
                  keyboardType={'default'}
                  autoCapitalize="words"
                  autoCorrect={false}
                  ref="SecondInput"
                  onChangeText={value => this.onChangeText('lastName', value)}
                  selectionColor="white"
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
                  onChangeText={value => this.onChangeText('email', value)}
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
                  onChangeText={value => this.onChangeText('password', value)}
                />
              </Item>

              {/*  password section  */}
              <Item style={styles.itemStyle}>
                <Ionicons name="ios-lock" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder="Membership Code"
                  placeholderTextColor="#adb4bc"
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  ref="ThirdInput"
                  onSubmitEditing={() => {
                    this.refs.FourthInput._root.focus();
                  }}
                  value={this.state.membershipCode}
                  onChangeText={value =>
                    this.onChangeText('membershipCode', value)
                  }
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
                      this.onChangeText('phoneNumber', defaultCode + val);
                    } else {
                      // render country code based on users choice with Modal
                      this.onChangeText('phoneNumber', val);
                    }
                  }}
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
              <View style={{ paddingBottom: 10, paddingTop: 10 }}>
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
                    backgroundColor: enableRegistration ? '#ccc' : '#009688'
                  }
                ]}
                activeOpacity={0.5}
                disabled={enableRegistration}
              >
                <Text style={styles.buttonText}>Sign Up</Text>

                {this.state.loading ? <Spinner color="green" /> : null}
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
                  onChangeText={value => this.onChangeText('authCode', value)}
                />
              </Item>
              <TouchableOpacity
                onPress={() => this.confirmSignUp()}
                style={[
                  styles.buttonStyle,
                  {
                    backgroundColor: this.state.isConfirmDisabled
                      ? '#ccc'
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
                      ? '#ccc'
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
    height: 50,
    color: 'white',
    fontSize: 20,
    padding: 5,
    borderRadius: 4
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
    top: 20,
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
    borderRadius: 4
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 21,
    padding: 2,
    color: '#fff'
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
