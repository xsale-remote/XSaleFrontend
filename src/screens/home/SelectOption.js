import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import {useNavigation} from '@react-navigation/native';
import {CategoryCard} from '../../component/Home';
import styles from '../../assets/styles';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const SelectOption = ({route}) => {
  const title = route.params;
  const Navigation = useNavigation();
  return (
    <SafeAreaView style={[styles.pdh16, {flex: 1, borderWidth: 1}]}>
      <TitleHeader title={title} onBackPress={() => Navigation.pop()} />
      <CategoryCard title={title} option={'for Sale'} />
      <CategoryCard title={title} option={'for Rent'} />

      <View style={[{position: 'absolute', bottom: 0  }]}>
        <BannerAd
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
          unitId={'ca-app-pub-9372794286829313/2328826650'}
          onAdFailedToLoad={error => {
            console.log('Ad failed to load:', error);
          }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully');
          }}
        />
        <View style={[{marginTop : 10}]}>
          <BannerAd
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={'ca-app-pub-9372794286829313/1015744986'}
            onAdFailedToLoad={error => {
              console.log('Ad failed to load:', error);
            }}
            onAdLoaded={() => {
              console.log('Ad loaded successfully');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectOption;
