import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import icons from '../../assets/icons';

const ListingCard = ({
  image,
  price,
  title,
  location,
  date,
  onPress,
  onFavoritePress,
  isLiked,
  featured = false,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={[
        {
          borderBottomWidth: 1,
          backgroundColor: colors.white,
          borderBottomColor: colors.platinum,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.fdRow, styles.p12]}>
        <View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: colors.silver,
              position: 'relative',
            },
          ]}>
          
          {imageError ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.silver,
              }}>
              <Text style={{color: colors.textSecondary, fontSize: 12}}>
                No Image
              </Text>
            </View>
          ) : (
            <FastImage
              source={{
                uri: image,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode={FastImage.resizeMode.cover}
              onError={() => {
                setImageError(true);
              }}
            />
          )}
        </View>
        
        <View style={[styles.ml12, {flex: 1, justifyContent: 'space-between'}]}>
          <View
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', alignItems: 'flex-start'},
            ]}>
            <Text style={[styles.ts18, styles.fwBold, {color: colors.black}]}>
              ₹ {price.toLocaleString('en-IN')}
            </Text>
            <TouchableOpacity
              onPress={onFavoritePress}
              style={[{marginTop: -4}]}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <FastImage
                source={isLiked ? icons.red_heart : icons.heart}
                style={[
                  styles.icon32,
                  {
                    alignSelf: 'center',
                    tintColor: isLiked ? undefined : colors.black,
                    marginTop: isLiked ? 0 : 2,
                  },
                ]}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.ts14, {color: colors.black}, styles.mt4]}
            numberOfLines={1}>
            {title}
          </Text>

          <View
            style={[
              styles.fdRow,
              {justifyContent: 'space-between', alignItems: 'center'},
              styles.mt4,
            ]}>
            <View
              style={[
                styles.fdRow,
                {alignItems: 'center', flex: 1},
                styles.mr8,
              ]}>
              <Text style={[styles.ts10, styles.mr4]}>📍</Text>
              <Text
                style={[
                  styles.ts11,
                  {color: '#7f8a8e', textTransform: 'uppercase'},
                ]}
                numberOfLines={1}>
                {location}
              </Text>
            </View>
            <Text style={[styles.ts11, {color: '#7f8a8e'}]}>{date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListingCard;