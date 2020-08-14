import React from 'react';
import { TouchableOpacity, View, Platform, Image, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { Root } from 'native-base';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './src/components/app/reducer';
import thunk from 'redux-thunk';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Amplify from '@aws-amplify/core';
import awsmobile from './aws-exports';

import * as Font from 'expo-font';

import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen';
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import SignUpScreen from './src/components/screens/SignUpScreen';
import SignInScreen from './src/components/screens/SignInScreen';
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import TagLogScreen from './src/components/screens/TagLogScreen';

const logo = require('./assets/header.png');

Amplify.configure(awsmobile);

import { YellowBox } from 'react-native';
import COLORS from './src/constants/constants';

// Configurations and options for the AppTabNavigator
const configurations = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Report Tag',
      tabBarIcon: ({ tintColor }) => (
        <AntDesign
          name="tagso"
          style={{ fontSize: 26, color: tintColor, paddingBottom: 35 }}
        />
      )
    }
  },
  Profile: {
    screen: TagLogScreen,
    navigationOptions: {
      tabBarLabel: 'Tag Log',
      tabBarIcon: ({ tintColor }) => (
        <AntDesign
          name="book"
          style={{ fontSize: 26, color: tintColor, paddingBottom: 35 }}
        />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 26, color: tintColor }}
          name="ios-settings"
        />
      )
    }
  }
};

const options = {
  initialRouteName: 'Home',
  activeColor: '#f0edf6',
  inactiveColor: '#226557',

  barStyle: { backgroundColor: '#00BCB4' }
};

// Bottom App tabs
const AppTabNavigator = createMaterialBottomTabNavigator(
  configurations,
  options
);

const AppStackNavigator = createAppContainer(AppTabNavigator);

// App stack for the drawer

const authStackNavigationOptions = {
  initialRouteName: 'Welcome',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#fff'
    },
    headerTintColor: '#000',
    headerShown: true,
    backgroundColor: 'white'
  }
};

const AuthStackNavigator = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: () => ({
        title: `BTT - Tag Reporter`,
        headerBackTitle: 'Back',
        backgroundColor: 'white',
        headerShown: false
      }),
      cardStyle: { backgroundColor: 'transparent' }
    },
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: () => ({
        title: `Register`
      })
    },
    SignIn: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Login`
      })
    },
    ForgetPassword: {
      screen: ForgetPasswordScreen,
      navigationOptions: () => ({
        title: `Reset Password`
      })
    }
  },
  authStackNavigationOptions
);

const appNav = createSwitchNavigator({
  Authloading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppStackNavigator,
  ForgetPassword: ForgetPasswordScreen
});

const AppContainer = createAppContainer(appNav);

const store = createStore(reducer, applyMiddleware(thunk));

export default class App extends React.Component {

  async loadFontsAsync() {
    await Font.loadAsync({
      'PermanentMarker-Regular': require('./assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    });
    this.setState({ fontsLoaded: true });
  }

  async componentDidMount() {
    this.loadFontsAsync();
  }

  render() {
    YellowBox.ignoreWarnings(['Warning: ViewPagerAndroid has been extracted']);

    return (
      <Provider store={store}>
        <Root>
          <View
            style={{
              flex: 0.06,
              backgroundColor: '#ecf0f1',
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: Platform.OS === 'ios' ? 50 : 70,
              paddingTop:Platform.OS === 'ios' ? 50 : 45,
              paddingBottom: Platform.OS === 'ios' ? 5 : 1,
              borderBottomColor: COLORS.BUTTON_ENABLED,
              borderBottomWidth: Platform.OS === 'ios' ? 5 : 5
            }}
          >
            <Image
              source={logo}
              style={{
                width: 300,
                height: 40
              }}
             
            />
            
          </View>
          <AppContainer />
        </Root>
      </Provider>
    );
  }
}
