import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, CategoriesItemBox, AdsCard} from '../../component/shared';
import styles from '../../assets/styles';
import {FilterBox} from '../../component/Home';
import images from '../../assets/images';
import icons from '../../assets/icons';
import {get} from '../../utils/requestBuilder';
import colors from '../../assets/colors';
import {getUserInfo} from '../../utils/function';
import {post} from '../../utils/requestBuilder';
import Geolocation from 'react-native-geolocation-service';

import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const subCatgoryUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const {width} = Dimensions.get('window');

const ProductsListing = ({navigation, route}) => {
  const [title, setTitle] = useState('');
  const titleProps = route.params;
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [itemsArray, setItemsArray] = useState([]);
  const [subCategoryItems, setSubcategoryItems] = useState([]);
  const [categoryVisible, setCategoryVisible] = useState(true);
  const [subCategoryVisible, setSubCategoryVisible] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [boxId, setBoxId] = useState(0);
  const [boxItemName, setBoxItemName] = useState('');
  const [boxCategoryName, setBoxCategoryName] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [likedStates, setLikedStates] = useState({});
  const [likedItems, setLikedItems] = useState([]);
  const [userLatitude, setUserLatitude] = useState('');
  const [userLongitude, setUserLongitude] = useState('');
  const [page, setPage] = useState(1);
  const [subCategoryPage, setSubCategoryPage] = useState(1);
  const [hasMoreItem, setHasMoreItems] = useState(false);
  const [bottomLoading, setBottomLoading] = useState(false);

  useEffect(() => {
    let titleString = titleProps;
    if (Array.isArray(titleProps)) {
      titleString = titleProps.join(' ');
    }
    setTitle(titleString);
    // if (titleProps === 'Farm Machines') {
    //   getUser(0, 'Farm Machine');
    // } else {
    //   getUser(0, titleString);
    // }
    getUser(0, titleString)
  }, []);

  const getUser = async (index, category) => {
    try {
      setIsLoading(true)
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
        fetchCategoryData(index, category, latitude, longitude, page);
      } else {
        setLoggedIn(false);
        const defaultLocation = await fetchUserCoords();
        const {latitude, longitude} = defaultLocation;
        setUserLatitude(latitude);
        setUserLongitude(longitude);
        fetchCategoryData(index, category, latitude, longitude, page);
      }
    } catch (error) {
      console.log('error while fetching the user data ', error);
    }
  };

  const fetchUserCoords = async () => {
    try {
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
        latitude,
        longitude,
      };
    } catch (error) {
      console.log('error while fetching user coords ', error);
    }
  };

  const Vehicles = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Vehicles'},
    {id: 1, itemName: 'Car', image: images.car, categoryName: 'Vehicles'},
    {
      id: 2,
      itemName: 'Ambulance',
      image: images.ambulance,
      categoryName: 'Vehicles',
    },
    {id: 3, itemName: 'Truck', image: images.truck, categoryName: 'Vehicles'},
    {
      id: 4,
      itemName: 'Tractor',
      image: images.tractor,
      categoryName: 'Vehicles',
    },
    {
      id: 5,
      itemName: 'Farm Machine',
      image: images.farm_machine,
      categoryName: 'Vehicles',
    },
    {id: 6, itemName: 'JCB', image: images.JCB, categoryName: 'Vehicles'},
    {id: 7, itemName: 'Bus', image: images.bus, categoryName: 'Vehicles'},
    {id: 8, itemName: 'Crain', image: images.crain, categoryName: 'Vehicles'},
    {
      id: 9,
      itemName: 'Other Vehicle',
      image: images.otherVehicles,
      categoryName: 'Vehicles',
    },
  ];
  const VehiclesRent = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Vehicle for Rent'},
    {
      id: 1,
      itemName: 'Car',
      image: images.car,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 2,
      itemName: 'Ambulance',
      image: images.ambulance,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 3,
      itemName: 'Truck',
      image: images.truck,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 4,
      itemName: 'Tractor',
      image: images.tractor,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 5,
      itemName: 'Farm Machine',
      image: images.farm_machine,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 6,
      itemName: 'JCB',
      image: images.JCB,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 7,
      itemName: 'Bus',
      image: images.bus,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 8,
      itemName: 'Crain',
      image: images.crain,
      categoryName: 'Vehicle for Rent',
    },
    {
      id: 9,
      itemName: 'Other Vehicle',
      image: images.otherVehicles,
      categoryName: 'Vehicle for Rent',
    },
  ];

  const Property = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Property'},
    {
      id: 1,
      itemName: 'Residential',
      image: images.house,
      categoryName: 'Property',
    },
    {
      id: 2,
      itemName: 'Commercial',
      image: images.shop,
      categoryName: 'Property',
    },
    {id: 3, itemName: 'Land', image: images.land, categoryName: 'Property'},
  ];

  const PropertiesRent = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Property for Rent'},
    {
      id: 1,
      itemName: 'Residential',
      image: images.house,
      categoryName: 'Property for Rent',
    },
    {
      id: 2,
      itemName: 'Commercial',
      image: images.shop,
      categoryName: 'Property for Rent',
    },
    {
      id: 3,
      itemName: 'PG/Hostel',
      image: images.pg_hostel,
      categoryName: 'Property for Rent',
    },
  ];

  const Animals = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Animals'},
    {id: 1, itemName: 'Cow', image: images.cow, categoryName: 'Animals'},
    {
      id: 2,
      itemName: 'Buffalo',
      image: images.buffalo,
      categoryName: 'Animals',
    },
    {id: 3, itemName: 'Bull', image: images.bull, categoryName: 'Animals'},
    {id: 4, itemName: 'Sheep', image: images.sheep, categoryName: 'Animals'},
    {id: 5, itemName: 'Cat', image: images.cat, categoryName: 'Animals'},
    {id: 6, itemName: 'Goat', image: images.goat, categoryName: 'Animals'},
    {id: 7, itemName: 'Dog', image: images.dog, categoryName: 'Animals'},
    {id: 8, itemName: 'Horse', image: images.horse, categoryName: 'Animals'},
    {id: 9, itemName: 'Donkey', image: images.donkey, categoryName: 'Animals'},
    {
      id: 10,
      itemName: 'Other Animals',
      categoryName: 'Animals',
      image: images.otherAnimals,
    },
  ];

  const Bikes = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Bikes'},
    {id: 1, itemName: 'Bike', image: images.bike, categoryName: 'Bikes'},
    {id: 2, itemName: 'Scooty', image: images.scooty, categoryName: 'Bikes'},
    {id: 3, itemName: 'Bicycles', image: images.bicycle, categoryName: 'Bikes'},
    {
      id: 4,
      itemName: 'Spare Parts',
      image: images.spare_parts,
      categoryName: 'Bikes',
    },
  ];

  const Electronics = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Electronics'},
    {id: 1, itemName: 'AC', image: images.ac, categoryName: 'Electronics'},
    {id: 2, itemName: 'TV', image: images.tv, categoryName: 'Electronics'},
    {
      id: 3,
      itemName: 'Fridge',
      image: images.fridge,
      categoryName: 'Electronics',
    },
    {
      id: 4,
      itemName: 'Washing Machine',
      image: images.washing_machine,
      categoryName: 'Electronics',
    },
    {
      id: 5,
      itemName: 'Coolers and Fans',
      image: images.cooler,
      categoryName: 'Electronics',
    },
    {
      id: 6,
      itemName: 'Kitchen Appliances',
      image: images.kitchen_appliances,
      categoryName: 'Electronics',
    },
    {
      id: 7,
      itemName: 'Laptop/Computer',
      image: images.laptop_computer,
      categoryName: 'Electronics',
    },
    {
      id: 8,
      itemName: 'Laptop/PC Accessories',
      image: images.laptop_accessories,
      categoryName: 'Electronics',
    },
    {
      id: 9,
      itemName: 'Camera and Lenses',
      image: images.camera,
      categoryName: 'Electronics',
    },
    {
      id: 10,
      itemName: 'Other Electronics',
      image: images.otherElectronics,
      categoryName: 'Electronics',
    },
  ];

  const Mobile = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Mobiles'},
    {id: 1, itemName: 'Mobile', image: images.mobile, categoryName: 'Mobiles'},
    {id: 2, itemName: 'Tablet', image: images.tablet, categoryName: 'Mobiles'},
    {
      id: 3,
      itemName: 'Accessories',
      image: images.accessories,
      categoryName: 'Mobiles',
    },
  ];

  const Poultry = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Poultry & Birds'},
    {
      id: 1,
      itemName: 'Chicken',
      image: images.chicken,
      categoryName: 'Poultry & Birds',
    },
    {
      id: 2,
      itemName: 'Fish',
      image: images.fish,
      categoryName: 'Poultry & Birds',
    },
    {
      id: 3,
      itemName: 'Birds',
      image: images.birds,
      categoryName: 'Poultry & Birds',
    },
  ];

  // categories with not sub categories but type

  const Jobs = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Jobs'},
    {id: 1, itemName: 'Farm Labour', image: icons.farmer, categoryName: 'Jobs'},
    {
      id: 2,
      itemName: 'Factory Woker',
      image: icons.factory_worker,
      categoryName: 'Jobs',
    },
    {
      id: 3,
      itemName: 'Building Construction',
      image: icons.building_construction,
      categoryName: 'Jobs',
    },
    {id: 4, itemName: 'Maid', image: icons.maid, categoryName: 'Jobs'},
    {id: 5, itemName: 'Driver', image: icons.driver, categoryName: 'Jobs'},
    {id: 6, itemName: 'Security', image: icons.security, categoryName: 'Jobs'},
    {id: 7, itemName: 'Cook', image: icons.cook, categoryName: 'Jobs'},
    {
      id: 8,
      itemName: 'Supervisor',
      image: icons.supervisor,
      categoryName: 'Jobs',
    },
    {id: 9, itemName: 'Teacher', image: icons.teacher, categoryName: 'Jobs'},
    {
      id: 10,
      itemName: 'Data Entry',
      image: icons.data_entry,
      categoryName: 'Jobs',
    },
    {
      id: 11,
      itemName: 'Sales & Marketing',
      image: icons.sales_marketing,
      categoryName: 'Jobs',
    },
    {id: 12, itemName: 'BPO', image: icons.bpo, categoryName: 'Jobs'},
    {
      id: 13,
      itemName: 'Office Assistant',
      image: icons.office_assistant,
      categoryName: 'Jobs',
    },
    {
      id: 14,
      itemName: 'Accountant',
      image: icons.accountant,
      categoryName: 'Jobs',
    },
    {
      id: 15,
      itemName: 'Operator & Technician',
      image: icons.operator_technician,
      categoryName: 'Jobs',
    },
    {
      id: 16,
      itemName: 'IT Engineer & Developer',
      image: icons.developer,
      categoryName: 'Jobs',
    },
    {id: 17, itemName: 'Designer', image: icons.designer, categoryName: 'Jobs'},
    {
      id: 18,
      itemName: 'Hotel & Restaurant',
      image: icons.hotel_restaurant,
      categoryName: 'Jobs',
    },
  ];

  const Matrimonial = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Matrimonial'},
    {
      id: 1,
      itemName: 'Groom',
      image: images.bride,
      categoryName: 'Matrimonial',
    },
    {
      id: 2,
      itemName: 'Bride',
      image: images.groom,
      categoryName: 'Matrimonial',
    },
  ];

  const Furniture = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Furniture'},
    {
      id: 1,
      itemName: 'Bed & Wardrobe',
      image: images.bed_wardrobe,
      categoryName: 'Furniture',
    },
    {
      id: 2,
      itemName: 'Sofa & Dining',
      image: images.sofa,
      categoryName: 'Furniture',
    },
    {
      id: 3,
      itemName: 'Home Decor',
      image: images.home_decor,
      categoryName: 'Furniture',
    },
    {
      id: 4,
      itemName: 'Kids & Furniture',
      image: images.kid_furniture,
      categoryName: 'Furniture',
    },
    {
      id: 5,
      itemName: 'Other Furnitures',
      categoryName: 'Furniture',
      image: images.otherFurniture,
    },
  ];

  const FarmMachines = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Farm Machine'},
    {
      id: 1,
      itemName: 'Threshers',
      image: images.threshers,
      categoryName: 'Farm Machine',
    },
    {
      id: 2,
      itemName: 'Crop Cutter',
      image: images.crop_cutter,
      categoryName: 'Farm Machine',
    },
    {
      id: 3,
      itemName: 'Power Thriller',
      image: images.power_thriller,
      categoryName: 'Farm Machine',
    },
    {
      id: 4,
      itemName: 'Trailor',
      image: images.trailer,
      categoryName: 'Farm Machine',
    },
    {
      id: 5,
      itemName: 'Cultivator',
      image: images.cultivator,
      categoryName: 'Farm Machine',
    },
    {
      id: 6,
      itemName: 'Harvesting & Machinery',
      image: images.harversting_machinery,
      categoryName: 'Farm Machine',
    },
    {
      id: 7,
      itemName: 'Sprayers',
      image: images.sprayer,
      categoryName: 'Farm Machine',
    },
    {
      id: 8,
      itemName: 'Ground Cover',
      image: images.ground_covers,
      categoryName: 'Farm Machine',
    },
    {
      id: 9,
      itemName: 'Boundary Fencing',
      image: images.boundry_fencing,
      categoryName: 'Farm Machine',
    },
    {
      id: 10,
      itemName: 'Other Farm Machinery',
      categoryName: 'Farm Machine',
      image: images.other_farmMachine,
    },
  ];

  const Services = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Services'},
    {
      id: 1,
      itemName: 'Education & Classes',
      image: images.education_classes,
      categoryName: 'Services',
    },
    {
      id: 2,
      itemName: 'Tour & Travels',
      image: images.tour_travels,
      categoryName: 'Services',
    },
    {
      id: 3,
      itemName: 'Electronic Repair & Services',
      image: images.electronic_repair_service,
      categoryName: 'Services',
    },
    {
      id: 4,
      itemName: 'Health & Beauty',
      image: images.health_beauty,
      categoryName: 'Services',
    },
    {
      id: 5,
      itemName: 'Home Renovation',
      image: images.homeRenovation_services,
      categoryName: 'Services',
    },
    {
      id: 6,
      itemName: 'Legal & Document Services',
      image: images.legal_documentServices,
      categoryName: 'Services',
    },
    {
      id: 7,
      itemName: 'Packers & Movers',
      image: images.packers_movers,
      categoryName: 'Services',
    },
    {
      id: 8,
      itemName: 'Other services',
      image: images.packers_movers,
      categoryName: 'Services',
    },
  ];

  const Fashion = [
    {id: 0, itemName: 'All', all: true, categoryName: 'Fashion'},
    {
      id: 1,
      itemName: 'Mens',
      image: images.mens_fashion,
      categoryName: 'Fashion',
    },
    {
      id: 2,
      itemName: 'Womens',
      image: images.womens_fahsion,
      categoryName: 'Fashion',
    },
    {
      id: 3,
      itemName: 'Kids',
      image: images.kids_fashion,
      categoryName: 'Fashion',
    },
  ];

  // distance calculation function

  const fetchCategoryData = async (
    id,
    categoryName,
    latitude,
    longitude,
    currentPage,
  ) => {
    // Show loading indicators
    if (currentPage > 1) {
      setBottomLoading(true);
    } else {
      setIsLoading(true);
    }

    setCategoryVisible(true);
    setSubCategoryVisible(false);
    setBoxId(id);

    try {
      // Construct the URL with the current page
      const url = `api/v1/listing/fetch/category/${categoryName}?page=${currentPage}&limit=20&userLatitude=${latitude}&userLongitude=${longitude}`;
      const {response, status} = await get(url);
      if (status === 200) {
        const responseData = response.response;
        // Get new items that are not duplicates
        const existingItems = new Set(itemsArray.map(item => item._id));
        const newItems = responseData.items.filter(
          item => !existingItems.has(item._id),
        );

        // Filter out deactivated items
        const activeItems = newItems.filter(item => !item.isDeactivate);

        // Sort by proximity if location is provided
        let sortedItems = activeItems;
        // Ensure no duplicates before updating the state
        setItemsArray(prevItems => {
          const combinedItems = [...prevItems, ...sortedItems];
          const uniqueItemsMap = new Map();
          combinedItems.forEach(item => {
            if (!uniqueItemsMap.has(item._id)) {
              uniqueItemsMap.set(item._id, item);
            }
          });
          return Array.from(uniqueItemsMap.values());
        });

        // Check if there are more items to fetch
        const totalPages = responseData.totalPages;
        const hasMoreItems = currentPage < totalPages;
        setHasMoreItems(hasMoreItems);

        // Update the page state only if more items are available
        if (hasMoreItems) {
          setPage(currentPage + 1);
        }
      } else {
        console.log(response, 'this is a failed response');
        console.log(status, 'status is not 200');
      }
    } catch (error) {
      console.log(`Error while fetching category data: ${error}`);
    }

    // Hide loading indicators
    setIsLoading(false);
    setBottomLoading(false);
  };

  const fetchData = async (
    id,
    productType,
    categoryName,
    latitude,
    longitude,
    currentPage,
    newSubcategory = false,
  ) => {
    currentPage = newSubcategory ? 1 : currentPage;

    if (currentPage > 1) {
      setBottomLoading(true);
    } else {
      setSubCategoryLoading(true);
    }

    setSubCategoryVisible(true);
    setCategoryVisible(false);
    setBoxId(id);
    try {
      const url = `api/v1/listing/fetch/${categoryName}/${encodeURIComponent(
        productType,
      )}?page=${currentPage}&limit=20&userLatitude=${latitude}&userLongitude=${longitude}`;
      const {response, status} = await get(url);
      if (status === 200) {
        const responseData = response.response;
        const activeItems = responseData.items.filter(
          item => !item.isDeactivate,
        );
        let sortedItems = activeItems;
        if (latitude !== null && longitude !== null) {
          // const sortedItems = await sortItemsByProximity(
          //   activeItems,
          //   latitude,
          //   longitude,
          // );
          let combinedItems = [];
          setSubcategoryItems(prevItems => {
            if (subCategoryPage === 1) {
              combinedItems = [sortedItems];
            } else if (subCategoryPage > 1) {
              combinedItems = [...prevItems, ...sortedItems];
            }
            const uniqueItemsMap = new Map();
            combinedItems.forEach(item => {
              if (!uniqueItemsMap.has(item._id)) {
                uniqueItemsMap.set(item._id, item);
              }
            });
            return Array.from(uniqueItemsMap.values());
          });
        }
        // Check if there are more items to fetch
        const totalPages = responseData.totalPages;
        const hasMoreItems = currentPage < totalPages;
        setHasMoreItems(hasMoreItems);

        // Update the page state only if more items are available
        if (hasMoreItems) {
          setSubCategoryPage(currentPage + 1);
        }
        setIsLoading(false);
      } else {
        console.log(response, 'this is failed response');
        console.log(
          status,
          response,
          'status is not 200 while fetching sub category',
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log(`error while fetching sub category items ${error}`);
    }
    setSubCategoryLoading(false);
    setBottomLoading(false);
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
          getUpdatedUser(userId); // Fetch the latest user data after liking
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

  // the second one
  const getUpdatedUser = async userId => {
    try {
      const url = 'api/v1/user/fetch/user';
      const body = {
        _id: userId,
      };
      const {response, status} = await post(url, body, true);
      if (status === 200) {
        const responseData = response.response;
        // const likedItemIds = responseData.likedItems.map(item => item._id);
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

  const renderCategoryItemBox = ({item}) => {
    return (
      <CategoriesItemBox
        itemName={item.itemName}
        image={item.image}
        all={item.all ? true : false}
        style={styles.mr12}
        onCardPress={() => {
          if (item.itemName === 'All') {
            setSubCategoryVisible(false);
            setCategoryVisible(true);
            setBoxId(0);
            setBoxCategoryName(item.categoryName);
            fetchCategoryData(
              item.id,
              item.categoryName,
              userLatitude,
              userLongitude,
              page,
            );
          } else {
            setCategoryVisible(false);
            setSubCategoryVisible(true);
            setBoxId(item.id);
            setBoxItemName(item.itemName);
            setSubCategoryPage(1);
            setSubcategoryItems([]);
            fetchData(
              item.id,
              item.itemName,
              item.categoryName,
              userLatitude,
              userLongitude,
              subCategoryPage,
              true,
            );
          }
        }}
        isActive={boxId === item.id}
      />
    );
  };

  const modifiedData = [...itemsArray];
  const adInterval = 6;
  for (let i = adInterval; i < modifiedData.length; i += adInterval + 1) {
    modifiedData.splice(i, 0, {type: 'bannerAd'});
  }


  const modifiedSubCategory = [...subCategoryItems.flat()];
  const subCategoryIntervalue = 8;
  for (
    let i = subCategoryIntervalue;
    i < modifiedSubCategory.length;
    i += subCategoryIntervalue + 1
  ) {
    modifiedSubCategory.splice(i, 0, {type: 'bannerAd'});
  }

  const renderAdsCard = ({item}) => {
    if (item.type === 'bannerAd') {
      return (
        <View style={{width: '100%'}}>
          <BannerAd
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
            unitId={`ca-app-pub-9372794286829313/2098479522`}
            // unitId={adUnitId}
          />
        </View>
      );
    }

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
        // onLikePress={() => likeItem(parentId, userId, 'parentId')}
        onLikePress={() => likeItem(parentId, userId)}
        isLikeLoading={isLikeLoading}
        isLiked={isLiked}
        firstImageUri={firstImage}
        distance={item.distance}
      />
    );
  };

  const renderSubCategory = ({item}) => {
    if (item.type === 'bannerAd') {
      return (
        <View style={{width: '100%'}}>
          <BannerAd
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
            unitId={`ca-app-pub-9372794286829313/1555554041`}
          />
        </View>
      );
    }

    const parentId = item._id;
    const itemData = item.item ? item.item : item.item[0];
    const isLikeLoading = loadingStates[parentId];
    const isLiked = likedStates[parentId] || false;
    // Filter media array to find the first image
    const imageFormats = ['jpg', 'jpeg', 'png'];
    const firstImage = itemData?.media
      ? itemData?.media?.find(mediaUrl =>
          imageFormats.some(format => mediaUrl.endsWith(format)),
        )
      : itemData[0]?.media?.find(mediaUrl =>
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
        // onLikePress={() => likeItem(parentId, userId, 'parentId')}
        onLikePress={() => likeItem(parentId, userId)}
        isLikeLoading={isLikeLoading}
        isLiked={isLiked}
        firstImageUri={firstImage}
        distance={item.distance}
      />
    );
  };

  const renderHorizontalFlatList = data => (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={renderCategoryItemBox}
      horizontal
    />
  );

  const renderFooter = () => {
    if (!bottomLoading) return null;
    return (
      <View style={[styles.pdv12]}>
        <ActivityIndicator size="small" color={colors.mintGreen} />
      </View>
    );
  };


  return (
    <SafeAreaView style={[{flex: 1}, styles.pdh16]}>
      <TitleHeader title={title} onBackPress={() => navigation.pop()} />
      <View
        style={[
          {
            borderBottomWidth: 1,
            width: '200%',
            alignSelf: 'center',
            opacity: 0.2,
          },
        ]}></View>
      <View style={[{height: 100, width: '100%'}, styles.mt8]}>
        {title === 'Vehicle for Sale' && renderHorizontalFlatList(Vehicles)}
        {title === 'Vehicle for Rent' && renderHorizontalFlatList(VehiclesRent)}
        {title === 'Property for Sale' && renderHorizontalFlatList(Property)}
        {title === 'Property for Rent' &&
          renderHorizontalFlatList(PropertiesRent)}
        {title === 'Mobile' && renderHorizontalFlatList(Mobile)}
        {title === 'Bike' && renderHorizontalFlatList(Bikes)}
        {title === 'Electronics' && renderHorizontalFlatList(Electronics)}
        {title === 'Jobs' && renderHorizontalFlatList(Jobs)}
        {title === 'Matrimonial' && renderHorizontalFlatList(Matrimonial)}
        {title === 'Furniture' && renderHorizontalFlatList(Furniture)}
        {title === 'Animal' && renderHorizontalFlatList(Animals)}
        {title === 'Poultry & Birds' && renderHorizontalFlatList(Poultry)}
        {title === 'Farm Machines' && renderHorizontalFlatList(FarmMachines)}
        {title === 'Services' && renderHorizontalFlatList(Services)}
        {title === 'Fashion' && renderHorizontalFlatList(Fashion)}
      </View>

      <FilterBox label={title} style={[styles.mt12]} />
      <View
        style={[
          {
            flex: itemsArray.length > 0 ? 1 : 0,
            width: '100%',
          },
          styles.mt12,
        ]}>
        {categoryVisible && itemsArray && itemsArray.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={modifiedData}
            renderItem={renderAdsCard}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  fetchCategoryData(0, title, userLatitude, userLongitude, 1);
                }}
                colors={[colors.mintGreen]}
              />
            }
            numColumns={2}
            onEndReached={() => {
              if (hasMoreItem && !loading) {
                fetchCategoryData(
                  boxId,
                  title,
                  userLatitude,
                  userLongitude,
                  page,
                );
              }
            }}
            ListFooterComponent={renderFooter}
          />
        )}

        {subCategoryVisible &&
          subCategoryItems &&
          subCategoryItems.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              // data={flatSubcategory}
              data={modifiedSubCategory}
              renderItem={({item}) => {
                return renderSubCategory({item});
              }}
              keyExtractor={item => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={subCategoryLoading}
                  onRefresh={() => {
                    fetchData(
                      boxId,
                      boxCategoryName,
                      title,
                      userLatitude,
                      userLongitude,
                      1,
                    );
                  }}
                  colors={[colors.mintGreen]}
                />
              }
              numColumns={2}
              onEndReached={() => {
                if (hasMoreItem && !loading) {
                  fetchData(
                    boxId,
                    boxItemName,
                    title,
                    userLatitude,
                    userLongitude,
                    subCategoryPage,
                  );
                }
              }}
              ListFooterComponent={renderFooter}
            />
          )}

        {loading && itemsArray.length === 0 && categoryVisible && (
          <ActivityIndicator
            size={'large'}
            color={colors.darkGrey}
            style={[{marginTop: 200}]}
          />
        )}
        {subCategoryLoading &&
          subCategoryItems.length === 0 &&
          subCategoryVisible && (
            <ActivityIndicator
              size={'large'}
              color={colors.darkGrey}
              style={[{marginTop: 200}]}
            />
          )}
        {!loading && !subCategoryLoading && itemsArray.length === 0 && (
          <Text
            style={[
              {marginTop: 200, textAlign: 'center', color: colors.grey800},
              styles.ts18,
            ]}>
            No Items Available
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductsListing;
