import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ToastAndroid,
  Image,
  ScrollView,
} from 'react-native';
import {Button, BottomNavigation} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {PremiumOption, MyAdsCard} from '../../component/myAds';
import {deleteApi, post, put} from '../../utils/requestBuilder';
import {getUserInfo} from '../../utils/function';
import {AdsCard} from '../../component/shared';
import {useFocusEffect} from '@react-navigation/native';

const MyAds = ({navigation, route}) => {
  const [selectedCategory, setSelectedCategory] = useState('Ads');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Active');
  const [userId, setUserId] = useState('');
  const [moreOptionLoading, setMoreOptionLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [deactivateItems, setDeactivateItems] = useState([]);
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [likedStates, setLikedStates] = useState({});
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const adsButtonAnim = useRef(new Animated.Value(1)).current;
  const premiumButtonAnim = useRef(new Animated.Value(0)).current;
  const [activeAdsEmpty, setActiveAdsEmpty] = useState(false);
  const [notLiked, setNotLiked] = useState(false);

  const activeButtonAnim = useRef(new Animated.Value(1)).current;
  const deactivateButtonAnim = useRef(new Animated.Value(0)).current;
  const favouriteButtonAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [userId]),
  );

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    Animated.timing(adsButtonAnim, {
      toValue: selectedCategory === 'Ads' ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(premiumButtonAnim, {
      toValue: selectedCategory === 'Buy Premium' ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [selectedCategory]);

  useEffect(() => {
    Animated.timing(activeButtonAnim, {
      toValue: selectedSubCategory === 'Active' ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(deactivateButtonAnim, {
      toValue: selectedSubCategory === 'Deactivate' ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(favouriteButtonAnim, {
      toValue: selectedSubCategory === 'Favourite' ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [selectedSubCategory]);

  const OptionButton = ({label, onPress, animation}) => (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.darkGrey,
            borderRadius: 12,
            width: '100%',
          },
          styles.pdh20,
          styles.pdv8,
          animatedStyle(animation),
        ]}>
        <Animated.Text style={animatedTextStyle(animation)}>
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const animatedStyle = animation => ({
    backgroundColor: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.lightGrey, colors.mintGreen],
    }),
  });

  const animatedTextStyle = animation => ({
    color: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.darkGrey, colors.white],
    }),
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  });

  const getUser = async () => {
    try {
      setSelectedSubCategory('Favourite');
      const userData = await getUserInfo();
      if (userData) {
        const {_id} = userData.user;
        const fullAddress = userData?.user?.location?.fullAddress;
        const {latitude, longitude} = userData?.user?.location;
        setUserId(_id);
        handleSelectActive(_id);
        handleSelectActive(_id);
        setUserLatitude(latitude);
        setUserLongitude(longitude);
        // handleSelectFavourite(latitude, longitude);
      } else {
        console.log('user data not avaialble');
      }
    } catch (error) {
      console.log(`error while fetching user data ${error}`);
    }
  };


  const likeItem = async (itemId, userId, idType) => {
    if (userId) {
      setLoadingStates(prevState => ({...prevState, [itemId]: true}));
      try {
        const body = {
          userId,
          itemId,
          itemIdType: idType,
        };
        const url = `api/v1/user/item/like-item`;
        const {response, status} = await post(url, body, true);
        if (status === 200) {
          setLikedStates(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId],
          }));
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

  const renderFavouriteAdsCard = ({item}) => {
    const parentId = item._id;
    const itemData = item.item;
    const isLikeLoading = loadingStates[parentId];
    const isLiked = likedStates[parentId] || false;

    // Filter media array to find the first image
    const imageFormats = ['jpg', 'jpeg', 'png'];
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
        // onPress={() => navigation.navigate('ViewAdInfo', {adId: parentId})}
        onPress={() => {
          navigation.navigate('ViewAdInfo', {
            adId: parentId,
            likeFunction: likeItem,
            userId,
            parentId,
            isLiked: true,
            useChildren: true,
            forHome: true,
          });
        }}
        // onDislike={() => likeItem(parentId, userId, 'childrenId')}
        onDislike={() => likeItem(parentId, userId)}
        isLikeLoading={isLikeLoading}
        isLiked={true}
        firstImageUri={firstImage}
        forFavourite={true}
        distance={itemData[0].distance}
      />
    );
  };

  const handleSelectActive = async userId => {
    setIsLoading(true);
    setSelectedSubCategory('Active');
    try {
      const url = `api/v1/user/fetch/uploaded-items`;
      const body = {userId};
      const {response, status} = await post(url, body, true);

      if (status === 200) {
        const responseData = response.response;
        // Separate items based on their isDeactivate status
        const activeItems = responseData.filter(item => !item.isDeactivate);
        const deactivatedItems = responseData.filter(item => item.isDeactivate);
        if (activeItems.length === 0) {
          setActiveAdsEmpty(true);
        }
        setUploadedItems(activeItems.reverse());
        setDeactivateItems(deactivatedItems.reverse());
        setIsLoading(false);
      } else {
        console.log(response, status, 'status is not 200');
      }
    } catch (error) {
      console.log(`error while fetching all the active items ${error}`);
    }
    setIsLoading(false);
  };

  const renderActiveAdsCard = ({item}) => {
    const parentId = item._id;
    const userId = item.user;
    const itemData = Array.isArray(item.item) ? item.item[0] : item.item;
    const postedOn = item.createdAt;

    return (
      <MyAdsCard
        itemData={itemData}
        postedOn={postedOn}
        selectedSubCategory={selectedSubCategory}
        userId={userId}
        parentId={parentId}
        handleSelectActive={() => handleSelectActive(userId)}
        expiresOn={item.expiryDate}
      />
    );
  };

  const handleSelectFavourite = async (latitude, longitude) => {
    setIsLoading(true);
    setSelectedSubCategory('Favourite');
    try {
      const url = 'api/v1/user/fetch/user';
      const body = {
        _id: userId,
        forFavourite: true,
      };
      const {response, status} = await post(url, body, true);
      if (status === 200) {
        const responseData = response.response.items;
        setFavouriteItems(responseData.reverse())
        // if (latitude !== null && longitude !== null) {
        //   const sortedItems = await sortItemsByProximity(
        //     responseData,
        //     latitude,
        //     longitude,
        //   );
        //   setFavouriteItems(sortedItems);
        // } else {
        //   console.log('user latitude and longitude does not exist');
        // }
      }
    } catch (error) {
      console.log(`error while fetching all the favourites item ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={[styles.p16, {height: '100%', flex: 1}]}>
      <Text
        style={[
          styles.ts22,
          styles.fw400,
          {color: colors.darkGrey, textAlign: 'center'},
        ]}>
        My Ads
      </Text>

      {/* <View
        style={[
          styles.fdRow,
          styles.mt12,
          styles.pdh8,
          {
            height: 50,
            width: '100%',
            justifyContent: 'space-between',
          },
        ]}>
        <TouchableOpacity onPress={() => setSelectedCategory('Ads')}>
          <Animated.View
            style={[
              animatedStyle(adsButtonAnim),
              {
                flex: 1,
                marginHorizontal: 8,
                height: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                width: 150,
              },
            ]}>
            <Animated.Text style={animatedTextStyle(adsButtonAnim)}>
              Ads
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory('Buy Premium')}>
          <Animated.View
            style={[
              animatedStyle(premiumButtonAnim),
              {
                flex: 1,
                marginHorizontal: 8,
                height: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
                width: 150,
              },
            ]}>
            <Animated.Text style={animatedTextStyle(premiumButtonAnim)}>
              Buy Premium
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View> */}
      <View
        style={[
          {
            borderBottomColor: colors.black,
            borderBottomWidth: 1,
            opacity: 0.2,
          },
          styles.mt8,
        ]}
      />
      {selectedCategory === 'Ads' && (
        <View style={[{flex : 1, marginBottom : 40}]}>
          <View
            style={[
              {
                height: 50,
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              styles.fdRow,
              styles.mt8,
            ]}>
            <OptionButton
              label={'Active'}
              onPress={() => handleSelectActive(userId)}
              animation={activeButtonAnim}
            />
            <OptionButton
              label={'Deactivate'}
              onPress={() => setSelectedSubCategory('Deactivate')}
              animation={deactivateButtonAnim}
            />
            <OptionButton
              label={'Favourite'}
              onPress={() => handleSelectFavourite(userLatitude, userLongitude)}
              animation={favouriteButtonAnim}
            />
          </View>

          <ScrollView
            style={[{height: 'auto', flex : 1 }, styles.pdt12]}
            showsVerticalScrollIndicator={false}>
            {selectedCategory === 'Ads' && selectedSubCategory === 'Active' && (
              <>
                {isLoading ? (
                  <ActivityIndicator
                    size={'large'}
                    color={colors.darkGrey}
                    style={[{marginTop: 200}]}
                  />
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={uploadedItems}
                    renderItem={renderActiveAdsCard}
                    keyExtractor={item => item._id}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => handleSelectActive(userId)}
                        colors={[colors.mintGreen]}
                      />
                    }
                  />
                )}
                {uploadedItems.length === 0 && !isLoading && (
                  <Text
                    style={[
                      styles.ts18,
                      {marginTop: 200, textAlign: 'center' , color : colors.grey500},
                    ]}>
                    No Active Ads
                  </Text>
                )}
              </>
            )}
            {selectedCategory === 'Ads' &&
              selectedSubCategory === 'Deactivate' && (
                <>
                  {isLoading ? (
                    <ActivityIndicator
                      size={'large'}
                      color={colors.darkGrey}
                      style={[{marginTop: 170}]}
                    />
                  ) : (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={deactivateItems}
                      renderItem={renderActiveAdsCard}
                      keyExtractor={item => item._id}
                      refreshControl={
                        <RefreshControl
                          refreshing={isLoading}
                          onRefresh={() => handleSelectActive(userId)}
                          colors={[colors.mintGreen]}
                        />
                      }
                    />
                  )}
                  {deactivateItems.length === 0 && !isLoading && (
                    <Text
                      style={[
                        styles.ts18,
                        {textAlign: 'center', marginTop: 170, color : colors.grey500},
                      ]}>
                      No deactive Ads
                    </Text>
                  )}
                </>
              )}
            {selectedCategory === 'Ads' &&
              selectedSubCategory === 'Favourite' && (
                <>
                  {isLoading ? (
                    <ActivityIndicator
                      size={'large'}
                      color={colors.darkGrey}
                      style={[{marginTop: 200}]}
                    />
                  ) : (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={favouriteItems}
                      renderItem={renderFavouriteAdsCard}
                      keyExtractor={item => item._id}
                      refreshControl={
                        <RefreshControl
                          refreshing={isLoading}
                          onRefresh={() =>
                            handleSelectFavourite(userLatitude, userLongitude)
                          }
                          colors={[colors.mintGreen]}
                        />
                      }
                      numColumns={2}
                    />
                  )}

                  {favouriteItems.length === 0 && !isLoading && (
                    <Text
                      style={[
                        styles.ts18,
                        {marginTop: 200, textAlign: 'center', color : colors.grey500},
                      ]}>
                      No Favourite Ads
                    </Text>
                  )}
                </>
              )}
          </ScrollView>
        </View>
      )}

      {/* {selectedCategory === 'Buy Premium' && (
        <View
          style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
          <Text
            style={[styles.ts18, {textAlign: 'center', color: colors.black}]}>
            All ads are free to upload!! enjoy the benefit
          </Text>
        </View>
      )} */}


      <BottomNavigation />
    </SafeAreaView>
  );
};

export default MyAds;
