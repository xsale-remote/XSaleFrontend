import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {ButtonText} from '../shared';
import icons from '../../assets/icons';

const UploadModal = ({
  isVisible,
  close,
  openCamera,
  openGallery,
  openImagePicker,
  label,
  loading,
}) => {
  const UploadButton = ({label, icon, onPress}) => (
    <Pressable onPress={onPress} style={{alignItems: 'center'}}>
      <View
        style={[
          styles.p16,
          {backgroundColor: colors.primary, borderRadius: 8},
        ]}>
        <Image
          source={icon}
          style={[
            styles.icon40,
            {tintColor: colors.grey800, resizeMode: 'contain'},
          ]}
        />
      </View>
      <Text style={[styles.h6, styles.ts15, {color : colors.black}]}>{label}</Text>
    </Pressable>
  );

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={[{backgroundColor: 'rgba(0,0,0, 0.7)', flex: 1}]}>
        <View
          style={[
            styles.shadow,
            styles.pdh32,
            styles.pdv16,
            {
              position: 'absolute',
              top: '40%',
              backgroundColor: colors.white,
              alignSelf: 'center',
              borderRadius: 10,
              width: '80%',
            },
          ]}>
          <Text
            style={[
              styles.callout,
              {textAlign: 'center', color: colors.black},
              styles.ts17,
            ]}>
            {label ? label : 'Upload Prescription'}
          </Text>
          <View
            style={[
              styles.fdRow,
              styles.mt24,
              styles.mb8,
              {
                justifyContent:
                  typeof openImagePicker == 'function'
                    ? 'space-between'
                    : 'space-evenly',
                alignItems: 'center',
              },
            ]}>
            <UploadButton
              label={'Gallery'}
              icon={icons.gallery}
              onPress={openGallery}
            />
            <UploadButton
              label={'Camera'}
              icon={icons.camera}
              onPress={openCamera}
            />
            {typeof openImagePicker == 'function' ? (
              <UploadButton
                label={'Disk'}
                icon={icons.disk}
                onPress={openImagePicker}
              />
            ) : null}
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <ButtonText
              label={'Cancel'}
              onPress={close}
              textStyle={[styles.ts18]}
              color={colors.black}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UploadModal;
