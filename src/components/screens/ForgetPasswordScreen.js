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
  Animated,
  ScrollView
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Item, Input } from 'native-base';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth';

export default class ForgetPasswordScreen extends React.Component {
  state = {
    username: '',
    authCode: '',
    newPassword: '',
    fadeIn: new Animated.Value(0), // Initial value for opacity: 0
    fadeOut: new Animated.Value(1), // Initial value for opacity: 1
    isHidden: false
  };
  componentDidMount() {
    this.fadeIn();
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
  onChangeText(key, value) {
    this.setState({
      [key]: value
    });
  }
  // Request a new password
  async forgotPassword() {
    const { username } = this.state;
    await Auth.forgotPassword(username)
      .then(data => console.log('New code sent', data))
      .catch(err => {
        if (!err.message) {
          console.log('Error while setting up the new password: ', err);
          Alert.alert('Error while setting up the new password: ', err);
        } else {
          console.log('Error while setting up the new password: ', err.message);
          Alert.alert('Error while setting up the new password: ', err.message);
        }
      });
  }
  // Upon confirmation redirect the user to the Sign In page
  async forgotPasswordSubmit() {
    const { username, authCode, newPassword } = this.state;
    await Auth.forgotPasswordSubmit(username, authCode, newPassword)
      .then(() => {
        this.props.navigation.navigate('SignIn');
        console.log('the New password submitted successfully');
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error while confirming the new password: ', err);
          Alert.alert('Error while confirming the new password: ', err);
        } else {
          console.log('Error while confirming the new password: ', err.message);
          Alert.alert('Error while confirming the new password: ', err.message);
        }
      });
  }
  render() {
    let { fadeOut, fadeIn, isHidden } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <ScrollView >
            <View style={styles.container}>
              <TouchableWithoutFeedback
                style={styles.container}
                onPress={Keyboard.dismiss}
              >
                <View style={styles.infoContainer}>
                  {/* Username */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-person" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#adb4bc"
                      keyboardType={'email-address'}
                      returnKeyType="go"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={value =>
                        this.onChangeText('username', value)
                      }
                      onFocus={this.fadeOut.bind(this)}
                      onEndEditing={this.fadeIn.bind(this)}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.forgotPassword()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>Send Code</Text>
                  </TouchableOpacity>
                  {/* the New password section  */}
                  <Item style={styles.itemStyle}>
                    <Ionicons name="ios-lock" style={styles.iconStyle} />
                    <Input
                      style={styles.input}
                      placeholder="New password"
                      placeholderTextColor="#adb4bc"
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={true}
                      onSubmitEditing={event => {
                        this.refs.SecondInput._root.focus();
                      }}
                      onChangeText={value =>
                        this.onChangeText('newPassword', value)
                      }
                      onFocus={this.fadeOut.bind(this)}
                      onEndEditing={this.fadeIn.bind(this)}
                    />
                  </Item>
                  {/* Code confirmation section  */}
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
                      ref="SecondInput"
                      onChangeText={value =>
                        this.onChangeText('authCode', value)
                      }
                      onFocus={this.fadeOut.bind(this)}
                      onEndEditing={this.fadeIn.bind(this)}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => this.forgotPasswordSubmit()}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonText}>
                      Confirm Password Update
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#0B7EA0'
  },
  infoContainer: {
   

    marginTop: 50,
  
  },
  paragraph: {
    margin: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#efefef'
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
    width: Platform.OS == "ios" ? 320: 350,
    //  left: Platform.OS == "ios" ? 15: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
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
    color: '#fff',
    
  },
  itemStyle: {
    marginBottom: 10,
    padding: 10
  },
  iconStyle: {
    color: '#fff',
    fontSize: 30,
    marginRight: 15,
  },
});
