import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/components/screens/HomeScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import TagLogScreen from './src/components/screens/TagLogScreen';

const appTabNavigatorConfig = {
  ['Report Tag']: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Report Tag',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons style={{ fontSize: 26, color: tintColor }} name="ios-home" />
      )
    }
  },
  ['Tag Log']: {
    screen: TagLogScreen,
    navigationOptions: {
      tabBarLabel: 'Tag Log',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          style={{ fontSize: 26, color: tintColor }}
          name="ios-person"
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

const appTabNavigatorOptions = {
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: false,
  },
  tabBarOptions: {
    showLabel: false,
    activeTintColor: '#fff',
    inactiveTintColor: '#fff9',
    style: {
      backgroundColor: '#00BCB4',
      height: 60
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
    
    },
    indicatorStyle: {
      height: 0
    },
    showIcon: true
  },
  defaultNavigationOptions: {
    tabBarVisible: false,
    headerStyle: {
      backgroundColor: '#efefef'
    },
    headerTintColor: '#ccc',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }
};

export const AppTabNavigator = createMaterialTopTabNavigator(
  appTabNavigatorConfig,
  appTabNavigatorOptions
);

AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let headerTitle = routeName;
  return {
    headerStyle: {
      backgroundColor: '#efefef',
      color: 'white',
      activeTintColor: '#fff',
      inactiveTintColor: '#fff9'
    },
    headerTitle
  };
};
