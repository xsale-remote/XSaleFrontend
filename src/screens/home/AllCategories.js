import {SafeAreaView, View, Text} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import {CategoriesList} from '../../component/Home';

const AllCategories = ({navigation}) => {
  return (
    <SafeAreaView style={[styles.pdh16]}>
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
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default AllCategories;
