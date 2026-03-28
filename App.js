
import React, { useEffect, useRef, useState } from 'react';
import { AppState, StatusBar, Platform, Linking } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { enableScreens } from 'react-native-screens';
import { MobileAds, AppOpenAd, AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { admobHomeInterstitial } from './src/utils/env';
import SplashScreen from 'react-native-splash-screen';
import EncryptedStorage from 'react-native-encrypted-storage';
import DeviceInfo from 'react-native-device-info';
import { Settings, AppEventsLogger } from 'react-native-fbsdk-next';

import { getUserInfo } from './src/utils/function';
import { get, post } from './src/utils/requestBuilder';
import { logAppOpen, logEvent, logScreenView } from './src/utils/analytics';

import {
  AllCategories,
  ProductsListing,
  SelectOption,
  ChangeLocation,
  SearchScreen
} from './src/screens/home';
import { ChatScreen, NewChatScreen } from './src/screens/chats';
import {
  AddNewListing,
  SubCategory,
  Media,
  ListingLocation,
  Login,
} from './src/screens/addNewListing';
import { EditMyAds } from './src/screens/myAds';
import { ChangeInfo, PrivacyPolicy } from './src/screens/profile';
import MainTabs from './src/navigation/MainTabs';
import {
  Location,
  MobileNumber,
  OtpScreen,
  NameScreen,
  ChooseLocation,
} from './src/screens/auth';
import { VehicleSale, VehicleRent } from './src/screens/addNewListing/vehicle';
import { Mobile, Tablet, Accessories } from './src/screens/addNewListing/Mobile';
import { Bike_Scooty, Bicycle, SpareParts } from './src/screens/addNewListing/Bike';
import { Job, Selection } from './src/screens/addNewListing/Jobs';
import { Matrimonial } from './src/screens/addNewListing/Matrimonial';
import { Furniture } from './src/screens/addNewListing/Furniture';
import { FarmMachine } from './src/screens/addNewListing/FarmMachines';
import { Services } from './src/screens/addNewListing/Services';
import { Fashion } from './src/screens/addNewListing/Fashion';
import { Fish, Bird, Chicken } from './src/screens/addNewListing/PoultryBirds';
import {
  ACFridge,
  TV_WashingMachine,
  CoolerFan_KitchenAppliances,
  LaptopComputer,
  ComputerAccessories,
  CameraLense,
  OtherElectronics,
} from './src/screens/addNewListing/Electronics';
import {
  Bull,
  Sheep_Goat,
  HorseCat,
  Dog,
  Donkey,
  CowBuffalo,
  OtherAnimals,
} from './src/screens/addNewListing/Animal';
import { ViewAd, ViewAdInfo, AdsMedia } from './src/screens/ViewAd';
import {
  PropertySale,
  PropertyRent,
  LandSale,
  Hostel,
} from './src/screens/addNewListing/property';
import UpdateModal from './src/component/shared/UpdateModal';

enableScreens();
const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();
const TRACKED_SCREENS = ['Home', 'Chats', 'MyAds', 'Profile', 'ViewAd', 'ViewAdInfo'];

const APP_OPEN_AD_UNIT_ID =
  "ca-app-pub-9372794286829313/7384304648"

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('MobileNumber');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const NAVIGATION_IDS = ['Chats'];
  const appState = useRef(AppState.currentState);
  const sessionStartTime = useRef(Date.now());

  // ── Initialization ──────────────────────────────────────────────────────
  // Runs while native splash (launch_screen.xml) is visible.
  // Determines where to navigate, then hides the splash.
  useEffect(() => {
    const initialize = async () => {
      try {
        const [appVersion, userInfo] = await Promise.all([
          DeviceInfo.getVersion(),
          getUserInfo(),
        ]);

        // If user is logged in, go to home
        if (userInfo) {
          setInitialRoute('MainTabs');
        }

        // Show app immediately
        setIsReady(true);
        SplashScreen.hide();

        // Show interstitial every 3rd app open for logged-in users
        if (userInfo) {
          const raw = await AsyncStorage.getItem('app_open_count');
          const count = (parseInt(raw) || 0) + 1;
          await AsyncStorage.setItem('app_open_count', String(count));
          console.log('[Interstitial] raw:', raw, '| count:', count, '| count % 3:', count % 3, '| will show ad:', count % 3 === 0);
          if (count % 3 === 0) {
            const interstitial = InterstitialAd.createForAdRequest(admobHomeInterstitial);
            let shown = false;
            const safeClose = () => { if (!shown) { shown = true; } };
            const timeout = setTimeout(safeClose, 6000);
            interstitial.addAdEventListener(AdEventType.LOADED, () => { console.log('[Interstitial] Ad loaded, showing...'); interstitial.show(); });
            interstitial.addAdEventListener(AdEventType.CLOSED, () => { console.log('[Interstitial] Ad closed'); clearTimeout(timeout); safeClose(); });
            interstitial.addAdEventListener(AdEventType.ERROR, (error) => { console.log('[Interstitial] Ad error:', error); clearTimeout(timeout); safeClose(); });
            interstitial.load();
          }
        }

        // All background tasks after splash is gone
        Settings.initializeSDK();
        AppEventsLogger.logEvent('fb_mobile_activate_app');

        const fcmToken = await messaging().getToken().catch(() => null);
        if (userInfo && fcmToken) {
          const { _id } = userInfo.user;
          updateFCMToken(_id, fcmToken);
        }

        const { response } = await get('api/v1/user/fetch/app-version');
        const latestVersion = response.response;
        const isLatest = appVersion === latestVersion;

        if (!isLatest) {
          setShowUpdateModal(true);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setIsReady(true);
        SplashScreen.hide();
      }
    };

    initialize();
  }, []);

  // ── FCM Token sync ──────────────────────────────────────────────────────
  const updateFCMToken = async (userId, FCMToken) => {
    try {
      const body = { userId, FCMToken };
      const url = 'api/v1/user/handle/fcm-token';
      const { response, status } = await post(url, body);
      if (status === 200) {
        const responseData = response.response;
        if (responseData.toUpdate === true) {
          const newToken = responseData.token;
          let userData = JSON.parse(await EncryptedStorage.getItem('userData'));
          if (userData) {
            userData.FCMToken = newToken;
            userData.user.FCMToken = newToken;
            await EncryptedStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      }
    } catch (error) {
      console.log('FCM token update error:', error);
    }
  };

  // ── Deep linking ────────────────────────────────────────────────────────
  function buildDeepLinkFromNotificationData(data) {
    const navigationId = data?.navigationId;
    if (!NAVIGATION_IDS.includes(navigationId)) {
      console.warn('Unverified navigationId', navigationId);
      return null;
    }
    if (navigationId === 'Chats') return 'myapp://Chats';
    return null;
  }

  const linking = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        MainTabs: {
          screens: { Chats: 'Chats' },
        },
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      if (typeof url === 'string') {
        logAppOpen('deep_link', { url });
        return url;
      }
      const message = await messaging().getInitialNotification();
      if (message) {
        const source = message.data?.navigationId === 'Chats'
          ? 'chat_notification'
          : 'daily_notification';
        logAppOpen(source);
        const deeplinkURL = buildDeepLinkFromNotificationData(message.data);
        if (typeof deeplinkURL === 'string') return deeplinkURL;
        return;
      }
      logAppOpen('direct');
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }) => listener(url);
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        const source = remoteMessage.data?.navigationId === 'Chats'
          ? 'chat_notification'
          : 'daily_notification';
        logAppOpen(source);
        const url = buildDeepLinkFromNotificationData(remoteMessage.data);
        if (typeof url === 'string') listener(url);
      });
      return () => {
        linkingSubscription.remove();
        unsubscribe();
      };
    },
  };

  useEffect(() => {
    const subscribeOnce = async () => {
      const subscribed = await AsyncStorage.getItem('xsale_daily_subscribed');
      if (!subscribed) {
        await messaging().subscribeToTopic('xsale_daily');
        await AsyncStorage.setItem('xsale_daily_subscribed', 'true');
      }
    };
    subscribeOnce();
  }, [])

  // ── Session duration tracking ────────────────────────────────────────────
  useEffect(() => {
    const handleSessionTracking = (nextAppState) => {
      const prev = appState.current;
      if (prev === 'active' && nextAppState === 'background') {
        const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        if (duration > 7) {
          logEvent('session_end', { session_duration_seconds: duration });
        }
      }
      if (prev.match(/inactive|background/) && nextAppState === 'active') {
        sessionStartTime.current = Date.now();
      }
    };
    const subscription = AppState.addEventListener('change', handleSessionTracking);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        console.log('Google Mobile Ads SDK initialized');
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification;
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const appOpenAd = AppOpenAd.createForAdRequest(APP_OPEN_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    let adLoaded = false;
    let adDisplayed = false;

    const loadAd = () => {
      if (!adLoaded) {
        appOpenAd.load();
      }
    };

    const handleAdLoaded = () => {
      adLoaded = true;
      appOpenAd.show();
      adDisplayed = true;
    };

    const handleAdError = (err) => {
      adLoaded = false;
    };

    const handleAppStateChange = nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        loadAd();
      }
      appState.current = nextAppState;
    };

    const loadedListener = appOpenAd.addAdEventListener(AdEventType.LOADED, handleAdLoaded);
    const errorListener = appOpenAd.addAdEventListener(AdEventType.ERROR, handleAdError);

    loadAd();

    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      loadedListener();
      errorListener();
      appStateListener.remove();
    };
  }, []);

  StatusBar.setBackgroundColor('black');

  // While init runs, render nothing — native splash is visible
  if (!isReady) {
    return null;
  }

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onStateChange={() => {
          const currentScreen = navigationRef.getCurrentRoute()?.name;
          if (TRACKED_SCREENS.includes(currentScreen)) {
            logScreenView(currentScreen);
          }
        }}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialRoute}>
            <Stack.Screen name="MobileNumber" component={MobileNumber} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="NameScreen" component={NameScreen} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name='SearchScreen' component={SearchScreen} />
            <Stack.Screen name="AllCategories" component={AllCategories} />
            <Stack.Screen name="ChangeLocation" component={ChangeLocation} />
            <Stack.Screen name="SelectOption" component={SelectOption} />
            <Stack.Screen name="ProductsListing" component={ProductsListing} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="NewChatScreen" component={NewChatScreen} />
            <Stack.Screen name="AddNewListing" component={AddNewListing} />
            <Stack.Screen name="SubCategory" component={SubCategory} />
            <Stack.Screen name="Media" component={Media} />
            <Stack.Screen name="ListingLocation" component={ListingLocation} />
            <Stack.Screen name="ViewAd" component={ViewAd} />
            <Stack.Screen name="ViewAdInfo" component={ViewAdInfo} />
            <Stack.Screen name="AdsMedia" component={AdsMedia} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="PropertySale" component={PropertySale} />
            <Stack.Screen name="PropertyRent" component={PropertyRent} />
            <Stack.Screen name="LandSale" component={LandSale} />
            <Stack.Screen name="Hostel" component={Hostel} />
            <Stack.Screen name="CowBuffalo" component={CowBuffalo} />
            <Stack.Screen name="Bull" component={Bull} />
            <Stack.Screen name="GoatSheep" component={Sheep_Goat} />
            <Stack.Screen name="HorseCat" component={HorseCat} />
            <Stack.Screen name="Dog" component={Dog} />
            <Stack.Screen name="Donkey" component={Donkey} />
            <Stack.Screen name="OtherAnimals" component={OtherAnimals} />
            <Stack.Screen name="VehicleSale" component={VehicleSale} />
            <Stack.Screen name="VehicleRent" component={VehicleRent} />
            <Stack.Screen name="Mobile" component={Mobile} />
            <Stack.Screen name="Tablet" component={Tablet} />
            <Stack.Screen name="Accessories" component={Accessories} />
            <Stack.Screen name="Bike_Scooty" component={Bike_Scooty} />
            <Stack.Screen name="Bicycle" component={Bicycle} />
            <Stack.Screen name="SpareParts" component={SpareParts} />
            <Stack.Screen name="Job" component={Job} />
            <Stack.Screen name="Selection" component={Selection} />
            <Stack.Screen name="Matrimonial" component={Matrimonial} />
            <Stack.Screen name="Furniture" component={Furniture} />
            <Stack.Screen name="FarmMachine" component={FarmMachine} />
            <Stack.Screen name="Services" component={Services} />
            <Stack.Screen name="Fashion" component={Fashion} />
            <Stack.Screen name="Bird" component={Bird} />
            <Stack.Screen name="Chicken" component={Chicken} />
            <Stack.Screen name="Fish" component={Fish} />
            <Stack.Screen name="ACFridge" component={ACFridge} />
            <Stack.Screen name="TV_WashingMachine" component={TV_WashingMachine} />
            <Stack.Screen name="CoolerFan_KitchenAppliances" component={CoolerFan_KitchenAppliances} />
            <Stack.Screen name="LaptopComputer" component={LaptopComputer} />
            <Stack.Screen name="ComputerAccessories" component={ComputerAccessories} />
            <Stack.Screen name="CameraLense" component={CameraLense} />
            <Stack.Screen name="OtherElectronics" component={OtherElectronics} />
            <Stack.Screen name="EditMyAds" component={EditMyAds} />
            <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          </Stack.Navigator>
      </NavigationContainer>
      {showUpdateModal && <UpdateModal />}
    </>
  );
};

export default App;
