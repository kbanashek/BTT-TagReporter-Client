import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  Image
} from 'react-native';

import { DataStore } from '@aws-amplify/datastore';
import { TagReports } from '../../models';

import { Container, Content, List, ListItem, Left, Body } from 'native-base';
import moment from 'moment';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/constants';

const bonefish = require('../../../assets/bonefish.png');
const permit = require('../../../assets/permit.png');


export default class TagLogScreen extends React.Component {
  state = { tagReports: [] };

  

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      'PermanentMarker-Regular': require('../../../assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf')
    });

    await this.loadTagReports();

    DataStore.observe(TagReports).subscribe(msg => {
      //console.log('SUBSCRIPTION_UPDATE', msg);
      this.loadTagReports();
    });
  }

  async loadTagReports() {
    try {
      const tagReports = await DataStore.query(TagReports);
      //console.log('tagsssss',tagReports);

      const sortByTagDate = (a, b) => {
        const dateA = new Date(a.tagDate).getTime();
        const dateB = new Date(b.tagDate).getTime();
        return dateA < dateB ? 1 : -1;
      };

      tagReports.sort(sortByTagDate);

      this.setState({
        tagReports: tagReports
      });
    } catch (err) {
      console.log('error fetching tagReports...', err);
    }
  }

  componentWillUnmount() {
    // this.focusListener.remove();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
       
        <View style={styles.listContainer}>
          <Container>
            <Content>
              <List style={styles.listContainer}>
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
                      ) : (
                        <ImageBackground
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
                        </ImageBackground>
                      )}
                    </Left>
                    <Body style={{ paddingLeft: 20 }}>
                      <Text note numberOfLines={1} style={styles.textStyle}>
                        Captain: {tagReport.guideName}
                      </Text>
                      <Text note numberOfLines={2} style={styles.textStyle}>
                        {moment(tagReport.tagDate).format(' MMMM Do YYYY')}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Ionicons name="ios-pin" style={styles.iconStyle} />
                        <Text note numberOfLines={2} style={styles.textStyle}>
                          {tagReport.tagArea}
                        </Text>
                      </View>

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
    flexDirection: 'column',

  },
  listContainer: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  textStyle: {
    fontSize: 14,
    padding: 2,
    color: '#fff',
    fontWeight: 'bold'
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
  },
  iconStyle: {
    color: '#fff',
    fontSize: 15,
    marginTop: 5,
    paddingRight: 3
  }
});
