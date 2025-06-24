import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import colors from '../../assets/colors';

const Categories = () => {
  const navigation = useNavigation();

  const categoryListData = [
    {
      id: 1,
      name: 'Vehicle',
      icon: icons.vehicle,
      onPress: () => navigation.navigate('SelectOption', 'Vehicle'),
    },
    {
      id: 2,
      name: 'Property',
      icon: icons.real_estate,
      onPress: () => navigation.navigate('SelectOption', 'Property'),
    },
    {
      id: 3,
      name: 'Mobile',
      icon: icons.smartphone,
      onPress: () => navigation.navigate('ProductsListing', 'Mobile'),
    },
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

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categoryListData.map((item, index) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.mr4,
              {
                width: 'auto',
                height: '50%',
                marginTop: 3,
                alignItems: 'center',
              },
              styles.mr16,
              styles.mt4,
            ]}
            onPress={() => {
              item.name === 'Vehicle' || item.name === 'Property'
                ? navigation.navigate('SelectOption', item.name)
                : navigation.navigate('ProductsListing', item.name);
            }}>
            <Image source={item.icon} style={styles.icon28} />
            <Text style={[styles.mt4, styles.ts13, {color: colors.black}]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
export default Categories;
