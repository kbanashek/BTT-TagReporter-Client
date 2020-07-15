import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Auth from '@aws-amplify/auth';
export class DrawerComponent extends React.Component {
  navigateToScreen = routeName => {
    const navigateAction = NavigationActions.navigate({
      routeName: routeName
    });
    this.props.navigation.dispatch(navigateAction);
  };

  logout = async () => {
    await Auth.signOut()
      .then(() => {
        console.log('Sign out complete');
        this.props.navigation.navigate('Authloading');
      })
      .catch(err => console.log('Error while signing out!', err));
  };

  canceledLogout = () => {
    console.log('The logout process is now cancelled');
  };

  logoutAlert = () => {
    Alert.alert('Confirm', 'Are you sure that you want to logout?', [
      { text: 'Yes', onPress: () => this.logout() },
      { text: 'No', onPress: () => this.canceledLogout }
    ]);
  };

  render() {
    styles = StyleSheet.create({
      container: {
        paddingTop: 40,
        flex: 1
      },
      navItemStyle: {
        padding: 10,
        
      },
      navItemText:{
        fontSize:22
      },
      navSectionStyle: {
        backgroundColor: 'lightgrey'
      },
      sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5
      },
      footerContainer: {
        padding: 20,
        backgroundColor: 'lightgrey'
      }
    });
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.sectionHeadingStyle}>
              <TouchableOpacity
                style={styles.navItemStyle}
                onPress={() => this.navigateToScreen('Report Tag')}
              >
                <Text style={styles.navItemText}>Report Tag</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItemStyle}
                onPress={() => this.navigateToScreen('Tag Log')}
              >
                <Text style={styles.navItemText}>Tag Log</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItemStyle}
                onPress={() => this.navigateToScreen('Settings')}
              >
                <Text style={styles.navItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItemStyle}
                onPress={() => this.logoutAlert()}
              >
                <Text style={styles.navItemText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>Bonefish and Tarpon Trust</Text>
          <Text>Tag Reporter</Text>
        </View>
      </View>
    );
  }
}
