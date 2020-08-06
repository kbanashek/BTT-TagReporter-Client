import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import PhotoComments from "./PhotoComments";
import moment from "moment";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { Button } from "react-native-elements";
import ZoomableImage from "./ZoomableImage";

function downloadFile(uri) {
  let filename = uri.split("/");
  filename = filename[filename.length - 1];
  let fileUri = FileSystem.documentDirectory + filename;
  FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
      saveFile(uri);
    })
    .catch(error => {
      Alert.alert("Error", "Couldn't download photo");
      console.error(error);
    });
}

async function saveFile(fileUri) {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);
    Alert.alert("Success", "Image was successfully downloaded!");
  }
}

const PhotoRecord = ({ data }) => {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <ZoomableImage
        show={show}
        setShow={setShow}
        imageSource={data.links.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.usernameLabel}>@{data.username}</Text>
        <Text style={styles.addedAtLabel}>
          {moment(new Date(data.addedAt)).format("YYYY/MM/DD HH:mm")}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.imageContainer}
        onLongPress={() => setShow(true)}
      >
        <Image source={{ uri: data.links.thumb }} style={styles.image} />
      </TouchableOpacity>
      <PhotoComments comments={data.photoComments} />
      <View style={styles.btnContainer}>
        <Button
          buttonStyle={{
            backgroundColor: "white",
            borderWidth: 1
          }}
          titleStyle={{ color: "dodgerblue" }}
          containerStyle={{ backgroundColor: "yellow" }}
          title="Add Comment"
        />
        <Button
          onPress={() => downloadFile(data.links.image)}
          style={styles.btn}
          title="Download"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderColor: "gainsboro",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },
  usernameLabel: {
    fontSize: 18,
    fontWeight: "bold"
  },
  addedAtLabel: {
    paddingTop: 10,
    color: "#404040"
  },
  imageContainer: {
    width: "100%",
    height: 380
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 100,
    justifyContent: "space-between"
  }
});

export default PhotoRecord;