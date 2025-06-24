import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import Video from 'react-native-video';

const MediaBox = ({mediaUri, style, onClosePress}) => {
  const isImage =
    mediaUri.endsWith('.jpg') ||
    mediaUri.endsWith('.jpeg') ||
    mediaUri.endsWith('.png');

  return (
    <TouchableOpacity style={[styles.mediaBox, styles.touchableBox, style]}>
      {isImage ? (
        <Image
          source={{uri: mediaUri}}
          style={[styles.mediaBoxImage]}
          resizeMode="cover"
        />
      ) : (
        <Video
          source={{uri: mediaUri}}
          style={styles.mediaBoxVideo}
          resizeMode="cover"
          repeat
          muted
        />
      )}
      <TouchableOpacity
        style={styles.closeButtonContainer}
        onPress={onClosePress}>
        <Image source={icons.cross} style={[styles.closeButton]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaBox: {
    height: 130,
    width: '48%',
    borderRadius: 8,
    backgroundColor: colors.grey100,
  },
  mediaBoxImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
  },
  mediaBoxVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButton: {
    width: 20,
    height: 20,
  },
  touchableBox: {
    opacity: 1,
  },
});

export default MediaBox;
