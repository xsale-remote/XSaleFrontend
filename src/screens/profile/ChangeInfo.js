import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Pressable,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, TitleInput, Button} from '../../component/shared';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import {UploadModal, UploadCameraView} from '../../component/shared';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import colors from '../../assets/colors';
import {post, put, uploadMediaToServer} from '../../utils/requestBuilder';
import {getUserInfo} from '../../utils/function';
import EncryptedStorage from 'react-native-encrypted-storage';

const ChageInfo = ({navigation}) => {
  const {height} = Dimensions.get('window');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [profileUploading, setProfileUploading] = useState(false);

  const [nameEmpty, setNameEmpty] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneNumberEmpty, setPhoneNumberEmpty] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const userData = await getUserInfo();
      if (userData) {
        const {_id, profilePicture, phoneNumber, userName} = userData.user;
        setName(userName);
        setUserId(_id);
        setPhoneNumber(phoneNumber);
        setProfilePictureURL(profilePicture);
      } else {
        console.log('Unbale to fetch user data');
      }
    } catch (error) {
      console.log(
        `error while fetching user data from update profile ${error}`,
      );
    }
  };

  const handleInputChange = (text, type) => {
    if (type == 'name') {
      const regex = /^[a-zA-Z\s]*$/;
      if (regex.test(text)) {
        setName(text);
        setNameEmpty(false);
        if (text.length >= 3) {
          setNameError(false);
        }
      }
    } else if (type === 'phoneNumber') {
      const numericText = text.replace(/[^0-9]/g, '');
      setPhoneNumber(numericText);
      setPhoneNumberEmpty(false);
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
        const sererResponse = await uploadMediaToServer(imageInfoObject);
        if (sererResponse.status === 200) {
          console.log('profile picture upload successfully');
          console.log(sererResponse.response.response[0]);
          setProfileUploading(false);
          setProfilePictureURL(sererResponse.response.response[0]);
        } else {
          console.log(
            'status is not 200 while uploading profile picture ',
            sererResponse.status,
          );
        }
      } else {
        console.error('No images selected from gallery');
        // Handle the case where no image was selected
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
        const sererResponse = await uploadMediaToServer(imageInfoObject);

        if (sererResponse.status === 200) {
          console.log('profile picture upload successfully');
          console.log(sererResponse.response.response[0]);
          setProfilePictureURL(sererResponse.response.response[0]);
          setProfileUploading(false);
        } else {
          console.log(
            'status is not 200 while uploading profile picture ',
            status,
          );
        }
      }
    } catch (error) {
      console.error('Error selecting image from camera:', error);
    }

    setProfileUploading(false);
    setUploadModalVisible(false);
  };

  const handleInfoChange = async () => {
    setLoading(true);
    if (!name && phoneNumber.toString().length !== 10) {
      setLoading(false);
      setPhoneNumberEmpty(true);
      setNameEmpty(true);
    } else if (!name) {
      setNameEmpty(true);
    } else if (name.length < 3) {
      setNameEmpty(false);
      setNameError(true);
    } else if (
      !phoneNumber.toString() ||
      phoneNumber.toString().length !== 10
    ) {
      setPhoneNumberEmpty(true);
    } else {
      try {
        const url = 'api/v1/user/update/user-update';
        const body = {
          userId,
          userName: name,
          phoneNumber,
          profilePicture: profilePictureURL,
        };
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          try {
            const jsonString = JSON.stringify(response.response);
            const storedData = await EncryptedStorage.setItem(
              'userData',
              jsonString,
            );
            ToastAndroid.showWithGravityAndOffset(
              'profile updated successfully',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            navigation.pop();
          } catch (error) {
            console.log(`error while saving the user in the storage ${error}`);
            setLoading(false);
          }
        } else if (status !== 200) {
          console.log(response, status, 'while updating user ');
          setLoading(false);
        }
      } catch (error) {
        console.log(`error while updating user info ${error}`);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[{height: height * 1, width: '100%'}, styles.pdh16]}>
      <TitleHeader title={'Profile'} onBackPress={() => navigation.pop()} />
      <View style={[{borderBottomWidth: 1, opacity: 0.2}]}></View>
      <View
        style={[
          {
            width: '100%',
            height: 130,
            alignItems: 'center',
          },
        ]}>
        {profileUploading ? (
          <ActivityIndicator
            size={'small'}
            color={colors.darkGrey}
            style={[styles.mt36]}
          />
        ) : (
          <Pressable
            style={[
              styles.mt12,
              {
                alignItems: 'center',
                justifr: 'center',
                height: '70%',
                width: '25%',
                borderRadius: 50,
                borderWidth: 0.5,
              },
            ]}
            onPress={() => setUploadModalVisible(!uploadModalVisible)}>
            <Image
              source={
                profilePictureURL ? {uri: profilePictureURL} : icons.avatar
              }
              style={[{height: '100%', width: '100%', borderRadius: 50}]}
            />
          </Pressable>
        )}
      </View>
      <View style={[{height: 'auto'}]}>
        <Text style={[styles.h1, styles.mb16, {color: '#515151'}]}>
          My Account
        </Text>
        <TitleInput
          title={'Name '}
          boxStyle={nameEmpty || nameError ? styles.mb4 : styles.mb16}
          inputPlaceholder={'Enter here'}
          value={name}
          type={'name'}
          setValue={handleInputChange}
        />
        {nameEmpty && (
          <Text style={[{color: colors.red}, styles.mb16]}>
            Please enter your name
          </Text>
        )}
        {nameError && (
          <Text style={[{color: colors.red}, styles.mb16]}>
            Name cannot be less than 3 words
          </Text>
        )}
        <TitleInput
          title={'Mobile Number '}
          boxStyle={phoneNumberEmpty ? styles.mb4 : styles.mb16}
          inputPlaceholder={'Enter here'}
          keyboardType={'numeric'}
          value={phoneNumber.toString()}
          type={'phoneNumber'}
          setValue={handleInputChange}
          maxLength={10}
        />
        {phoneNumberEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter a valid phone number
          </Text>
        )}

        <Button
          style={[styles.mt12]}
          textStyle={[styles.ts18, {textAlign: 'center'}]}
          onPress={handleInfoChange}
          label={
            loading ? (
              <ActivityIndicator size={'small'} color={colors.white} />
            ) : (
              'Update Info'
            )
          }
          disable={profileUploading ? true : false}
        />
        <UploadModal
          label={'Upload Image'}
          isVisible={uploadModalVisible}
          close={() => setUploadModalVisible(!uploadModalVisible)}
          openCamera={takePhotoWithCamera}
          openGallery={selectImageFromGallery}
          loading={profileUploading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChageInfo;
