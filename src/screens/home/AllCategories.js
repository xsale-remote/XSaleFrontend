import {SafeAreaView, View, Text} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import {CategoriesList} from '../../component/Home';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const AllCategories = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.pdh16, {flex : 1}]}>
      <TitleHeader title={'Categories'} onBackPress={() => navigation.pop()} />
      <SafeAreaView style={[{height: '90%', width: '100%'}]}>
        <View
          style={[
            {
              borderBottomWidth: 1,
              opacity: 0.3,
              width: '200%',
              alignSelf: 'center',
            },
            styles.mb4,
          ]}></View>
        <CategoriesList />
        <View
          style={{
            position: 'absolute',
            bottom: -10,
            width: '100%',
            alignSelf: 'center',
          }}>
          <BannerAd
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={'ca-app-pub-9372794286829313/8100668711'}
            onAdFailedToLoad={error => {
              console.log('Ad failed to load:', error);
            }}
            onAdLoaded={() => {
              console.log('Ad loaded successfully');
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default AllCategories;
