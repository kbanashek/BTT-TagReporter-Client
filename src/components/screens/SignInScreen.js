import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from 'react-native';
import Auth from '@aws-amplify/auth';

const logo = require('../images/site-logo.png');
export const { width, height } = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    screenWidth: 0,
    containerHeight: 0,
    showImage: true,
    username: '',
    password: '',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(0),
    isHidden: false,
    isSignInDisabled: true
  };

  componentDidMount = () => {
    const headerHeight = 78;
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      ({ endCoordinates }) =>
        this.setState({
          containerHeight: height - endCoordinates.height - headerHeight,
          showImage: false
        })
    );
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({
        containerHeight: height - headerHeight,
        showImage: true
      })
    );
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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
      useNativeDriver: true
    }).start();
    this.setState({ isHidden: false });
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    });

    const { username, password } = this.state;
       this.setState({
          isSignInDisabled: username && password ? false: true
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
    const { showImage } = this.state;

    return (
      <KeyboardAvoidingView
        KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {showImage ? (
             
                <Image
                  source={logo}
                  style={{ transform: [{ scale: 1.5 }],width: 200, height: 120, paddingBottom:100,marginBottom: 40, }}
                  resizeMode="contain"
                />
            
            ) : null}

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#efefef"
                placeholder="Email"
                keyboardType={'email-address'}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={event => {
                  this.refs.SecondInput._root.focus();
                }}
                onChangeText={value => this.onChangeText('username', value)}
                onFocus={() => this.fadeOut()}
                onEndEditing={() => this.fadeIn()}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                style={styles.inputText}
                placeholder="Password"
                placeholderTextColor="#efefef"
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
            </View>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('ForgetPassword')}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => this.signIn()}
              style={[
                styles.loginBtn,
                {
                  backgroundColor: this.state.isSignInDisabled
                    ? '#ccc'
                    : '#009688',
                },
              ]}
            activeOpacity={0.5}
            disabled={this.state.isSignInDisabled}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('SignUp')}>
              <Text style={styles.loginText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    paddingBottom: 0,
    color: '#fb5b5a',
    marginBottom: 40,
    marginTop: 10,
    height: 180
  },
  inputView: {
    width: '80%',
    backgroundColor: '#00BCB4',
    borderRadius: 4,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20
  },
  inputText: {
    height: 50,
    color: 'white',
    fontSize: 20
  },
  forgot: {
    color: 'white',
    fontSize: 14
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#00BCB4',
    borderRadius: 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 21,
    padding: 2,
    color: '#fff'
  }
});
