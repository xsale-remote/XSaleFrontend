import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import { ListingCard, SearchBar } from '../../component/shared';
import { HomeHeader } from '../../component/Home';
import { get, post } from '../../utils/requestBuilder';
import { getUserInfo } from '../../utils/function';
import icons from '../../assets/icons';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { admobSearchscreenBanner } from '../../utils/env';
import { logEvent } from '../../utils/analytics';

const AdBanner = () => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <View style={[styles.pdv4,{
      width: '100%',
      alignSelf: 'stretch',
      backgroundColor: colors.offWhite,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      borderColor: colors.grey200,
      alignItems: 'center',
      marginVertical: 6,
    }]}>
      <BannerAd
        size={BannerAdSize.LARGE_BANNER}
        unitId={admobSearchscreenBanner}
        style={{ width: '100%' }}
        onAdFailedToLoad={() => setShow(false)}
      />
    </View>
  );
};

const SearchScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState(
    route.params?.query || route.params?.searchQuery || '',
  );
  const { latitude, longitude } = route.params;

  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [userId, setUserId] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [likedStates, setLikedStates] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [itemLoading, setItemLoading] = useState(false);

  const prevSearchQueryRef = useRef(searchQuery);

  useEffect(() => {
    getUserData();
  }, []);

  const injectAds = (items, pageNum) => {
    const result = [];
    items.forEach((item, index) => {
      result.push(item);
      if ((index + 1) % 4 === 0) {
        result.push({ isAd: true, id: `ad_page${pageNum}_${index}` });
      }
    });
    return result;
  };

  const getUpdatedUser = async uid => {
    try {
      const { response, status } = await post('api/v1/user/fetch/user', { _id: uid }, true);
      if (status === 200) {
        const likedItemIds = response.response.likedItems;
        setLikedItems(likedItemIds);
        const updatedLikedStates = {};
        likedItemIds.forEach(id => { updatedLikedStates[id] = true; });
        setLikedStates(prev => ({ ...prev, ...updatedLikedStates }));
      }
    } catch (error) {
      console.log(`error fetching user: ${error}`);
    }
  };

  const getUserData = async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        const { _id } = user?.user;
        setUserId(_id);
        await getUpdatedUser(_id);
      }
    } catch (error) {
      console.log(`error getting user data: ${error}`);
    }
  };

  const fetchListings = async (currentPage, query, isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return;
    setItemLoading(true);
    isRefresh ? setRefreshing(true) : setLoading(true);

    try {
      const url = `api/v1/listing/search?q=${encodeURIComponent(query)}&page=${currentPage}&limit=20&latitude=${latitude}&longitude=${longitude}`;
      const { response, status } = await get(url);

      if (status === 200) {
        const responseData = response?.response;
        if (responseData?.items) {
          const activeItems = responseData.items.filter(item => !item.isDeactivate);
          const transformedItems = activeItems.map(listing => {
            const itemData = Array.isArray(listing.item) ? listing.item[0] : listing.item;
            return {
              id: listing._id,
              image: itemData?.media?.[0] || '',
              price: itemData?.askingPrice || 0,
              title: itemData?.displayName || 'No title',
              location: listing.location || 'Unknown location',
              date: formatDate(itemData?.createdAt),
              distance: listing.distance,
              productType: itemData?.productType,
            };
          });

          setListings(prevItems => {
            const prevReal = prevItems.filter(i => !i.isAd);
            const merged = isRefresh || currentPage === 1
              ? transformedItems
              : [...prevReal, ...transformedItems];
            return injectAds(merged, currentPage);
          });

          setPage(currentPage);
          setHasMore(responseData.hasMoreItems || false);
          setTotalItems(responseData.totalItems || 0);
        } else {
          if (isRefresh || currentPage === 1) setListings([]);
          setHasMore(false);
        }
      } else {
        console.log
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setItemLoading(false);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('en', { month: 'short' }).toUpperCase()}`;
  };

  useEffect(() => {
    const routeQuery = route.params?.query || route.params?.searchQuery || '';
    if (routeQuery && routeQuery !== prevSearchQueryRef.current) {
      prevSearchQueryRef.current = routeQuery;
      setSearchQuery(routeQuery);
      setListings([]);
      setPage(1);
      setHasMore(true);
      fetchListings(1, routeQuery, true);
    }
  }, [route.params?.query, route.params?.searchQuery]);

  useEffect(() => {
    if (searchQuery) fetchListings(1, searchQuery, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchListings(page + 1, searchQuery);
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchListings(1, searchQuery, true);
  };

  const handleNewSearch = newQuery => {
    if (newQuery.trim()) {
      logEvent('search_performed', { query: newQuery, source: 'search_screen', city: route.params?.city || 'unknown' });
      setSearchQuery(newQuery);
      prevSearchQueryRef.current = newQuery;
      setListings([]);
      setPage(1);
      setHasMore(true);
      fetchListings(1, newQuery, true);
      navigation.setParams({ query: newQuery, searchQuery: newQuery });
    }
  };

  const handlePress = (item, position) => {
    logEvent('search_result_clicked', {
      query: searchQuery,
      item_title: item.title || 'unknown',
      category: item.productType || 'unknown',
      position: String(position),
    });
    navigation.navigate('ViewAdInfo', {
      adId: item.id,
      likeFunction: handleFavoritePress,
      userId,
      parentId: item.id,
      isLiked: likedStates[item.id] || false,
    });
  };

  const handleFavoritePress = async (itemId, uid) => {
    if (!uid) {
      ToastAndroid.showWithGravityAndOffset('Please login first', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      return;
    }
    setLoadingStates(prev => ({ ...prev, [itemId]: true }));
    try {
      const { status } = await post('api/v1/user/item/like-item', { userId: uid, itemId }, true);
      if (status === 200) {
        setLikedStates(prev => ({ ...prev, [itemId]: !prev[itemId] }));
        getUpdatedUser(uid);
      }
    } catch (error) {
      console.log(`error liking item: ${error}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  const renderHeader = () => {
    if (listings.length === 0 && !loading) return null;
    return (
      <View style={[
        styles.fdRow, 
        styles.pdh16, 
        styles.pdv12, 
        {
          justifyContent : "space-between", 
          alignItems : "center" , 
          backgroundColor: colors.white, 
          borderBottomWidth : 1, 
           borderBottomColor: colors.platinum,
        }
      ]}>
        <Text style={[
          styles.ts14, {
            color : colors.grey
          }
        ]}>
          Showing results for "{searchQuery}"
        </Text>
        {totalItems > 0 && (
          <View style={[
            styles.pdh4, 
            {
              paddingHorizontal : 10 ,
              backgroundColor : colors.cyanCider,
              borderRadius : 4
            }
          ]}>
            <Text style={[
              styles.ts12, styles.fw400 , {color : colors.seaGreen}
            ]}>
              {totalItems.toLocaleString('en-IN')} ads
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading || refreshing) return null;
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>
          No results found for "{searchQuery}"
        </Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    if (item.isAd) return <AdBanner key={item.id} />;

    const isLiked = likedStates[item.id] || false;
    const isLikeLoading = loadingStates[item.id] || false;
    return (
      <ListingCard
        image={item.image}
        price={item.price}
        title={item.title}
        location={item.location}
        date={item.date}
        featured={item.featured}
        onPress={() => handlePress(item, index + 1)}
        onFavoritePress={() => handleFavoritePress(item.id, userId)}
        isLiked={isLiked}
        isLikeLoading={isLikeLoading}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.pdh4, { flex: 1, backgroundColor: '#f7f8f9' }]}>
      <View style={[styles.pdh8]}>
        <HomeHeader hideLocation={true} />
        <SearchBar value={searchQuery} onSearch={handleNewSearch} />
      </View>

      {!itemLoading && listings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={icons.empty} style={{ height: 150, width: 150 }} />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={false}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}

      {itemLoading && (
        <ActivityIndicator
          size={'small'}
          color={colors.mintGreen}
          style={[styles.mt32]}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;