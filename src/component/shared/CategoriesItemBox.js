import {View, Text, Pressable, Image, Touchable, TouchableOpacity} from 'react-native';
import React from 'react';
import images from '../../assets/images';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const CategoriesItemBox = ({
  style,
  itemName,
  image,
  all,
  onCardPress,
  imageStyle,
  isActive,
}) => {
  return (
    <Pressable
      onPress={onCardPress}
      style={[
        {
          height: 100,
          width: 100,
          borderRadius: 12,
          padding: 6,
          backgroundColor: colors.metallicSeaweed,
          justifyContent: all ? 'center' : null,
          alignItems: all ? 'center' : null,
          borderWidth: isActive ? 3 : 0,
          borderColor: colors.black,
        },
        styles.pdv8,
        style,
      ]}>
      {!all && (
        <Image
          source={image ? image : images.profilePic}
          style={[
            {height: '70%', width: '100%', resizeMode: 'contain'},
            imageStyle,
          ]}
        />
      )}
      <Text
        style={[
          styles.ts12,
          all && styles.ts15,
          {marginTop: 2, textAlign: 'center', color: colors.white},
        ]}>
        {itemName ? itemName : 'Name'}
      </Text>
    </Pressable>
  );
};

export default CategoriesItemBox;
