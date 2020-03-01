import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Amplify, { API, graphqlOperation } from 'aws-amplify';

import * as queries from '../../graphql/queries';

export default class ProfileScreen extends React.Component {
  state = { name: '', description: '', tagReports: [] };

  async componentDidMount() {
    const readNote = `query MyQuery {
      listTagReports {
        items {
          id
          comment
          email
          fishLength
          fishType
          fishWeight
          guideName
          phone
          owner
          pictureUrl
          tagArea
          tagDate
          tagLocation
          tagNumber
        }
      }
    }`;

    try {
      const getTagReports = async () => {
        const allTagReports = await API.graphql(
          graphqlOperation(queries.listTagReportss),
        );
        //console.log('successfully fetched', allTagReports);

        this.setState({ tagReports: allTagReports.data.listTagReportss.items });
      };
      getTagReports();
    } catch (e) {
      console.log(e);
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
