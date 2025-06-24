import {Image, SafeAreaView, Text, View} from 'react-native';
import React from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import images from '../../assets/images';
import {Button, ButtonText, TitleHeader} from '../../component/shared';

const Login = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.pdh16, {flex: 1}]}>
      <TitleHeader title={'Login'} onBackPress={() => navigation.pop()} />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <View style={[{flex: 1, alignItems: 'center'}]}>
        <Image source={icons.login_icon} style={[{height: 300, width: 300 ,  marginTop : 100}]} />
        <Text
          style={[
            {textAlign: 'center', color: colors.black},
            styles.ts15,
            styles.mt20,
          ]}>
          Discover the amazing experiences waiting for you within the app
        </Text>
        <Button
          label={'Login'}
          onPress={() => navigation.replace('MobileNumber')}
          style={[styles.mt24, {width : 100 }]}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;
