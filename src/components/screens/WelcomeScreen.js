import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
const logo = require('../images/site-logo.png');

export default class WelcomeScreen extends React.Component {
  handleRoute = async destination => {
    await this.props.navigation.navigate(destination);
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginTop: 80,
            width: 292,
            marginBottom: 100,
            alignItems: 'center',
          }}
        >
          <Image source={logo} style={{ width: 252, height: 101,  marginTop: 60, }} />
        </View>
        <TouchableOpacity
          onPress={() => this.handleRoute('SignUp')}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.handleRoute('SignIn')}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.handleRoute('ForgetPassword')}
          style={styles.buttonStyle}
        >
          <Text style={styles.textStyle}>Forget password ?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    alignItems: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#00BCB4',
    padding: 16,
    marginBottom: 24,
    borderRadius: 4,
    width: 300
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 2,
    color: '#fff',
  },
});
