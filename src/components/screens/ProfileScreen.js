import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Amplify, { API, graphqlOperation } from 'aws-amplify';

import * as queries from '../../graphql/queries';

export default class ProfileScreen extends React.Component {
  state = { name: '', description: '', tagReports: [] };

  getTagReports = async () => {
    const allTagReports = await API.graphql(
      graphqlOperation(queries.listTagReportss),
    );
    this.setState({ tagReports: allTagReports.data.listTagReportss.items });
  };

  async componentDidMount() {
    try {
      this.getTagReports();
    } catch (e) {
      console.log(`error${e}`);
    }
  }

  render() {
    // TODO - Render user profile properties
    // Auth.currentAuthenticatedUser()
    //   .then(user => console.log({ user }))
    //   .catch(err => console.log(err));

    return (
      <SafeAreaView style={styles.container}>
        {this.state.tagReports.map((tagReport, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.name}>{tagReport.comment}</Text>
            <Text style={styles.name}>{tagReport.fishType}</Text>
          </View>
        ))}
      </SafeAreaView>
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
