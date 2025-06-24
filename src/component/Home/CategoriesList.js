import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import icons from '../../assets/icons';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {useNavigation} from '@react-navigation/native';

const CategoriesList = () => {
  const Navigation = useNavigation();
  const categoryListData = [
    {id: 1, name: 'Vehicle', icon: icons.vehicle},
    {id: 2, name: 'Property', icon: icons.real_estate},
    {id: 3, name: 'Mobile', icon: icons.smartphone},
    {id: 4, name: 'Bike', icon: icons.bike},
    {id: 5, name: 'Electronics', icon: icons.electronics},
    {id: 6, name: 'Jobs', icon: icons.suitcase},
    {id: 7, name: 'Matrimonial', icon: icons.wedding},
    {id: 8, name: 'Furniture', icon: icons.furniture},
    {id: 9, name: 'Animal', icon: icons.cow},
    {id: 10, name: 'Poultry & Birds', icon: icons.hen},
    {id: 11, name: 'Farm Machines', icon: icons.farmer},
    {id: 12, name: 'Services', icon: icons.services},
    {id: 13, name: 'Fashion', icon: icons.fashion},
  ];

  return categoryListData.map((item, index) => {
    return (
      <Pressable
        onPress={() => {
          if (item.name === 'Vehicle' || item.name === 'Property') {
            Navigation.navigate('SelectOption', item.name);
          } else {
            Navigation.navigate('ProductsListing', item.name);
          }
        }}
        key={item.id}
        style={[
          {
            width: '100%',
            height: '7%',
            justifyContent: 'space-between',
            borderBottomWidth: 0.4,
          },
          styles.fdRow,
        ]}>
        <View
          style={[
            styles.fdRow,
            styles.pdl8,
            {
              width: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Image source={item.icon} style={[styles.icon28, styles.mr16]} />
          <Text style={[styles.ts16, {color: colors.black}]}>{item.name}</Text>
        </View>
        <Pressable style={{alignSelf: 'center'}}>
          <Image source={icons.arrow_next} style={[styles.icon28]} />
        </Pressable>
      </Pressable>
    );
  });
};
export default CategoriesList;
