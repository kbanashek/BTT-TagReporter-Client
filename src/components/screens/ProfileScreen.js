import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Auth from '@aws-amplify/auth';

export default class ProfileScreen extends React.Component {
  render() {
    // TODO - Render user profile properties
    // Auth.currentAuthenticatedUser()
    //   .then(user => console.log({ user }))
    //   .catch(err => console.log(err));

    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Profile</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff',
  },
});
