import React from 'react';
import { TouchableOpacity, View, Alert } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen';
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import SignUpScreen from './src/components/screens/SignUpScreen';
import SignInScreen from './src/components/screens/SignInScreen';
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';

import Amplify from '@aws-amplify/core';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);

const configurations = {
  ReportTag: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Report Tag',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons style={{ fontSize: 26, color: tintColor }} name="ios-home" />
      ),
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 26, color: tintColor }}
          name="ios-person"
        />
      ),
    },
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
      ),
    },
  },
};

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: true,
  },
  tabBarOptions: {
    showLabel: true,
    activeTintColor: '#fff',
    inactiveTintColor: '#fff9',
    style: {
      backgroundColor: '#727b7a',
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 12,
    },
    indicatorStyle: {
      height: 0,
    },
    showIcon: true,
  },
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#efefef',
    },
    headerTintColor: '#ccc',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
};

const AppTabNavigator = createMaterialTopTabNavigator(configurations, options);

AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let headerTitle = routeName;
  return {
    headerStyle: {
      backgroundColor: '#efefef',
      color: 'white',
      activeTintColor: '#fff',
      inactiveTintColor: '#fff9',
    },
    headerTitle,
  };
};

const AppStackNavigator = createStackNavigator({
  Header: {
    screen: AppTabNavigator,

    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 10 }}>
            <Ionicons size={24} name="md-menu" />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
});

const AppDrawerNavigator = createDrawerNavigator({
  Tabs: AppStackNavigator,
  ReportTag: HomeScreen,
  Profile: ProfileScreen,
  Settings: SettingsScreen,
});

const AuthStackNavigator = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: () => ({
        title: `BTT - Tag Reporter`, // for the header screen
        headerBackTitle: 'Back',
        backgroundColor: 'black',
      }),
      cardStyle: { backgroundColor: 'transparent' },
    },
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: () => ({
        title: `Create a new account`,
      }),
    },
    SignIn: {
      screen: SignInScreen,
      navigationOptions: () => ({
        title: `Log in to your account`,
      }),
    },
    ForgetPassword: {
      screen: ForgetPasswordScreen,
      navigationOptions: () => ({
        title: `Create a new password`,
      }),
    },
  },
  {
    initialRouteName: 'Welcome',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#efefef',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const appNav = createSwitchNavigator({
  Authloading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppDrawerNavigator,
});

const AppContainer = createAppContainer(appNav);

export default class App extends React.Component {
  state = {
    status: false,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );
  }

  handleConnectionChange = isConnected => {
    this.setState({ status: isConnected });
    console.log(`this.state.status: ${this.state.status}`);
  };

  render() {
    return <AppContainer />;
  }
}
