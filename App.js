import React from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Root } from 'native-base';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './src/components/app/reducer';
import thunk from 'redux-thunk';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen';
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import SignUpScreen from './src/components/screens/SignUpScreen';
import SignInScreen from './src/components/screens/SignInScreen';
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import TagLogScreen from './src/components/screens/TagLogScreen';
import { useFonts } from 'expo-font';
import Amplify from '@aws-amplify/core';
import awsmobile from './aws-exports';
import { AppTabNavigator } from './appTabNavigatorConfig';
import { DrawerComponent } from './DrawerComponent';

Amplify.configure(awsmobile);


const HEADER_HEIGHT = Platform.OS === 'ios' ? 60 : 50;

const AppStackNavigator = createStackNavigator({
  Header: {
    screen: AppTabNavigator,

    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 30 }}>
            <Ionicons size={32} name="md-menu" />
          </View>
        </TouchableOpacity>
      )
    })
  }
});

const AppDrawerNavigator = createDrawerNavigator(
  {
    Menu: AppStackNavigator,
    ['Report Tag']: HomeScreen,
    ['Tag Log']: TagLogScreen,
    Settings: SettingsScreen,
    ['Sign Out']: SettingsScreen
  },
  {
    contentComponent: DrawerComponent
  }
);

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
  App: AppDrawerNavigator,
  ForgetPassword: ForgetPasswordScreen
});

const AppContainer = createAppContainer(appNav);

const store = createStore(reducer, applyMiddleware(thunk));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppContainer />
        </Root>
      </Provider>
    );
  }
}
