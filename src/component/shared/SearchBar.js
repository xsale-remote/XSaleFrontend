import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, TextInput } from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import icons from '../../assets/icons';

const SearchBar = ({ onSearch, navigation, value }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  
  const placeholders = [
    'Search Car',
    'Search Ambulance',
    'Search Truck',
    'Search Tractor',
    'Search JCB',
    'Search Residential Property',
    'Search Commercial Property',
    'Search Land',
    'Search PG/Hostel',
    'Search Mobile',
    'Search Tablet',
    'Search Mobile Accessories',
    'Search Bike',
    'Search Scooty',
    'Search Bicycle',
    'Search Spare Parts',
    'Search AC',
    'Search TV',
    'Search Fridge',
    'Search Washing Machine',
    'Search Coolers',
    'Search Kitchen Appliances',
    'Search Laptop',
    'Search Camera',
    'Find Electronics',
    'Find Vehicles',
    'Find Property for Rent',
    'Find Bikes near you',
  ];

  useEffect(() => {
    let currentIndex = 0;
    let interval;

    const fastRotation = setInterval(() => {
      setCurrentPlaceholder(placeholders[currentIndex]);
      currentIndex++;
      
      if (currentIndex >= 5) {
        clearInterval(fastRotation);
        currentIndex = 0;
        interval = setInterval(() => {
          setCurrentPlaceholder(placeholders[currentIndex]);
          currentIndex = (currentIndex + 1) % placeholders.length;
        }, 5000);
      }
    }, 2500);

    return () => {
      clearInterval(fastRotation);
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setSearchQuery(value);
    }
  }, [value]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={[{width: "100%"}, styles.mv12]}>
      <View style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.silver,
          borderRadius: 8,
          paddingHorizontal: 12,
          height: 48,
          borderWidth: 2,
          borderColor: colors.grey200,
          width: '100%',
        },
        isFocused && {
          borderColor: colors.mintGreen,
          backgroundColor: colors.white,
          shadowColor: colors.mintGreen,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }
      ]}>
        <Image 
          source={icons.magnifyingGlass} 
          style={[
            {
              width: 24,
              height: 24,
              resizeMode: 'contain',
              tintColor: colors.grey,
              marginRight: 10,
            },
            isFocused && {
              tintColor: colors.primary,
            }
          ]}
        />

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={currentPlaceholder}
          placeholderTextColor={colors.grey || '#999999'}
          style={[
            {flex: 1, color: colors.black, height: "100%"},
            styles.fw400, 
            styles.ts15
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear}
            style={[
              {
                padding: 6,
                borderRadius: 12,
                backgroundColor: colors.grey100
              }, 
              styles.ml8, 
            ]}
            activeOpacity={0.6}
          >
            <Image 
              source={icons.cross} 
              style={{
                width: 14,
                height: 14,
                resizeMode: "contain",
                tintColor: colors.grey500
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;