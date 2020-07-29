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
  ActivityIndicator,
  ColorPropType
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Auth from '@aws-amplify/auth';
import { Item, Input } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const { width, height } = Dimensions.get('window');

const logo = require('../images/site-logo.png');

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
    isSignInDisabled: true,
    isLoading: false
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

  checkForUserName = () => {
    console.log('*****SignInProps', this.props.navigation.state.params);
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.email
    ) {
      console.log('*****', this.props.navigation.state.params.email);
      this.setState({ username: this.props.navigation.state.params.email });
    }
  };

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
      isSignInDisabled: username && password ? false : true
    });
  }
  async signIn() {
    const { username, password } = this.state;

    this.setState({ isLoading: true });

    await Auth.signIn(username, password)
      .then(user => {
        this.setState({ user, isLoading: false });
        this.props.navigation.navigate('Authloading');
      })
      .catch(err => {
        this.setState({ isLoading: false });
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
    const { showImage, isLoading, username } = this.state;

    return (
      <KeyboardAvoidingView
        KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <NavigationEvents onDidFocus={() => this.checkForUserName()} />
            <ActivityIndicator
              animating={isLoading}
              color="#bc2b78" // color of your choice
              size="large"
              style={styles.activityIndicator}
            />
            {showImage ? (
              <Image
                source={logo}
                style={{
                  transform: [{ scale: 1.5 }],
                  width: 200,
                  height: 120,
                  paddingBottom: 100,
                  marginBottom: 40
                }}
                resizeMode="contain"
              />
            ) : null}

            <View style={styles.inputView}>
              <Item>
                <Ionicons name="ios-mail" style={styles.iconStyle} />
                <Input
                  style={styles.inputText}
                  placeholderTextColor={COLORS.MEDIUM_GREY}
                  placeholder="Email"
                  keyboardType={'email-address'}
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={event => {
                    this.refs.SecondInput._root.focus();
                  }}
                  value={username}
                  onChangeText={value => this.onChangeText('username', value)}
                />
              </Item>
            </View>
            <View style={styles.inputView}>
              <Item>
                <Ionicons name="ios-lock" style={styles.iconStyle} />
                <Input
                  secureTextEntry
                  style={styles.inputText}
                  placeholder="Password"
                  placeholderTextColor={COLORS.MEDIUM_GREY}
                  returnKeyType="go"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  ref="SecondInput"
                  onChangeText={value => this.onChangeText('password', value)}
                  onFocus={() => this.fadeOut()}
                  onEndEditing={() => this.fadeIn()}
                />
              </Item>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ForgetPassword')}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.signIn()}
              style={[
                styles.loginBtn,
                {
                  backgroundColor: this.state.isSignInDisabled
                    ? '#ccc'
                    : '#009688'
                }
              ]}
              activeOpacity={0.5}
              disabled={this.state.isSignInDisabled || isLoading}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignUp')}
            >
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
    width: 350,
    backgroundColor: COLORS.LIGHT_GREY,
    color: COLORS.DARK_GREY,
    borderRadius: 4,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20
  },
  inputText: {
    height: 50,

    fontSize: 20
  },
  forgot: {
    color: 'white',
    fontSize: 14
  },
  loginBtn: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#00BCB4',
    padding: 14,
    borderRadius: 4
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 21,
    padding: 2,
    color: '#fff'
  },
  iconStyle: {
    color: COLORS.MEDIUM_GREY,
    fontSize: 18,
    marginRight: 10
  }
});
