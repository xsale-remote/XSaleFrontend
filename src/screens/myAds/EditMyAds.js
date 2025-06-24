import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {TitleHeader, TitleInput, Button} from '../../component/shared';

const EditMyAds = ({navigation, route}) => {
  const {itemData, categoryName, parentId, productType} = route.params;

  if (categoryName === 'Jobs') {
    const {jobLocation, salaryRange, jobDescription} = itemData;
    console.log(jobLocation, jobDescription, salaryRange);
  }

  return (
    <SafeAreaView style={[styles.pdh16, {flex: 1}]}>
      <TitleHeader
        title={'Edit Listing'}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView style={[styles.pdt8]}></ScrollView>
    </SafeAreaView>
  );
};

export default EditMyAds;
