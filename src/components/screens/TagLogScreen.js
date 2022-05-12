import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ImageBackground
} from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { TagReports } from '../../models';
import { Container, Content, List, ListItem, Left, Body } from 'native-base';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

const bonefishImg = require('../../../assets/bonefish.png');
const permitImg = require('../../../assets/permit.png');

const TagLogScreen = props => {
  const [tagReports, setTagReports] = useState([]);
  const navFocusListener = useRef();

  const loadTagReports = async () => {
    console.log('fetching tagReports...');
    const tagReportResults = await DataStore.query(TagReports);
    const sortByTagDate = (a, b) => {
      const dateA = new Date(a.tagDate).getTime();
      const dateB = new Date(b.tagDate).getTime();
      return dateA < dateB ? 1 : -1;
    };

    tagReportResults.sort(sortByTagDate);
    setTagReports([...tagReportResults]);
  };

  useEffect(() => {
    loadTagReports();

    const subscription = DataStore.observe(TagReports).subscribe(x => {
      loadTagReports();

      //dedupeTagReports(tagReports, id, x, setTagReports);
    });

    return () => subscription.unsubscribe();
  }, []);

  function dedupeTagReports(tagReports, x, setTagReports) {
    const id = x.element.id;
    const updateTagReports = [...tagReports];
    if (!updateTagReports.some(x => x.id === id)) {
      console.log('not found..');

      updateTagReports.push(x.element);
      setTagReports([updateTagReports]);
    }
  }
  const BonefishTile = ({ tagReport }) => (
    <ImageBackground
      source={bonefishImg}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <View style={styles.tagDetailRow}>
        <Text style={styles.textStyleSM}>
          {tagReport.fishType.substring(0, 1).toUpperCase()}
          {tagReport.fishType.substring(1, tagReport.fishType.length)}
        </Text>
      </View>
    </ImageBackground>
  );

  const PermitTile = ({ tagReport }) => (
    <>
      <ImageBackground
        source={permitImg}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <View style={styles.tagDetailRow}>
          {tagReport.fishType ? (
            <Text style={styles.textStyleSM}>
              {tagReport.fishType.substring(0, 1).toUpperCase()}
              {tagReport.fishType.substring(1, tagReport.fishType.length)}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </>
  );

  const CatchTile = ({ tagReport }) => {
    return (
      <Left
        style={{
          flex: 0.5,
          backgroundColor: '#ccc',
          height: 100
        }}
      >
        {tagReport.fishType && tagReport.fishType === 'bonefish' ? (
          <BonefishTile tagReport={tagReport} />
        ) : (
          <PermitTile tagReport={tagReport} />
        )}
      </Left>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {tagReports.length !== 0 ? (
        <View style={styles.listContainer}>
          <Container>
            <Content>
              <List style={styles.list}>
                {tagReports.map((tagReport, index) => (
                  <ListItem key={index}>
                    <CatchTile tagReport={tagReport} />
                    <Body
                      style={{
                        paddingLeft: 20
                      }}
                    >
                      <Text note numberOfLines={1} style={styles.textStyle}>
                        Captain: {tagReport.guideName}
                      </Text>
                      <Text note numberOfLines={2} style={styles.textStyle}>
                        {moment(tagReport.tagDate).format(' MMMM Do YYYY')}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row'
                        }}
                      >
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
      ) : (
        <View style={styles.listContainer}>
          <Text
            style={{
              textAlign: 'center'
            }}
          >
            No tag reports currently available
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TagLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    flexDirection: 'column'
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#0B7EA0',
    justifyContent: 'center',
    height: 8000
  },
  list: {
    backgroundColor: '#0B7EA0'
  },
  textStyle: {
    fontSize: 14,
    padding: 2,
    color: '#fff',
    fontWeight: 'bold'
  },
  tagDetailRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyleSM: {
    fontSize: 18,
    paddingTop: 2,
    color: '#fff'
  },
  speciesType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  iconStyle: {
    color: '#fff',
    fontSize: 15,
    marginTop: 5,
    paddingRight: 3
  }
});
