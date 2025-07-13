import {View, Text, SafeAreaView, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import {Button, TitleHeader, ButtonWithIcon} from '../../component/shared';
import icons from '../../assets/icons';
import {getUserInfo} from '../../utils/function';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const ListingLocation = ({navigation, route}) => {
  const itemDetails = route.params;
  const [locationLoading, setLocationLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [itemLatitude, setItemLatitude] = useState(0);
  const [itemLongitude, setItemLongitude] = useState(0);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const userData = await getUserInfo();
      if (!userData) {
        console.log('No user data found.');
        return;
      }

      const user = userData?.user;
      if (!user) {
        console.log('User object not found in userData.');
        return;
      }

      const {
        _id: userId,
        location: {fullAddress: userAddress} = {},
        userName,
        profilePicture,
        phoneNumber,
      } = user;
      setItemLatitude(user.location.latitude);
      setItemLongitude(user.location.longitude);
      setUserId(userId || '');
      setFullAddress(userAddress || '');
      setUserName(userName || '');
      setProfilePicture(profilePicture || '');
      setPhoneNumber(phoneNumber || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const goToViewAd = () => {
    if (fullAddress && itemDetails && userId) {
      const itemDetailsUser = {
        ...itemDetails,
        fullAddress: fullAddress,
        userId: userId,
        userName: userName,
        profilePicture: profilePicture,
        phoneNumber: phoneNumber,
        itemLatitude,
        itemLongitude,
      };
      navigation.navigate('ViewAd', itemDetailsUser);
    } else {
      console.log('Some information is missing');
    }
  };

  const handleChooseLocation = () => {
    if (fullAddress && itemDetails && userId) {
      const itemDetailsUser = {
        ...itemDetails,
        userId: userId,
        userName: userName,
        profilePicture: profilePicture,
        phoneNumber: phoneNumber,
        purpose: 'creating new item',
      };
      navigation.navigate('ChooseLocation', itemDetailsUser);
    } else {
      console.log('Some information is missing');
    }
  };

  return (
    <SafeAreaView style={[{flex: 1}, styles.pdh16]}>
      <TitleHeader
        title={'Add New Listing'}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={icons.locationMap}
          style={[
            {width: 200, height: 180, resizeMode: 'contain'},
            styles.mb48,
          ]}
        />
        <Text style={[{color: '#A59C9C'}, styles.ts15, styles.mb4]}>
          Enjoy a personalized selling and buying experience by telling us your
          location
        </Text>
        <ButtonWithIcon
          style={styles.mt20}
          icon={icons.location}
          label={'use my location'}
          onPress={goToViewAd}
          isLoading={locationLoading}
        />
        <Text
          style={[{color: colors.black}, styles.ts16, styles.mt36]}
          onPress={handleChooseLocation}>
          Other Location
        </Text>
      </View>
      <View style={{width: '100%'}}>
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={'ca-app-pub-9372794286829313/8312337303'} // Replace with your ad unit ID
          onAdFailedToLoad={error => {
            console.log('Ad failed to load:', error);
          }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ListingLocation;