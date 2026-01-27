import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  Linking,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import { get, post } from '../../utils/requestBuilder';
import icons from '../../assets/icons';
import { Button } from '../../component/shared';
import Video from 'react-native-video';
import { SellerProfile } from '../../component/viewAd.js';
import { getUserInfo } from '../../utils/function.js';
import {
  BannerAd,
  TestIds,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { formatPriceIndian } from '../../utils/function.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const ViewAdInfo = ({ navigation, route }) => {
  const { adId, likeFunction, parentId, userId, isLiked, useChildren, forHome } =
    route.params;
  const [loading, setLoading] = useState('');
  const [userData, setUserData] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [mediaArray, setMediaArray] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [itemDisplayPicture, setItemDisplayPicture] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [itemPosted, setItemPosted] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [itemLocation, setItemLocation] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState({});
  const [heartColor, setHeartColor] = useState('');
  const [fullDisclaimer, setFullDisclaimer] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [itemUserFCMToken, setItemUserFCMToken] = useState('');

  useEffect(() => {
    getItemDetails();
    getUser();
    setHeartColor(isLiked ? icons.red_heart : icons.heart);
  }, []);

  const adUnitId = 'ca-app-pub-9372794286829313/2080406453';
  // one on three
  useEffect(() => {
    const updateAdCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem('ad_view_count');
        let count = savedCount ? parseInt(savedCount, 10) : 0;
        if (count >= 3) {
          count = 0;
        }

        count += 1;

        await AsyncStorage.setItem('ad_view_count', count.toString());

        if (count === 1) {
          const interstitial = InterstitialAd.createForAdRequest(adUnitId);

          interstitial.load();

          const unsubscribeLoad = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
              interstitial.show();
            },
          );

          const unsubscribeClose = interstitial.addAdEventListener(
            AdEventType.CLOSED,
            () => {
              unsubscribeLoad();
              unsubscribeClose();
              unsubscribeError();
            },
          );

          const unsubscribeError = interstitial.addAdEventListener(
            AdEventType.ERROR,
            () => {
              unsubscribeLoad();
              unsubscribeClose();
              unsubscribeError();
            },
          );
        }
      } catch (err) {
        console.error('Error handling ad count', err);
      }
    };

    updateAdCount();
  }, []);

  const getUser = async () => {
    try {
      const userData = await getUserInfo();
      if (!userData) {
        setIsLoggedIn(false);
      } else {
        setUserData(userData);
      }
    } catch (error) {
      console.log(`error while fetching user details in view ad info ${error}`);
    }
  };

  const formatDate = isoDate => {
    const date = new Date(isoDate);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const disclaimerText = [
    "• If someone says they'll send you the product by courier.",
    '• If someone says they need courier charges to be sent.',
    '• If someone says Cash on Delivery is available (not recommended for most cases).',
    "• If someone says they're working in the Army or any government offices and asks you for an advance payment for courier charges.",
    "• If the price of the product is very low (compared to similar products) - it's too good to be true!",
    '• If someone asks you to scan a QR code to receive the amount.',
    '• If someone asks for an advance payment before you meet.',
  ];

  const getItemDetails = async () => {
    const usedKeys = [
      'askingPrice',
      'mediaArray',
      'userName',
      'userId',
      'fullAddress',
      'displayName',
    ];
    const ignoredKeys = [
      'categoryName',
      'itemName',
      'profilePicture',
      'phoneNumber',
      '_id',
      'user',
      'media',
      'location',
      'createdAt',
      'updatedAt',
      '__v',
      'isDeactivate',
      'productType',
      `expiryDate`,
      'latitude',
      'longitude',
    ];
    try {
      setLoading(true);
      let url;
      url = `api/v1/listing/fetchSingleItem/home/${adId}`;
      const { response, status } = await get(url);
      if (status === 200) {
        setLoading(false);
        const responseData = response?.response || [];
        const { user, item, createdAt } = responseData;
        setItemDetails(item);
        setUserDetails(user);
        setCategoryName(responseData?.item.categoryName);

        const filteredDetails = Object.fromEntries(
          Object.entries(item).filter(
            ([key]) => !usedKeys.includes(key) && !ignoredKeys.includes(key),
          ),
        );
        setAdditionalInformation(filteredDetails);
        const formattedDate = formatDate(createdAt);
        setItemPosted(formattedDate);
        const { askingPrice, displayName, media, location } = item;
        setAskingPrice(askingPrice);
        setMediaArray(media);
        setDisplayName(displayName);
        setItemLocation(location);
        const firstImage = media.find(uri => !uri.endsWith('.mp4'));
        if (firstImage) {
          setItemDisplayPicture(firstImage);
        }
      } else {
        console.log('no response');
      }
    } catch (error) {
      console.log(`error while fetching ad information ${error}`);
    }
    setLoading(false);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const widthRef = useRef(width); // Store screen width

  const renderItem = ({ item, index }) => {
    const fileExtension = item.split('.').pop().toLowerCase();
    const isVideo = fileExtension === 'mp4';
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

    if (isVideo) {
      return (
        <Pressable
          style={[
            styles.pdh16,
            { width: widthRef.current, height: height * 0.27 },
          ]}
          onPress={() => {
            const interstitialAdUnitId =
              'ca-app-pub-9372794286829313/2109975439';
            const interstitial =
              InterstitialAd.createForAdRequest(interstitialAdUnitId);

            const unsubscribe = interstitial.addAdEventListener(
              AdEventType.LOADED,
              () => {
                interstitial.show();
              },
            );

            const unsubscribeClose = interstitial.addAdEventListener(
              AdEventType.CLOSED,
              () => {
                unsubscribe();
                unsubscribeClose();
                navigation.navigate('AdsMedia', {
                  mediaUriArray: mediaArray,
                });
              },
            );

            const unsubscribeError = interstitial.addAdEventListener(
              AdEventType.ERROR,
              () => {
                unsubscribe();
                unsubscribeClose();
                unsubscribeError();
                navigation.navigate('AdsMedia', {
                  mediaUriArray: mediaArray,
                });
              },
            );

            interstitial.load();
          }}>
          <Video
            source={{ uri: item }}
            style={{ width: '80%', height: '80%', alignSelf: 'center' }}
            resizeMode="contain"
            paused={index === currentIndex ? false : true}
            controls
          />
        </Pressable>
      );
    } else if (isImage) {
      return (
        <Pressable
          style={[
            styles.pdh16,
            { width: widthRef.current, height: height * 0.27 },
          ]}
          onPress={() => {
            const interstitialAdUnitId =
              'ca-app-pub-9372794286829313/2109975439';
            const interstitial =
              InterstitialAd.createForAdRequest(interstitialAdUnitId);

            const unsubscribe = interstitial.addAdEventListener(
              AdEventType.LOADED,
              () => {
                interstitial.show();
              },
            );

            const unsubscribeClose = interstitial.addAdEventListener(
              AdEventType.CLOSED,
              () => {
                unsubscribe();
                unsubscribeClose();
                navigation.navigate('AdsMedia', {
                  mediaUriArray: mediaArray,
                });
              },
            );

            const unsubscribeError = interstitial.addAdEventListener(
              AdEventType.ERROR,
              () => {
                unsubscribe();
                unsubscribeClose();
                unsubscribeError();
                navigation.navigate('AdsMedia', {
                  mediaUriArray: mediaArray,
                });
              },
            );

            interstitial.load();
          }}>
          <Image
            source={{ uri: item }}
            style={{ width: '100%', height: '100%', alignSelf: 'center' }}
            resizeMode="contain"
          />
        </Pressable>
      );
    } else {
      return (
        <View
          style={[
            styles.pdh16,
            { width: widthRef.current, height: height * 0.27 },
          ]}>
          <Text>Unsupported media type</Text>
        </View>
      );
    }
  };

  const handleScroll = e => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / widthRef.current)); // Update currentIndex on scroll
  };

  const formatLabel = text => {
    if (text === undefined || text === null) return text;

    // Ensure text is a string
    if (typeof text !== 'string') {
      text = String(text);
    }

    // Apply formatting only if it's a string
    const formattedText = text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^\w/, c => c.toUpperCase());

    return formattedText;
  };

  const renderDot = (item, index) => {
    return (
      <View
        key={index}
        style={[
          styles.mt12,
          {
            width: 10,
            height: 10,
            borderRadius: 4,
            backgroundColor:
              currentIndex === index ? colors.mintGreen : colors.grey700,
          },
          styles.ml4,
        ]}
      />
    );
  };

  const handleChat = async () => {
    const interstitialAdUnitId = 'ca-app-pub-9372794286829313/5873126475';
    const interstitial =
      InterstitialAd.createForAdRequest(interstitialAdUnitId);

    // Load the interstitial ad
    interstitial.load();

    // Add event listener for the ad
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );

    // Listen for when the ad is closed or error occurs, then navigate to chat
    const unsubscribeClose = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribe();
        unsubscribeClose();
      },
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        unsubscribe();
        unsubscribeClose();
        unsubscribeError();
      },
    );

    setChatLoading(true);
    try {
      if (!userData) {
        ToastAndroid.showWithGravityAndOffset(
          'You are not logged in, please login first',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        setChatLoading(true);
        const url = `api/v1/messages/message/hasMessaged`;
        const body = {
          userId1: userData.user._id,
          userId2: userDetails._id,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          if (
            response?.response?.content?.length > 0 ||
            response.token === 'User chats exist'
          ) {
            navigation.navigate('ChatScreen', {
              otherUserFCMToken: userDetails.FCMToken,
              userFCMToken: userData.user.FCMToken,
              name: userDetails.userName,
              profilePic: userDetails.profilePicture,
              conversation: response.response.content,
              myId: userData.user._id,
              conversationId: response.response._id,
              isNew: false,
              productName: displayName.trim(),
              askingPrice: askingPrice,
              location: itemLocation.trim(),
              itemDisplayPicture: itemDisplayPicture,
              itemId: adId,
              phoneNumber: userDetails.phoneNumber,
            });
          } else {
            navigation.navigate('ChatScreen', {
              otherUserFCMToken: userDetails.FCMToken,
              userFCMToken: userData.user.FCMToken,
              name: userDetails.userName,
              profilePic: userDetails.profilePicture,
              myId: userData.user._id,
              productName: displayName.trim(),
              askingPrice: askingPrice,
              location: itemLocation.trim(),
              itemDisplayPicture: itemDisplayPicture,
              phoneNumber: userDetails.phoneNumber,
              isNewChat: true,
              sellerId: userDetails._id,
              itemId: adId,
            });
          }
        } else {
          console.log(
            'status is not 200 while checking user has messaged ',
            status,
            response,
          );
        }
      }
    } catch (error) {
      console.log(`error while chatting with the user ${error}`);
    }
    setChatLoading(false);
  };

  const handleCall = phoneNumber => {
    let phoneUrl = `tel:${phoneNumber}`;
    const interstitialAdUnitId = 'ca-app-pub-9372794286829313/6171481709';
    const interstitial =
      InterstitialAd.createForAdRequest(interstitialAdUnitId);

    // Function to open the phone dialer
    const openPhoneApp = () => {
      Linking.canOpenURL(phoneUrl)
        .then(supported => {
          if (supported) {
            Linking.openURL(phoneUrl);
          } else {
            console.log("Can't handle url: " + phoneUrl);
          }
        })
        .catch(err => console.error('Error opening phone app', err));
    };

    // Load the interstitial ad
    interstitial.load();

    // Add event listener for ad loaded event to show ad
    const unsubscribeLoad = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );

    // After ad is closed, check login and open phone app
    const unsubscribeClose = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeLoad();
        unsubscribeClose();
        unsubscribeError();

        if (!userData) {
          ToastAndroid.showWithGravityAndOffset(
            'You are not logged in, please login first',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          openPhoneApp();
        }
      },
    );

    // On ad error, also open phone app so user is not blocked
    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        unsubscribeLoad();
        unsubscribeClose();
        unsubscribeError();

        if (!userData) {
          ToastAndroid.showWithGravityAndOffset(
            'You are not logged in, please login first',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          openPhoneApp();
        }
      },
    );
  };
  return (
    <SafeAreaView style={[styles.pdt16, { flex: 1 }]}>
      {loading ? (
        <View
          style={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <ActivityIndicator color={colors.mintGreen} size="large" />
        </View>
      ) : (
        <>
          <View
            style={[
              styles.fdRow,
              styles.mr16,
              styles.ml16,
              styles.mb12,
              { justifyContent: 'space-between' },
            ]}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Image source={icons.arrow_back} style={[styles.icon36]} />
            </TouchableOpacity>
            <View style={[styles.fdRow, styles.mt4]}>
              <TouchableOpacity
                onPress={() => {
                  likeFunction(parentId, userId);
                  if (heartColor === icons.red_heart) {
                    setHeartColor(icons.heart);
                  } else if (heartColor === icons.heart) {
                    setHeartColor(icons.red_heart);
                  }
                }}>
                <Image
                  source={heartColor}
                  style={[
                    styles.icon32,
                    styles.ml16,
                    {
                      tintColor:
                        heartColor === icons.red_heart ? null : colors.black,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: height * 1 }}>
            <View>
              <FlatList
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={mediaArray}
                horizontal
                onScroll={handleScroll}
                renderItem={renderItem}
                keyExtractor={item => item.uri}
              />
              <View
                style={[
                  styles.fdRow,
                  {
                    width: widthRef.current,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                {mediaArray?.map(renderDot)}
              </View>
            </View>

            <View style={[styles.pdh16]}>
              <View
                style={[
                  styles.fdRow,
                  { justifyContent: 'space-between', alignItems: 'center' },
                ]}>
                {askingPrice !== undefined && askingPrice !== null && (
                  <View style={[styles.fdRow]}>
                    <Image
                      source={icons.rupee}
                      style={[
                        styles.icon20,
                        styles.mr8,
                        { marginTop: 5, tintColor: colors.mintGreen },
                      ]}
                    />
                    <Text
                      style={[
                        styles.fwBold,
                        styles.ts20,
                        { color: colors.mintGreen },
                      ]}>
                      {formatPriceIndian(askingPrice)}
                    </Text>
                  </View>
                )}
                <Text style={[{ color: colors.black }, styles.ts12]}>
                  Posted on {itemPosted}
                </Text>
              </View>

              <Text
                style={[
                  styles.mt8,
                  styles.mb8,
                  styles.ts18,
                  { color: colors.black },
                ]}>
                {displayName?.trim()}
              </Text>
              <View
                style={[styles.fdRow, { marginTop: 6, alignItems: 'center' }]}>
                <Image
                  source={icons.location}
                  style={[styles.icon24, styles.mr8]}
                />
                <Text
                  style={[
                    { color: colors.black, paddingRight: 12 },
                    styles.ts15,
                    styles.fw400,
                  ]}>
                  {itemLocation}
                </Text>
              </View>
              <View style={[styles.mt12]}>
                <View style={[styles.mt8, styles.mb12]}>
                  <BannerAd
                    unitId={'ca-app-pub-9372794286829313/9854241697'}
                    size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
                  />
                </View>

                <Text style={[styles.ts17, styles.h2, { color: colors.black }]}>
                  Additional Details
                </Text>
                <View style={[styles.pdt8, styles.mt4]}>
                  {Object.entries(additionalInformation).map(([key, value]) => {
                    // Determine the display text for age and height
                    let displayValue = formatLabel(value);

                    if (key.toLowerCase() === 'age') {
                      displayValue +=
                        categoryName === 'Matrimonial'
                          ? value === '1'
                            ? ' year'
                            : ' years'
                          : value === '1'
                            ? ' month'
                            : ' months';
                    } else if (key.toLowerCase() === 'height') {
                      displayValue += ' feet';
                    }

                    return (
                      <View key={key} style={[styles.mb4, styles.fdRow]}>
                        <Text
                          style={[
                            styles.ts14,
                            { color: colors.black },
                            styles.mr8,
                          ]}>
                          {formatLabel(key)}:
                        </Text>
                        <Text
                          style={[
                            styles.ts14,
                            { color: colors.black, flex: 1, flexWrap: 'wrap' },
                          ]}>
                          {displayValue}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={{ width: '100%', marginBottom: 20, marginTop: 10 }}>
                <BannerAd
                  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                  unitId={'ca-app-pub-9372794286829313/7614063803'}
                  onAdFailedToLoad={error => {
                    console.log('Ad failed to load:', error);
                  }}
                  onAdLoaded={() => {
                    console.log('Ad loaded successfully');
                  }}
                />
              </View>

              {/*  for disclaimer */}
              <View
                style={[
                  {
                    height: fullDisclaimer ? 115 : 135,
                    width: '102%',
                    left: -5,
                    // alignSelf: 'center',
                    backgroundColor: colors.orange100,
                  },
                  styles.pdt8,
                  styles.pdh16,
                  styles.mt8,
                ]}>
                <Text
                  style={[
                    styles.fwBold,
                    styles.ts19,
                    styles.mb16,
                    { color: colors.black, color: colors.red },
                  ]}>
                  Disclaimer
                </Text>
                <Text style={[{ color: colors.black }]}>
                  Your safety is our first priority. Make face to face deal
                  only. Don't try to pay or receive any amount in advance.
                </Text>
                {!fullDisclaimer && (
                  <Pressable
                    style={[{ alignSelf: 'flex-end' }, styles.mt8]}
                    onPress={() => setFullDisclaimer(true)}>
                    <Text
                      style={[
                        {
                          color: colors.red,
                          textDecorationStyle: 'solid',
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      Show More
                    </Text>
                  </Pressable>
                )}
              </View>
              {fullDisclaimer && (
                <View
                  style={[
                    styles.mb8,
                    styles.pdh8,
                    {
                      height: 390,
                      backgroundColor: colors.orange100,
                    },
                  ]}>
                  <Text
                    style={[
                      { color: colors.black, fontWeight: '600' },
                      styles.ts14,
                    ]}>
                    How to identify a scammer ?
                  </Text>
                  <Text></Text>
                  <View style={[styles.mt8]}>
                    {disclaimerText.map((item, index) => (
                      <Text
                        key={index}
                        style={[
                          {
                            color: colors.black,
                            marginTop: 3,
                            fontFamily: 'sans-serif',
                          },
                        ]}>
                        {item}
                      </Text>
                    ))}
                  </View>
                  {fullDisclaimer && (
                    <Pressable
                      style={[{ alignSelf: 'flex-end' }, styles.mt16]}
                      onPress={() => setFullDisclaimer(false)}>
                      <Text
                        style={[
                          {
                            color: colors.red,
                            textDecorationStyle: 'solid',
                            textDecorationLine: 'underline',
                          },
                        ]}>
                        Show Less
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            <View style={[, styles.mb28, styles.mt8, styles.pdh16]}>
              <Text style={[styles.ts18, { color: colors.black }]}>
                Seller Profile
              </Text>
              <SellerProfile
                style={styles.mt12}
                name={userDetails?.userName}
                customerId={userDetails?._id}
                userImage={userDetails?.profilePicture}
              />
            </View>
          </ScrollView>

          {/* Bottom buttons */}
          {userData?.user?._id !== userDetails?._id && (
            <View
              style={[
                styles.fdRow,
                styles.pdh16,
                styles.pdb8,
                styles.mt20,
                { width: '100%', justifyContent: 'space-between' },
              ]}>
              <Button
                // label={'Chat'}
                label={
                  chatLoading ? (
                    <ActivityIndicator
                      size={'small'}
                      color={colors.black}
                      style={{ alignSelf: 'center' }}
                    />
                  ) : (
                    'Chat'
                  )
                }
                textStyle={[styles.fwBold, styles.ts18, { color: colors.black }]}
                style={[
                  {
                    width: '45%',
                    backgroundColor: 'white',
                    borderWidth: 1,
                  },
                ]}
                onPress={handleChat}
                isLoading={chatLoading}
                loaderColor={colors.black}
              />

              <Button
                label={'Call'}
                style={[{ width: '45%' }]}
                textStyle={[styles.fwBold, styles.ts18]}
                onPress={() => handleCall(userDetails.phoneNumber)}
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ViewAdInfo;
