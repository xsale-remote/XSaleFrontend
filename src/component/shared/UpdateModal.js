import React from 'react';
import {Modal, View, Text, Button, Platform, Linking} from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';

const UpdateModal = ({visible, onUpdate}) => {
  const storeUrl = 'https://play.google.com/store/apps/details?id=com.Xsale';

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={() => {}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={[
            {
              width: 300,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: colors.white,
            },
            styles.p20,
          ]}>
          <Text
            style={[
              styles.ts20,
              {
                color: colors.black,
                fontWeight: '700',
                marginBottom: 10,
              },
            ]}>
            Update Required
          </Text>
          <Text style={[styles.ts16, styles.mb20, {textAlign: 'center', color: colors.black}]}>
            A new version of the app is available. Please update to continue.
          </Text>
          <Button
            title="Update Now"
            onPress={() => {
              Linking.openURL(storeUrl);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
