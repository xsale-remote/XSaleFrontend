import {View, Text, Modal, Image} from 'react-native';
import React from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import {Button} from '../shared';
import {useNavigation} from '@react-navigation/native';

const ProductUploadModal = ({onClose}) => {
  const navigation = useNavigation();
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={true}
      onRequestClose={() => {
        console.log('close');
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
        <View
          style={[
            {
              width: '80%',
              backgroundColor: colors.white,
              borderRadius: 10,
              alignItems: 'center',
              height: 350,
            },
          ]}>
          <View
            style={[
              {
                height: '50%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: colors.mintGreen,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Image
              source={icons.circle_tick}
              style={[styles.iconLarge, {tintColor: colors.white}]}
            />
          </View>
          <View style={[{height: '50%', width: '100%', alignItems: 'center'}]}>
            <Text style={[styles.ts24, styles.mt12, {color: colors.black}]}>
              Congratulation!
            </Text>
            <Text style={[{color: colors.black}, styles.mt12, styles.ts14]}>
              Your advertisement has been
            </Text>
            <Text style={[{color: colors.black}, styles.ts14]}>
              successfully posted
            </Text>
            <Button
              label={'Okay'}
              style={[styles.mt20]}
              // onPress={() => navigation.replace('Home')}
                onPress={onClose}
              
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductUploadModal;
