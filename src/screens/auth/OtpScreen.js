import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {Button} from '../../component/shared';
import OTPTextView from '../../component/auth/Otp';

const OtpScreen = ({navigation, route}) => {
  const {confirmation, mobileNumber} = route.params;
  const [OTP, setOTP] = useState('');
  const [numberReceived, setNumberReceived] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNumberReceived(mobileNumber);
  }, []);

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const confirm = await confirmation.confirm(OTP);
      if (confirmation) {
        console.log('otp verified successfully ', confirm);
        setLoading(false);
        const idToken = await confirm.user.getIdToken();
        navigation.replace('Location', {mobileNumber: mobileNumber});
      } else {
        console.log('please enter correct OTP sent');
      }
    } catch (error) {
      setLoading(false);
      console.log('Error confirming OTP: ', error);
    }
  };

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <View style={[styles.mt48, styles.mb36]}>
        <Text
          style={[
            styles.mb8,
            {fontSize: 30, color: colors.black, textAlign: 'center'},
            styles.fwBold,
          ]}>
          Verification !
        </Text>
        <Text style={[{color: colors.black, fontWeight: '300'}]}>
          Please verify with your phone number by submitting the OTP sent on
          {' +91 ' + mobileNumber}
        </Text>
      </View>
      <View>
        <OTPTextView
          inputCount={6}
          offTintColor={colors.mintGreen}
          tintColor={colors.mintGreen}
          handleTextChange={text => setOTP(text)}
          textInputStyle={{height: 45, width: 45}}
        />
      </View>

      <View style={[styles.mt36]}>
        <Button
          label={
            loading ? (
              <ActivityIndicator size={'small'} color={colors.white} />
            ) : (
              'Continue'
            )
          }
          style={styles.mb24}
          onPress={verifyOTP}
        />
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;
