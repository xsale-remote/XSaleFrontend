import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import icons from '../../assets/icons';
import colors from '../../assets/colors';
import styles from '../../assets/styles';

const UploadCameraView = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.p32,
        {
          backgroundColor: colors.grey250,
          alignItems: 'center',
        },
      ]}>
      <Image
        source={icons.image_upload}
        style={[styles.icon48, {tintColor: colors.black}]}
      />
    </TouchableOpacity>
  );
};

export default UploadCameraView;
