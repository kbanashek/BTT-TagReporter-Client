import React , { ReactElement } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  
  createAppContainer
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/components/screens/HomeScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import TagLogScreen from './src/components/screens/TagLogScreen';
const Tab = createMaterialBottomTabNavigator();
const TabBarIcon = focused => {
  return (
    <Image
      style={{
        width: focused ? 24 : 18,
        height: focused ? 24 : 18,
      }}
      source={IC_MASK}
    />
  );
};
function AppTabNavigator() {
  return (
    <Tab.Navigator
     
    >
      <Tab.Screen
        name="Screen1"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Screen1',
          tabBarIcon: ({ focused }) => 
            TabBarIcon(focused),
        }}
      />
      <Tab.Screen name="Screen2" component={HomeScreen} />
      <Tab.Screen name="Screen3" component={SettingsScreen} />
      <Tab.Screen name="Screen4" component={SettingsScreen} />
    </Tab.Navigator>
  );
}


const TabNavigator = createAppContainer(AppTabNavigator);

export default TabNavigator;