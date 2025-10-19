import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Alert,
  BackHandler,
  Linking,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import {HomeHeader, LocationInput, Categories} from '../../component/Home';
import {BottomNavigation} from '../../component/shared';
import {get, post} from '../../utils/requestBuilder';
import {getUserInfo} from '../../utils/function';
import {AdsCard} from '../../component/shared';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';
import {Button} from 'react-native-share';
import messaging from "@react-native-firebase/messaging"


const Home = ({navigation}) => {
  const [homeAds, setHomeAds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [likedStates, setLikedStates] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getUser();
    requestUserPermission()
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, []),
  );

  async function requestUserPermission() {
    // Only request permission for Android 13+ (API level 33+)
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } else {
      // For older Android versions and iOS, use Firebase messaging request
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Notification authorization status:', authStatus);
      }
    }
  }


  const getUpdatedUser = async userId => {
    try {
      const url = 'api/v1/user/fetch/user';
      const body = {
        _id: userId,
      };
      const {response, status} = await post(url, body, true);
      if (status === 200) {
        const responseData = response.response;
        const likedItemIds = responseData.likedItems;
        setLikedItems(likedItemIds);
        const updatedLikedStates = {};
        likedItemIds.forEach(id => {
          updatedLikedStates[id] = true;
        });
        setLikedStates(prevState => ({
          ...prevState,
          ...updatedLikedStates,
        }));
      } else {
        console.log(
          'status is not 200 while fetching updated user ',
          status,
          response,
        );
      }
    } catch (error) {
      console.log(`error while fetching updated user info: ${error}`);
    }
  };

  const getUser = async () => {
    try {
      const userData = await getUserInfo();
      if (userData) {
       setLoggedIn(true);
        const {userName, profilePicture, _id} = userData.user;
        const fullAddress = userData?.user?.location?.fullAddress;
        const {latitude, longitude} = userData?.user?.location;
        setUserId(_id);
        getUpdatedUser(_id);
        setUserName(userName);
        setProfilePicture(profilePicture);
        setAddress(fullAddress);
        setUserLatitude(latitude);
        setUserLongitude(longitude);
        getAllItems(latitude, longitude, 1);
      } else {
        setLoggedIn(false);
        // Fetch user's location using Google API
        const defaultLocation = await fetchGoogleLocation();
        const {latitude, longitude} = defaultLocation;
        setAddress("Please login to use location");
        setUserLatitude(latitude);
        setUserLongitude(longitude);
        getAllItems(latitude, longitude, 1);
      }
    } catch (error) {
      console.log('error while fetching the user data ', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            'Permission Required',
            'Location permission is required for this app to function. Please enable it in the settings.',
            [
              {
                text: 'Go to Settings',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Exit',
                onPress: () => BackHandler.exitApp(),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
          return false;
        }
      } 
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const fetchGoogleLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      } 

      const getPosition = () => {
        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        });
      };

      const position = await getPosition();
       const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setUserLatitude(latitude);
      setUserLongitude(longitude);
      return {
        latitude , 
        longitude  , 
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert(
        'Error',
        'Unable to fetch location. Please ensure location services are enabled.',
        [{text: 'Exit', onPress: () => BackHandler.exitApp()}],
      );
      return {
        fullAddress: 'Unknown Location',
        latitude: 0,
        longitude: 0,
      };
    }
  };

  const onRefresh = () => {
    getAllItems(userLatitude, userLongitude, 1);
  };

  const loadMoreItems = async () => {
    if (hasMoreItems && !loadingMore) {
      setLoadingMore(true);
      setPage(prevPage => prevPage + 1);
      await getAllItems(userLatitude, userLongitude, page + 1);
      setLoadingMore(false);
    }
  };

  const getAllItems = async (latitude, longitude, currentPage) => {
    setRefreshing(currentPage === 1);
    try {
      const url = `api/v1/listing/fetch/items?page=${currentPage}&limit=20&userLatitude=${latitude}&userLongitude=${longitude}`;
      const {response, status} = await get(url);
      if (status === 200) {
        const responseData = response?.response;
        if (responseData?.items) {
          const activeItems = responseData.items.filter(
            item => !item.isDeactivate,
          );
          // Update state with fetched items
          setHomeAds(prevItems =>
            currentPage === 1 ? activeItems : [...prevItems, ...activeItems],
          );

          // Set pagination state
          setPage(currentPage);
          const hasMore = responseData.hasMoreItems;
          setHasMoreItems(hasMore);
        } else {
          console.log('No items available');
        }
      } else {
        console.log('Status is not 200:', status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const modifiedData = [...homeAds];
  const adInterval = 6;
  for (let i = adInterval; i < modifiedData.length; i += adInterval + 1) {
    modifiedData.splice(i, 0, {type: 'bannerAd'});
  }

  const renderAdsCard = ({item, index}) => {
    if (item.type === 'bannerAd') {
      return (
        <View style={{width: '100%'}}>
          <BannerAd
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
            unitId={`ca-app-pub-9372794286829313/2602437630`}
            onAdFailedToLoad={error => {
              console.log('Ad failed to load:', error);
            }}
            onAdLoaded={() => {
              console.log('Ad loaded successfully');
            }}
          />
        </View>
      );
    }

    const parentId = item._id;
    const itemData = item.item;
    const isLikeLoading = loadingStates[parentId];
    const isLiked = likedStates[parentId] || false;

    const imageFormats = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
    const firstImage = itemData.media
      ? itemData.media.find(mediaUrl =>
          imageFormats.some(format => mediaUrl.endsWith(format)),
        )
      : itemData[0].media.find(mediaUrl =>
          imageFormats.some(format => mediaUrl.endsWith(format)),
        );

    return (
      <AdsCard
        parentId={parentId}
        data={itemData}
        onPress={() =>
          navigation.navigate('ViewAdInfo', {
            adId: parentId,
            likeFunction: likeItem,
            userId,
            parentId,
            isLiked,
            forHome: true,
          })
        }
        onLikePress={() => likeItem(parentId, userId)}
        isLikeLoading={isLikeLoading}
        isLiked={isLiked}
        firstImageUri={firstImage}
        distance={item.distance}
      />
    );
  };

  const likeItem = async (itemId, userId, idType) => {
    if (userId) {
      setLoadingStates(prevState => ({...prevState, [itemId]: true}));
      try {
        const body = {
          userId,
          itemId,
        };
        const url = `api/v1/user/item/like-item`;
        const {response, status} = await post(url, body, true);
        if (status === 200) {
          setLikedStates(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId],
          }));
          getUpdatedUser(userId);
        } else {
          console.log('status is not 200 while liking item ', status);
        }
      } catch (error) {
        console.log(`error while liking the item ${error}`);
      } finally {
        setLoadingStates(prevState => ({...prevState, [itemId]: false}));
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Please login first',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={[styles.pdv12]}>
        <ActivityIndicator size="small" color={colors.mintGreen} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.pdh16, {height: '100%', flex: 1}]}>
      <HomeHeader name={userName} profilePicture={profilePicture} />
      <LocationInput
        address={ address}
        onPress={() => navigation.navigate('ChangeLocation', {address})}
      />
      <View
        style={[
          styles.pdh16,
          styles.mb12,
          styles.pdv8,
          {
            width: '100%',
            backgroundColor: colors.grey700,
            borderRadius: 6,
          },
          styles.mt8,
          styles.pdt8,
        ]}>
        <View
          style={[styles.fdRow, styles.mb4, {justifyContent: 'space-between'}]}>
          <Text
            style={[
              styles.fwBold,
              styles.ts17,
              {color: colors.blackOlive},
              styles.mb4,
            ]}>
            Categories
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllCategories')}>
            <Text
              style={[
                styles.fw400,
                {fontFamily: 'Fira Sans', color: colors.taupeGray},
              ]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <Categories />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={[{flex: 1, marginBottom: 50}]}
        data={modifiedData}
        renderItem={renderAdsCard}
        keyExtractor={(item, index) => item._id || `banner-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.mintGreen]}
          />
        }
        numColumns={2}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default Home;
