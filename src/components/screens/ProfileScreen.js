import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';

import * as queries from '../../graphql/queries';

export default class ProfileScreen extends React.Component {
  state = { tagReports: [] };

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.getTagReports();
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      await this.loadTagReports();
    });

    await this.loadTagReports();
  }

  async loadTagReports() {
    try {
      const tagReports = await API.graphql(
        graphqlOperation(queries.listTagReportss),
      );

      this.setState({
        tagReports: tagReports.data.listTagReportss.items,
      });
    } catch (err) {
      console.log('error fetching tagReports...', err);
    }
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    // TODO - Render user profile properties
    // Auth.currentAuthenticatedUser()
    //   .then(user => console.log({ user }))
    //   .catch(err => console.log(err));

    return (
      <SafeAreaView style={styles.container}>
        {this.state.tagReports.map((tagReport, index) => (
          <View key={index} style={styles.tagReportContainer}>
            <Text style={styles.textStyle}>{tagReport.comment}</Text>
            <Text style={styles.textStyle}>{tagReport.fishType}</Text>
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
