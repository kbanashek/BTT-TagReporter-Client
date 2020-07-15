import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Auth from '@aws-amplify/auth';
import { Updates } from 'expo';

export default class AuthLoadingScreen extends React.Component {
  state = {
    userToken: null,
  };

  async componentDidMount() {


    try {
      const update = await Updates.checkForUpdateAsync()
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        // NOTIFY USER HERE
        Updates.reloadAsync()
      }
    } catch (e) {
        // HANDLE ERROR HERE
    }

    await this.loadApp();
  }

  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({
          userToken: user.signInUserSession.accessToken.jwtToken,
        });
      })
      .catch(err => console.log(err));
    this.props.navigation.navigate(this.state.userToken ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
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
});
