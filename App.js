import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, Platform, PermissionsAndroid, Linking} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {
  Home,
  AllCategories,
  ProductsListing,
  SelectOption,
  ChangeLocation,
} from './src/screens/home';
import {Chats, ChatScreen, NewChatScreen} from './src/screens/chats';
import {
  AddNewListing,
  SubCategory,
  Media,
  ListingLocation,
  Login,
} from './src/screens/addNewListing';
import {MyAds, EditMyAds} from './src/screens/myAds';
import {Profile, ChangeInfo, PrivacyPolicy} from './src/screens/profile';
import {
  FirstScreen,
  Location,
  MobileNumber,
  OtpScreen,
  NameScreen,
  ChooseLocation,
} from './src/screens/auth';
import {VehicleSale, VehicleRent} from './src/screens/addNewListing/vehicle';
import {Mobile, Tablet, Accessories} from './src/screens/addNewListing/Mobile';
import {
  Bike_Scooty,
  Bicycle,
  SpareParts,
} from './src/screens/addNewListing/Bike';
import {Job, Selection} from './src/screens/addNewListing/Jobs';
import {Matrimonial} from './src/screens/addNewListing/Matrimonial';
import {Furniture} from './src/screens/addNewListing/Furniture';
import {FarmMachine} from './src/screens/addNewListing/FarmMachines';
import {Services} from './src/screens/addNewListing/Services';
import {Fashion} from './src/screens/addNewListing/Fashion';
import {Fish, Bird, Chicken} from './src/screens/addNewListing/PoultryBirds';
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

import {ViewAd, ViewAdInfo, AdsMedia} from './src/screens/ViewAd';
import {
  PropertySale,
  PropertyRent,
  LandSale,
  Hostel,
} from './src/screens/addNewListing/property';
import {SocketProvider} from './src/utils/SocketContext';
import {MobileAds} from 'react-native-google-mobile-ads';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();
const App = () => {

  const NAVIGATION_IDS = ["Chats"];

function buildDeepLinkFromNotificationData(data){
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId)
    return null;
  }
  if (navigationId === 'Chats') {
    return 'myapp://Chats';
  }
  return null
}


const linking = {
  prefixes: ["myapp://"],
  config: {
    screens  : {
      Chats : "Chats"
    }
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({url}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data)
      if (typeof url === 'string') {
        listener(url)
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  }
};

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Google Mobile Ads SDK initialized');
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {title, body} = remoteMessage.notification;
    });
    return unsubscribe;
  }, []);


  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  StatusBar.setBackgroundColor('black');
  return (
    <SocketProvider>
      <NavigationContainer linking={linking} >
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="FirstScreen">
          <Stack.Screen name="FirstScreen" component={FirstScreen} />
          <Stack.Screen name="MobileNumber" component={MobileNumber} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen name="NameScreen" component={NameScreen} />
          <Stack.Screen name="Location" component={Location} />
          <Stack.Screen name="ChooseLocation" component={ChooseLocation} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AllCategories" component={AllCategories} />
          <Stack.Screen name="ChangeLocation" component={ChangeLocation} />

          <Stack.Screen name="SelectOption" component={SelectOption} />
          <Stack.Screen name="ProductsListing" component={ProductsListing} />
          <Stack.Screen name="Chats" component={Chats} />
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

          {/* For Property */}
          <Stack.Screen name="PropertySale" component={PropertySale} />
          <Stack.Screen name="PropertyRent" component={PropertyRent} />
          <Stack.Screen name="LandSale" component={LandSale} />
          <Stack.Screen name="Hostel" component={Hostel} />

          {/* for animals */}
          <Stack.Screen name="CowBuffalo" component={CowBuffalo} />
          <Stack.Screen name="Bull" component={Bull} />
          <Stack.Screen name="GoatSheep" component={Sheep_Goat} />
          <Stack.Screen name="HorseCat" component={HorseCat} />
          <Stack.Screen name="Dog" component={Dog} />
          <Stack.Screen name="Donkey" component={Donkey} />
          <Stack.Screen name="OtherAnimals" component={OtherAnimals} />

          {/* for vehicle */}
          <Stack.Screen name="VehicleSale" component={VehicleSale} />
          <Stack.Screen name="VehicleRent" component={VehicleRent} />

          {/*  for mobile  */}
          <Stack.Screen name="Mobile" component={Mobile} />
          <Stack.Screen name="Tablet" component={Tablet} />
          <Stack.Screen name="Accessories" component={Accessories} />

          {/* for bikes */}
          <Stack.Screen name="Bike_Scooty" component={Bike_Scooty} />
          <Stack.Screen name="Bicycle" component={Bicycle} />
          <Stack.Screen name="SpareParts" component={SpareParts} />

          {/* for jobs */}
          <Stack.Screen name="Job" component={Job} />
          <Stack.Screen name="Selection" component={Selection} />

          {/* for matrimonial */}
          <Stack.Screen name="Matrimonial" component={Matrimonial} />

          {/* For furniture */}
          <Stack.Screen name="Furniture" component={Furniture} />

          {/* for farm machines */}
          <Stack.Screen name="FarmMachine" component={FarmMachine} />

          {/* for services */}
          <Stack.Screen name="Services" component={Services} />

          {/* for Fashion */}
          <Stack.Screen name="Fashion" component={Fashion} />

          {/* for poultry bird */}
          <Stack.Screen name="Bird" component={Bird} />
          <Stack.Screen name="Chicken" component={Chicken} />
          <Stack.Screen name="Fish" component={Fish} />

          {/* for electronics */}
          <Stack.Screen name="ACFridge" component={ACFridge} />
          <Stack.Screen
            name="TV_WashingMachine"
            component={TV_WashingMachine}
          />
          <Stack.Screen
            name="CoolerFan_KitchenAppliances"
            component={CoolerFan_KitchenAppliances}
          />
          <Stack.Screen name="LaptopComputer" component={LaptopComputer} />
          <Stack.Screen
            name="ComputerAccessories"
            component={ComputerAccessories}
          />
          <Stack.Screen name="CameraLense" component={CameraLense} />
          <Stack.Screen name="OtherElectronics" component={OtherElectronics} />
          <Stack.Screen name="MyAds" component={MyAds} />
          <Stack.Screen name="EditMyAds" component={EditMyAds} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
};
export default App;
