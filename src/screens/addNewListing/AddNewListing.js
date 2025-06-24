import {View, Text, SafeAreaView, ScrollView, FlatList} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import {CategoriesBox} from '../../component/addNewListing';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import images from '../../assets/images';

const AddNewListing = ({navigation}) => {
  const listingCategory = [
    {id: 1, name: 'Vehicle', image: images.car_group},
    {id: 2, name: 'Vehicle for rent', image: images.car_rent_group},
    {
      id: 3,
      name: 'Property',
      image: images.propertySale,
    },
    {
      id: 4,
      name: 'Property for rent',
      image: images.propertyRent,
    },
    {id: 5, name: 'Mobile', image: images.mobiles_headphones},
    {id: 6, name: 'Bike', image: images.twoWheeler_group},
    {
      id: 7,
      name: 'Electronics',
      image: images.electronics_group,
    },
    {
      id: 8,
      name: 'Jobs',
      image: images.jobs_group,
    },
    {
      id: 9,
      name: 'Matrimonial',
      image: images.matrimonial,
    },
    {
      id: 10,
      name: 'Furniture',
      image: images.furniture_groups,
    },
    {
      id: 11,
      name: 'Animal',
      image: images.animals_group,
    },
    {
      id: 12,
      name: 'Poultry & Birds',
      image: images.poultry_birds,
    },
    {
      id: 13,
      name: 'Farm Machines',
      image: images.farmMachine_group,
    },
    {
      id: 14,
      name: 'Services',
      image: images.services_group,
    },
    {
      id: 15,
      name: 'Fashion',
      image: images.fashion_group,
    },
  ];

  return (
    <SafeAreaView style={[{height: '100%'}]}>
      <View style={[styles.pdh16]}>
        <TitleHeader
          title={'Add New Listing'}
          onBackPress={() => navigation.pop()}
        />
      </View>
      <View
        style={[
          {
            height: '100%',
            backgroundColor: colors.lightGrey,
            flex: 1,
          },
          styles.pdt12,
        ]}>
        <View
          style={[styles.pdh16, {height: 50, justifyContent: 'space-between'}]}>
          <Text style={[{color: colors.black}, styles.ts15]}>
            In Which category do you want to sell ?
          </Text>
          <Text style={[{color: colors.black}, styles.ts15]}>
            Select any one
          </Text>
        </View>
        <View style={[{width: '100%', flex: 1}, styles.pdh16, styles.pdt12]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listingCategory}
            style={[{flex: 1, width: '100%'}]}
            renderItem={({item, index}) => {
              return (
                <CategoriesBox
                  style={[styles.mr12, styles.mb12]}
                  title={item.name}
                  image={item.image}
                  onPress={() => {
                    if (item.id === 8) {
                      navigation.navigate('Selection');
                    } else {
                      navigation.navigate('SubCategory', {title: item.name});
                    }
                  }}
                />
              );
            }}
            keyExtractor={listingCategory => listingCategory.id}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddNewListing;
