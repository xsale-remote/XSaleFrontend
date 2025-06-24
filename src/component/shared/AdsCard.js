import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import images from '../../assets/images';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import colors from '../../assets/colors';
import {formatPriceIndian} from '../../utils/function';
import FastImage from 'react-native-fast-image';

const {height, width} = Dimensions.get('window');

const AdsCard = ({
  forFavourite,
  onDislike,
  data,
  onPress,
  onLikePress,
  isLikeLoading,
  isLiked,
  firstImageUri,
  distance,
}) => {
  const adInfo = data[0] || data;

  const originalTimeStamp = adInfo.updatedAt;
  const date = new Date(originalTimeStamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  });
  let location = adInfo?.location.replace(/India/i, '').trim();
  location = location.length > 20 ? location.slice(0, 20) + '...' : location;

  const displayName =
    adInfo.displayName.length > 34
      ? adInfo.displayName.slice(0, 34) + '...'
      : adInfo.displayName;

  const cardStyle = [
    styles.mb16,
    styles.mr8,
    {
      height: 310,
      width: '49%',
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor: 'white',
      // Add shadow properties
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 5,
    },
  ];

  return (
    <>
      {!forFavourite && (
        <Pressable onPress={onPress} style={cardStyle}>
          <View style={[{height: '50%'}, styles.pdh8]}>
            {/* <FastImage
              source={{
                uri: firstImageUri,
                cache: FastImage.cacheControl.web,
                priority: FastImage.priority.normal,
              }}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
            /> */}
            <Image
              source={{uri: firstImageUri}}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
            />
          </View>

          <View style={[styles.p4, {height: '50%'}]}>
            <Text
              style={[
                {
                  marginLeft: 2,
                  color: colors.black,
                  height: 50,
                },
                styles.fw400,
                styles.pdv4,
                styles.ts15,
              ]}>
              {displayName}
            </Text>
            <View
              style={[
                styles.fdRow,
                styles.mt4,
                styles.mb4,
                {justifyContent: 'space-between', height: 27},
              ]}>
              <View style={[styles.fdRow]}>
                <Image
                  source={icons.rupee}
                  style={[
                    {height: 19, width: 19, resizeMode: 'contain'},
                    styles.mt4,
                    styles.mr4,
                  ]}
                />
                <Text style={[styles.ts19, {color: colors.black}]}>
                  {adInfo?.askingPrice || adInfo?.salaryRange
                    ? formatPriceIndian(
                        adInfo.askingPrice || adInfo.salaryRange,
                      )
                    : '---'}
                </Text>
              </View>
              {isLikeLoading ? (
                <ActivityIndicator size={'small'} color={colors.black} />
              ) : (
                <TouchableOpacity
                  onPress={onLikePress}
                  style={[
                    {
                      height: 30,
                      width: 30,
                      backgroundColor: 'transparent',
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0.7,
                      borderWidth: isLiked ? null : 1,
                    },
                  ]}>
                  {isLiked ? (
                    <Image
                      source={icons.red_heart}
                      style={[styles.icon32, {alignSelf: 'center'}]}
                    />
                  ) : (
                    <Image
                      source={icons.heart}
                      style={[
                        styles.icon24,
                        {
                          alignSelf: 'center',
                          tintColor: colors.black,
                          marginTop: 2,
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={[styles.fdRow, styles.pdr4]}>
              <Image
                source={icons.location}
                style={[styles.icon16, styles.mr4, styles.mt4]}
              />
              <Text
                style={[
                  {
                    color: colors.black,
                    height: 20,
                    width: '95%',
                  },
                  styles.mb4,
                  styles.mt4,
                  styles.ts14,
                ]}>
                {location}
              </Text>
            </View>
            <View
              style={[
                styles.fdRow,
                styles.pdh4,
                {justifyContent: 'space-between'},
                styles.mt4,
              ]}>
              <Text style={[{color: colors.black, marginTop: 2}, styles.ts14]}>
                {distance !== null ? `${distance} KM` : '-- km'}
              </Text>
              <Text style={[{color: colors.black}, styles.ts14, styles.fw400]}>
                {formattedDate}
              </Text>
            </View>
          </View>
        </Pressable>
      )}

      {forFavourite && (
        <Pressable onPress={onPress} style={cardStyle}>
          <View style={[{height: '52%'}, styles.pdh8]}>
            {/* <FastImage
              source={{
                uri: firstImageUri,
                cache: FastImage.cacheControl.web,
                priority: FastImage.priority.normal,
              }}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
            /> */}

            <Image
              source={{uri: firstImageUri}}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
            />
          </View>

          <View style={[styles.p4, {height: '50%'}]}>
            <Text
              style={[
                {
                  marginLeft: 2,
                  color: colors.black,
                  height: 50,
                },
                styles.fw400,
                styles.pdv4,
                styles.ts15,
              ]}>
              {displayName}
            </Text>
            <View
              style={[
                styles.fdRow,
                styles.mt4,
                styles.mb4,
                {justifyContent: 'space-between', height: 27},
              ]}>
              <View style={[styles.fdRow]}>
                <Image
                  source={icons.rupee}
                  style={[
                    {
                      height: 17,
                      width: 17,
                      resizeMode: 'contain',
                    },
                    styles.mt4,
                    styles.mr4,
                  ]}
                />
                <Text style={[styles.ts19, {color: colors.black}]}>
                  {adInfo?.askingPrice || adInfo?.salaryRange || '---'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onDislike}
                style={[
                  {
                    height: 30,
                    width: 30,
                    backgroundColor: 'transparent',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.7,
                  },
                ]}>
                {isLiked ? (
                  <Image
                    source={icons.red_heart}
                    style={[styles.icon32, {alignSelf: 'center'}]}
                  />
                ) : (
                  <Image
                    source={icons.heart}
                    style={[
                      styles.icon24,
                      {
                        alignSelf: 'center',
                        tintColor: colors.black,
                        marginTop: 2,
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={[styles.fdRow, styles.pdr4]}>
              <Image
                source={icons.location}
                style={[styles.icon16, styles.mr4, styles.mt4]}
              />
              <Text
                style={[
                  {
                    color: colors.black,
                    height: 20,
                    width: '95%',
                  },
                  styles.mb4,
                  styles.mt4,
                  styles.ts14,
                ]}>
                {location}
              </Text>
            </View>
            <View
              style={[
                styles.fdRow,
                styles.pdh4,
                {justifyContent: 'space-between'},
                styles.mt8,
              ]}>
              <Text style={[{color: colors.black}]}>
                {distance !== null ? `${distance} KM` : '-- km'}
              </Text>
              <Text style={[{color: colors.black}, styles.ts14]}>
                {formattedDate}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </>
  );
};

export default AdsCard;
