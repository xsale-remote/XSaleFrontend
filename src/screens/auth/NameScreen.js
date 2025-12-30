
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import { Button, TitleInput } from '../../component/shared';
import { post, uploadMediaToServer } from '../../utils/requestBuilder';
import { UploadModal } from '../../component/shared';
import icons from '../../assets/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { get } from '../../utils/requestBuilder';

const NameScreen = ({ navigation, route }) => {
  const { addressInfo, fullAddress, receivedMobileNumber } = route.params || {};
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [addressInformation, setAddressInformation] = useState('');
  const [readableAddress, setReadableAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [FCMToken, setFCMToken] = useState('');
  const [showAd, setShowAd] = useState(false); 

  useEffect(() => {
    checkAdShow();
  }, []);

  const checkAdShow = async () => {
    try {
      const url = `api/v1/user/showAd/name-screen`;
      const { response, status } = await get(url);
      if (status === 200) {
        setShowAd(response.response);
      }
    } catch (error) {
      console.log('Error checking ad show:', error);
      setShowAd(false); // Default to false on error
    }
  };

  useEffect(() => {
    setAddressInformation(addressInfo);
    setReadableAddress(fullAddress);
    setMobileNumber(receivedMobileNumber);
    getToken();
  }, []);

  const handleNameChange = input => {
    const regex = /^[a-zA-Z\s]*$/;
    if (regex.test(input)) {
      setName(input);
    }
  };

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      setFCMToken(token);
    } catch (error) {
      console.log(`error while getting token ${error}`);
    }
  };

  const showInterstitialAd = () => {
    return new Promise((resolve) => {
      const interstitialAdUnitId = 'ca-app-pub-9372794286829313/2371673194';
      const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId);
      
      let adLoaded = false;
      let adShown = false;

      // Set a timeout to handle cases where ad never loads
      const adTimeout = setTimeout(() => {
        console.log('Ad loading timeout - no inventory');
        cleanupAdListeners();
        resolve(true); 
      }, 8000); 

      const unsubscribeLoad = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('Interstitial ad loaded');
          adLoaded = true;
          clearTimeout(adTimeout); // Clear timeout since ad loaded
          interstitial.show();
        },
      );

      const unsubscribeShow = interstitial.addAdEventListener(
        AdEventType.OPENED,
        () => {
          console.log('Interstitial ad shown');
          adShown = true;
        },
      );

      const unsubscribeClose = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('Interstitial ad closed');
          cleanupAdListeners();
          resolve(true);
        },
      );

      const unsubscribeError = interstitial.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.log('Interstitial ad error:', error);
          cleanupAdListeners();
          clearTimeout(adTimeout);
          resolve(true); // Still resolve so navigation continues
        },
      );

      const cleanupAdListeners = () => {
        unsubscribeLoad();
        unsubscribeShow();
        unsubscribeClose();
        unsubscribeError();
      };

      // Load the ad
      interstitial.load();
    });
  };

  const createNewUser = async () => {
    if (name.length < 3) {
      setNameError(true);
      return;
    }

    setLoading(true);
    const { city, pincode, state, latitude, longitude, country } = addressInformation;
    const body = {
      userName: name,
      phoneNumber: receivedMobileNumber,
      profilePicture: profilePictureURL,
      currentAddress: readableAddress,
      location: {
        fullAdddress: readableAddress,
        city,
        state,
        pincode,
        country,
        latitude,
        longitude,
      },
      FCMToken,
    };

    try {
      const url = 'api/v1/user/register';
      const { response, status } = await post(url, body);

      if (status === 201) {
        try {
          const jsonString = JSON.stringify(response.response);
          await EncryptedStorage.setItem('userData', jsonString);

          if (showAd === true) {
            await showInterstitialAd();
          }

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            }),
          );

        } catch (error) {
          console.log(`error while saving the user in the storage ${error}`);
          setLoading(false);
        }
      } else {
        console.log(response, status);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setLoading(false);
    }
  };

  const selectImageFromGallery = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        const imageInfoObject = [selectedImage];
        setUploadModalVisible(false);
        setProfileUploading(true);
        const serverResponse = await uploadMediaToServer(imageInfoObject);
        if (serverResponse.status === 200) {
          console.log('Profile picture uploaded successfully');
          console.log(serverResponse.response.response[0]);
          setProfileUploading(false);
          setProfilePictureURL(serverResponse.response.response[0]);
        } else {
          console.log(
            'Status is not 200 while uploading profile picture ',
            serverResponse.status,
          );
        }
      } else {
        console.error('No images selected from gallery');
      }
    } catch (err) {
      console.error('Error selecting image from gallery:', err);
    }
    setProfileUploading(false);
    setUploadModalVisible(false);
  };

  const takePhotoWithCamera = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const response = await launchCamera(options);
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
        ToastAndroid.showWithGravityAndOffset(
          'Unable to access camera. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        const imageInfoObject = [selectedImage];
        setUploadModalVisible(false);
        setProfileUploading(true);
        const serverResponse = await uploadMediaToServer(imageInfoObject);

        if (serverResponse.status === 200) {
          console.log('Profile picture uploaded successfully');
          console.log(serverResponse.response.response[0]);
          setProfilePictureURL(serverResponse.response.response[0]);
          setProfileUploading(false);
        } else {
          console.log(
            'Status is not 200 while uploading profile picture ',
            serverResponse.status,
          );
        }
      }
    } catch (error) {
      console.error('Error selecting image from camera:', error);
    }

    setProfileUploading(false);
    setUploadModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.pdh16, { flex: 1 }]}>
      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <View
          style={[
            { justifyContent: 'left', alignItems: 'left', marginTop: '13%' },
          ]}>
          <Text
            style={[
              styles.mb8,
              { fontSize: 30, color: colors.black, textAlign: 'center' },
              styles.fw400,
            ]}>
            Welcome to{' '}
            <Text
              style={[
                styles.mb8,
                { fontSize: 30, color: colors.black, textAlign: 'center' },
                styles.fwBold,
              ]}>
              XSale
            </Text>
          </Text>
        </View>

        <View
          style={[
            { alignItems: 'center', alignSelf: 'center', marginTop: '2%' },
          ]}>
          {profileUploading ? (
            <ActivityIndicator size={'small'} color={colors.mintGreen} />
          ) : (
            <TouchableOpacity
              onPress={() => setUploadModalVisible(!uploadModalVisible)}
              style={[{ borderWidth: 1, borderRadius: 50, overflow: 'hidden' }]}>
              <Image
                source={
                  profilePictureURL ? { uri: profilePictureURL } : icons.avatar
                }
                style={[
                  styles.icon16,
                  { height: 100, width: 100, resizeMode: 'cover' },
                ]}
              />
            </TouchableOpacity>
          )}
          <Text style={[styles.h4, styles.mt12, { color: colors.black }]}>
            Upload profile picture
          </Text>
        </View>

        <View style={[{ marginTop: '5%' }]}>
          <TitleInput
            inputPlaceholder={'Enter here'}
            title={'Name'}
            boxStyle={nameError ? styles.mb12 : styles.mb36}
            value={name}
            setValue={handleNameChange}
          />
          {nameError && (
            <Text style={[{ color: colors.red }, styles.mt4, styles.mb24]}>
              Name must be a minimum of three characters. Please provide a valid
              name.
            </Text>
          )}
          <Button
            label={
              loading ? (
                <ActivityIndicator size={'small'} color={colors.white} />
              ) : (
                'Continue'
              )
            }
            style={[{ alignItems: 'center' }, styles.mb24]}
            onPress={createNewUser}
            disable={profileUploading || loading}
            isLoading={loading}
          />
        </View>
      </View>

      {/* Bottom Sticky Banner Ad */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignSelf: 'center',
        }}>
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={'ca-app-pub-9372794286829313/1710520186'}
          onAdFailedToLoad={error => {
            console.log('Ad failed to load:', error);
          }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully');
          }}
        />
      </View>

      <UploadModal
        label={'Upload Image'}
        isVisible={uploadModalVisible}
        close={() => setUploadModalVisible(!uploadModalVisible)}
        openCamera={takePhotoWithCamera}
        openGallery={selectImageFromGallery}
      />
    </SafeAreaView>
  );
};

export default NameScreen;