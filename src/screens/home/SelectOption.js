import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import {useNavigation} from '@react-navigation/native';
import {CategoryCard} from '../../component/Home';
import styles from '../../assets/styles';

const SelectOption = ({route}) => {
  const title = route.params;
  const Navigation = useNavigation();
  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader title={title} onBackPress={() => Navigation.pop()} />
      <CategoryCard title={title} option={'for Sale'} />
      <CategoryCard title={title} option={'for Rent'} />
    </SafeAreaView>
  );
};

export default SelectOption;
