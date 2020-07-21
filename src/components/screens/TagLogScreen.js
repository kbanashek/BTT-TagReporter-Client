import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  ImageBackground
} from 'react-native';
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
import moment from 'moment';
import * as Font from 'expo-font';
import * as queries from '../../graphql/queries';

const bonefish = require('../../../assets/bonefish.png');
const permit = require('../../../assets/permit.png');
export default class TagLogScreen extends React.Component {
  state = { tagReports: [] };

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      this.getTagReports();
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      'PermanentMarker-Regular': require('../../../assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    });

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

      const sortByTagDate = (a, b) => {
        const dateA = new Date(a.tagDate).getTime();
        const dateB = new Date(b.tagDate).getTime();
        return dateA < dateB ? 1 : -1;
      };

      tagReports.data.listTagReportss.items.sort(sortByTagDate);

      console.log(tagReports.data.listTagReportss.items);

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
                {this.state.tagReports.map((tagReport, index) => (
                  <ListItem key={index}>
                    <Left
                      style={{
                        flex: 0.5,
                        backgroundColor: '#ccc',
                        height: 100
                      }}
                    >
                       {tagReport.fishType === 'bonefish' ? (
                       <ImageBackground
                       source={bonefish}
                       style={{ width: '100%', height: '100%' }}
                     >
                       <View
                         style={{
                           position: 'absolute',
                           top: 0,
                           left: 0,
                           right: 0,
                           bottom: 80,
                           justifyContent: 'center',
                           alignItems: 'center'
                         }}
                       >
                         <Text style={styles.textStyleSM}>
                           {tagReport.fishType.substring(0, 1).toUpperCase()}
                           {tagReport.fishType.substring(
                             1,
                             tagReport.fishType.length
                           )}
                         </Text>
                       </View>
                     </ImageBackground>
                      ) : <ImageBackground
                      source={permit}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 80,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={styles.textStyleSM}>
                          {tagReport.fishType.substring(0, 1).toUpperCase()}
                          {tagReport.fishType.substring(
                            1,
                            tagReport.fishType.length
                          )}
                        </Text>
                      </View>
                    </ImageBackground>}

                      
                    </Left>
                    <Body style={{ paddingLeft: 20 }}>
                      <Text note numberOfLines={1} style={styles.textStyle}>
                        Captain: {tagReport.guideName}
                      </Text>
                      <Text note numberOfLines={2} style={styles.textStyle}>
                        {moment(tagReport.tagDate).format('dddd, MMMM Do YYYY')}
                      </Text>
                      <Text note numberOfLines={2} style={styles.textStyle}>
                        {tagReport.tagArea}
                      </Text>
                      {/* <Text note numberOfLines={1} style={styles.textStyle}>
                       {tagReport.fishLength}
                      </Text> */}

                      {tagReport.comment ? (
                        <Text style={styles.textStyle}>
                          Comment: {tagReport.comment}
                        </Text>
                      ) : null}
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
    padding: 2,
    color: '#fff'
  },
  textStyleSM: {
    fontSize: 18,
    paddingTop: 2,
    color: '#fff',
    fontFamily: 'PermanentMarker-Regular'
  },
  speciesType: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PermanentMarker-Regular',
    color: '#fff'
  }
});
