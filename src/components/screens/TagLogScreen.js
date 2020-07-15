import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Button
} from 'native-base';

import * as queries from '../../graphql/queries';

export default class TagLogScreen extends React.Component {
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
        graphqlOperation(queries.listTagReportss)
      );

      tagReports.data.listTagReportss.items.sort((a, b) => {
        return a.tagDate < b.tagDate;
      });

      this.setState({
        tagReports: tagReports.data.listTagReportss.items
      });
    } catch (err) {
      console.log('error fetching tagReports...', err);
    }
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
        <Container>
          <Content>
            <List style={styles.container}>
              { this.state.tagReports.map((tagReport, index) => (
                <ListItem key={index}>
                  <Left style={{ flex: 0.2 }}>
                    <Text style={styles.speciesType}>
                      {tagReport.fishType.substring(0, 1).toUpperCase()}
                    </Text>
                    <Text style={styles.textStyleSM}>
                      {tagReport.fishType.substring(1, tagReport.fishType.length)}
                    </Text>
                  </Left>
                  <Body>
                    <Text style={styles.textStyle}>Comment: {tagReport.comment}</Text>
                    <Text note numberOfLines={1} style={styles.textStyle}>
                      Captain: {tagReport.guideName} 
                    </Text>
                    <Text note numberOfLines={2} style={styles.textStyle}>
                      {tagReport.tagDate}
                    </Text>
                  </Body>
                </ListItem>
              ))}
            </List>
          </Content>
        </Container>
        </View>
       
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  textStyle: {
    fontSize: 14,
    padding: 10,
    color: '#fff'
  },
  textStyleSM: {
    fontSize: 12,

    color: '#fff'
  },
  speciesType: {
    fontSize: 28,
    fontWeight: 'bold',
   
    color: '#fff'
  }
});
