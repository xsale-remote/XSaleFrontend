import {View, Text, Image, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {getUserInfo} from '../../utils/function';

const BottomNavigation = () => {
  // const Tab = createBottomTabNavigator();
  const Navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [isLoggedIn , setIsloggedIn] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const userData = await getUserInfo();
    if (userData) {
      setUserData(userData);
      setIsloggedIn(true)
    } else {
      setIsloggedIn(false);
    }
  };

  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: 5,
          left: 0,
          right: 0,
          backgroundColor: colors.darkGrey,
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          borderRadius: 20,
          alignSelf: 'center',
        },
        styles.ml16,
        styles.fdRow,
      ]}>
      <TouchableOpacity onPress={() => Navigation.navigate('Home')}>
        <Image source={icons.home} style={[styles.icon24]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Navigation.navigate('Chats')}>
        <Image source={icons.chats} style={[styles.icon24]} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) {
            Navigation.navigate('AddNewListing')
          } else {
            Navigation.navigate('Login');
          }
        }}
        style={[
          {
            height: 45,
            bottom: 10,
            position: 'relative',
            right: 0,
            width: 45,
            borderRadius: 50,
            borderColor: colors.darkGrey,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: colors.darkGrey,
            elevation: 10,
            shadowColor: colors.black,
            shadowOffset: {width: 4, height: 10},
            shadowOpacity: 1,
            shadowRadius: 100,
          },
        ]}>
        <Image source={icons.plus_white} style={[styles.icon28]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Navigation.navigate('MyAds')}>
        <Image source={icons.ads} style={[styles.icon24]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Navigation.navigate('Profile')}>
        <Image source={icons.person} style={[styles.icon24]} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
