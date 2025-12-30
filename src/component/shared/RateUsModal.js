import React from 'react';
import {Modal, View, Text, TouchableOpacity, Linking} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import Button from './Button'; 

const RateUsModal = ({visible, onClose}) => {
  const playStoreUrl =
    'https://play.google.com/store/apps/details?id=com.Xsale&hl=en_IN';

  const onRateNowPress = () => {
    Linking.openURL(playStoreUrl);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={[
          styles.background,
          {
            backgroundColor: '#000000cc',
            justifyContent: 'center',
            alignItems: 'center',
          },
          styles.p24
        ]}>
        <View
          style={[
            {
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 26,
              maxWidth: 350,
              width: '100%',
              elevation: 8,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 12,
            },
          ]}>
          <Text
            style={[
              styles.ts20,
              styles.fw700,
              {
                color: colors.primary,
                marginBottom: 16,
                textAlign: 'center',
              },
            ]}>
            Love XSale?
          </Text>

          <Text
            style={[
              styles.ts16,
              {
                color: '#555',
                textAlign: 'center',
                marginBottom: 24,
              },
            ]}>
            Enjoying XSale? Please take a moment to rate us 5 stars on Google
            Play and help us grow!{' '}
          </Text>

          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Button
              label="Rate Us ⭐⭐⭐⭐⭐"
              style={{
                backgroundColor: colors.mintGreen,
                width: '100%',
                marginBottom: 12,
              }}
              textStyle={{color: colors.white}}
              onPress={onRateNowPress}
            />

            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text
                style={[
                  styles.ts16,
                  {
                    color: colors.primary,
                    textAlign: 'center',
                    fontWeight: '600',
                    textDecorationLine: 'underline',
                  },
                ]}>
                Remind Me Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RateUsModal;
