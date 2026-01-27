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
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [userId, setUserId] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [likedStates, setLikedStates] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [itemLoading, setItemLoading] = useState(false);

  // Keep track of previous search query
  const prevSearchQueryRef = useRef(searchQuery);

  useEffect(() => {
    getUserData();
  }, []);

  const getUpdatedUser = async userId => {
    try {
      const url = 'api/v1/user/fetch/user';
      const body = {
        _id: userId,
      };
      const { response, status } = await post(url, body, true);
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

  const getUserData = async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        const { _id } = user?.user;
        setIsLoggedIn(true);
        setUserId(_id);
        await getUpdatedUser(_id);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(`error while getting user data ${error}`);
    }
  };

  const fetchListings = async (currentPage, query, isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return;
    setItemLoading(true);
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const url = `api/v1/listing/search?q=${encodeURIComponent(
        query,
      )}&page=${currentPage}&limit=20&latitude=${latitude}&longitude=${longitude}`;

      const { response, status } = await get(url);
      if (status === 200) {
        const responseData = response?.response;
        if (responseData?.items) {
          const activeItems = responseData.items.filter(
            item => !item.isDeactivate,
          );
          const transformedItems = activeItems.map(listing => {
            const itemData = Array.isArray(listing.item)
              ? listing.item[0]
              : listing.item;

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
          setListings(prevItems =>
            isRefresh || currentPage === 1
              ? transformedItems
              : [...prevItems, ...transformedItems],
          );
          setPage(currentPage);
          setHasMore(responseData.hasMoreItems || false);
          setTotalItems(responseData.totalItems || 0);
        } else {
          console.log('No items found');
          if (isRefresh || currentPage === 1) {
            setListings([]);
          }
          setHasMore(false);
        }
      } else {
        console.log('API returned status:', status);
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
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  };

  // Initial fetch and when searchQuery changes
  useEffect(() => {
    const routeQuery = route.params?.query || route.params?.searchQuery || '';

    // Check if search query actually changed
    if (routeQuery && routeQuery !== prevSearchQueryRef.current) {
      prevSearchQueryRef.current = routeQuery;
      setSearchQuery(routeQuery);

      // Reset pagination and fetch
      setListings([]);
      setPage(1);
      setHasMore(true);
      fetchListings(1, routeQuery, true);
    }
  }, [route.params?.query, route.params?.searchQuery]);

  // Initial load
  useEffect(() => {
    if (searchQuery) {
      fetchListings(1, searchQuery, true);
    }
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      fetchListings(nextPage, searchQuery);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchListings(1, searchQuery, true);
  };

  // Handle new search from SearchBar
  const handleNewSearch = newQuery => {
    if (newQuery.trim() && newQuery !== searchQuery) {
      // Update local state
      setSearchQuery(newQuery);
      prevSearchQueryRef.current = newQuery;

      // Reset pagination
      setListings([]);
      setPage(1);
      setHasMore(true);

      // Fetch with new query
      fetchListings(1, newQuery, true);

      navigation.setParams({
        query: newQuery,
        searchQuery: newQuery,
      });
    }
  };

  const handlePress = item => {
    const { id } = item;
    const isLiked = likedStates[id] || false;
    navigation.navigate('ViewAdInfo', {
      adId: id,
      likeFunction: handleFavoritePress,
      userId,
      parentId: id,
      isLiked,
    });
  };

  const handleFavoritePress = async (itemId, userId, idType) => {
    if (userId) {
      setLoadingStates(prevState => ({ ...prevState, [itemId]: true }));
      try {
        const body = {
          userId,
          itemId,
        };
        const url = `api/v1/user/item/like-item`;
        const { response, status } = await post(url, body, true);
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
        setLoadingStates(prevState => ({ ...prevState, [itemId]: false }));
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
      <View style={headerStyles.container}>
        <Text style={headerStyles.resultsText}>
          Showing results for "{searchQuery}"
        </Text>
        {totalItems > 0 && (
          <View style={headerStyles.adsCount}>
            <Text style={headerStyles.adsCountText}>
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
    const isLiked = likedItems.includes(item.id);
    return (
      <ListingCard
        image={item.image}
        price={item.price}
        title={item.title}
        location={item.location}
        date={item.date}
        featured={item.featured}
        onPress={() => handlePress(item)}
        onFavoritePress={() => handleFavoritePress(item.id, userId)}
        isLiked={isLiked}
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
        <View
          style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Image source={icons.empty} style={[{ height: 150, width: 150 }]} />
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

const headerStyles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  adsCount: {
    backgroundColor: '#d4f4f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adsCountText: {
    fontSize: 12,
    color: '#002f34',
    fontWeight: '500',
  },
};

export default SearchScreen;
