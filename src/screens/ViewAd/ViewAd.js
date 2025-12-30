import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Alert,
  Linking
} from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import { Button, RateUsModal, PayUWebViewModal } from '../../component/shared';
import { SellerProfile } from '../../component/viewAd.js';
import { post } from '../../utils/requestBuilder.js';
import Video from 'react-native-video';
import { ProductUploadModal } from '../../component/Home';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { formatPriceIndian } from '../../utils/function.js';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../../utils/env';
import RazorpayCheckout from 'react-native-razorpay';
import { getUserInfo } from '../../utils/function.js';
import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');



const RewardModal = ({
  visible,
  onClose,
  rewardData,
  adViewCount,
  onAdView,
  onDirectPayment,
}) => {
  const requiredViews = rewardData?.requiredViews || 5;
  const discountedAmount = rewardData?.discountedAmount || 0;
  const originalAmount = rewardData?.originalAmount || 2900;

  const discountUnlocked = discountedAmount > 0 && adViewCount >= requiredViews;

  const discountedPriceInRupees = discountedAmount / 100;
  const originalPriceInRupees = originalAmount / 100;

  const buttonText = discountUnlocked
    ? `Upload for ₹${discountedPriceInRupees}`
    : `Pay ₹${originalPriceInRupees} Instead`;

  const modalText = discountUnlocked
    ? `Your price is now ₹${discountedPriceInRupees}! Click below to upload your ad.`
    : `Watch ${requiredViews} short ads and upload your ad for just ₹${discountedPriceInRupees} instead of ₹${originalPriceInRupees}!`;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyle.modalOverlay}>
        <View style={modalStyle.modalContainer}>
          <Text style={modalStyle.modalTitle}>🎉 Special Offer! 🎉</Text>

          <Text style={modalStyle.modalText}>{modalText}</Text>

          {!discountUnlocked && (
            <Text style={modalStyle.progressText}>
              Progress: {adViewCount} / {requiredViews} ads watched
            </Text>
          )}

          <View style={modalStyle.buttonContainer}>
            {!discountUnlocked && (
              <TouchableOpacity
                style={modalStyle.watchAdButton}
                onPress={onAdView}>
                <Text style={modalStyle.buttonText}>
                  Watch Ad ({adViewCount}/{requiredViews})
                </Text>
              </TouchableOpacity>
            )}

            {discountUnlocked && (
              <TouchableOpacity
                style={modalStyle.payButton}
                onPress={onDirectPayment}>
                <Text style={modalStyle.buttonText}>{buttonText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={modalStyle.cancelButton} onPress={onClose}>
              <Text style={modalStyle.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    lineHeight: 22,
  },
  highlight: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  watchAdButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  payButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});

const ViewAd = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const itemDetails = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [itemName, setItemName] = useState('');
  const [mediaData, setMediaData] = useState([]);
  const [additionalInformation, setAdditionalInformation] = useState({});
  const [mediaUriArray, setMediaUriArray] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [adUploaded, setAdUploaded] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNumber, setUserNumber] = useState('');

  //
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  const [adViewCount, setAdViewCount] = useState(0);
  const [currentResponseData, setCurrentResponseData] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [showPayUModal, setShowPayUModal] = useState(false);
  const [payuPayload, setPayuPayload] = useState(null);

  useEffect(() => {
    getUserData();
    setMediaData(itemDetails.mediaArray);
    setProfilePicture(itemDetails?.profilePicture);
    const mediaURI = [];
    const uriArray = itemDetails.mediaArray.map(item => {
      mediaURI.push(item.uri);
    });
    setMediaUriArray(mediaURI);
    const usedKeys = [
      'askingPrice',
      'mediaArray',
      'userName',
      'userId',
      'fullAddress',
      'displayName',
    ]; // Keys used elsewhere in the screen
    const ignoredKeys = [
      'categoryName',
      'itemName',
      'profilePicture',
      'phoneNumber',
      'producType',
      'purpose',
      'itemLatitude',
      'itemLongitude',
    ]; // Keys to ignore
    const filteredDetails = Object.fromEntries(
      Object.entries(itemDetails).filter(
        ([key]) => !usedKeys.includes(key) && !ignoredKeys.includes(key),
      ),
    );
    setAdditionalInformation(filteredDetails);
    setCategoryName(itemDetails.categoryName);
    setItemName(itemDetails.itemName);
  }, []);

  const getUserData = async () => {
    try {
      const userData = await getUserInfo();
      setUserName(userData.user.userName);
      setUserNumber(userData.user.phoneNumber);
    } catch (error) {
      console.log(`error while fetching user data ${error}`);
    }
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

  const [fullDisclaimer, setFullDisclaimer] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const widthRef = useRef(width);

  const handleScroll = e => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / widthRef.current));
  };

  const renderItem = ({ item, index }) => {
    const fileExtension = item.split('.').pop().toLowerCase();
    const isVideo = fileExtension === 'mp4';
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

    if (isVideo) {
      // Handle video rendering (replace with your video player component)
      return (
        <Pressable
          style={[
            styles.pdh16,
            { width: widthRef.current, height: height * 0.27 },
          ]}
          onPress={() =>
            navigation.navigate('AdsMedia', {
              mediaUriArray,
            })
          }>
          <Video
            source={{ uri: item }}
            style={{ width: '80%', height: '80%', alignSelf: 'center' }}
            resizeMode="contain"
            paused={index === currentIndex ? false : true}
          />
        </Pressable>
      );
    } else if (isImage) {
      // Handle image rendering
      return (
        <Pressable
          style={[
            styles.pdh16,
            { width: widthRef.current, height: height * 0.27 },
          ]}
          onPress={() =>
            navigation.navigate('AdsMedia', {
              mediaUriArray,
            })
          }>
          <Image
            source={{ uri: item }}
            style={{ width: '100%', height: '100%', alignSelf: 'center' }}
            resizeMode="contain"
          />
        </Pressable>
      );
    } else {
      // Handle unsupported media type
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

  const handleSubmit = async () => {
    let body = {};
    try {
      let url = '';
      setIsLoading(true);
      const {
        userId,
        fullAddress,
        displayName,
        itemName,
        categoryName,
        mediaArray,
      } = itemDetails;
      if (categoryName === 'Fashion') {
        url = `api/v1/listing/create/fashion`;
        const {
          additionalInformation,
          askingPrice,
          clothing,
          displayName,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        body = {
          displayName,
          additionalInformation: additionalInformation,
          askingPrice: askingPrice,
          categoryName: categoryName,
          clothing: clothing,
          location: fullAddress,
          productType: itemName,
          media: mediaUriArray,
          user: userId,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating fashion ${status}`);
        }
      } else if (categoryName === 'Services') {
        const {
          categoryName,
          itemName,
          adTitle,
          additionalInformation,
          displayName,
          type,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        url = `api/v1/listing/create/service`;
        body = {
          displayName,
          adTitle,
          additionalInformation: additionalInformation,
          categoryName,
          location: fullAddress,
          productType: itemName,
          media: mediaUriArray,
          type: type,
          user: userId,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating services ${status}`);
        }
      } else if (categoryName === 'Farm Machine') {
        url = 'api/v1/listing/create/farmMachine';
        const {
          itemName,
          categoryName,
          displayName,
          additionalInformation,
          askingPrice,
          fullAddress,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        body = {
          additionalInformation: additionalInformation,
          askingPrice: askingPrice,
          categoryName: categoryName,
          productType: itemName,
          machineName: itemName,
          location: fullAddress,
          displayName,
          media: mediaUriArray,
          user: userId,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 while creating farm machine ${status}`,
          );
        }
      } else if (categoryName === 'Matrimonial') {
        url = 'api/v1/listing/create/brideGroom';
        const {
          itemName,
          categoryName,
          displayName,
          name,
          age,
          height,
          maritalStatus,
          religion,
          caste,
          educationalQualification,
          currentOccupation,
          additionalInformation,
          motherTongue,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        body = {
          user: userId,
          categoryName,
          displayName,
          productType: itemName,
          type: itemName,
          name,
          age,
          height,
          maritalStatus,
          religion,
          caste,
          educationalQualification,
          currentOccupation,
          additionalInformation,
          motherTongue,
          media: mediaUriArray,
          location: fullAddress,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating matrimonial ${status}`);
        }
      } else if (categoryName === 'Furniture') {
        const {
          furnitureName,
          displayName,
          additionalInformation,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        url = 'api/v1/listing/create/furniture';
        body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          furnitureName,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating furniture ${status}`);
        }
      } else if (categoryName === 'Jobs') {
        const {
          jobDescription,
          jobLocation,
          salaryRange,
          displayName,
          jobStatus,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        url = 'api/v1/listing/create/job';
        body = {
          user: userId,
          categoryName,
          displayName,
          jobStatus,
          productType: itemName,
          role: itemName,
          jobDescription,
          jobLocation,
          salaryRange,
          media: mediaUriArray,
          location: fullAddress,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setAdUploaded(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating job ${status}`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(`error while submitting ad info ${error}`);
    }
  };

  const createPoultryItems = async () => {
    setIsLoading(true);
    if (itemName === 'Chicken') {
      const url = `api/v1/listing/create/chicken`;
      const {
        displayName,
        additionalInformation,
        askingPrice,
        fullAddress,
        havePoultryFarm,
        priceUnit,
        quantityAvailable,
        userId,
        itemSelling,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      try {
        const body = {
          displayName,
          additionalInformation: additionalInformation,
          askingPrice,
          type: itemSelling,
          categoryName,
          location: fullAddress,
          havePoultryFarm,
          productType: itemName,
          media: mediaUriArray,
          quantityType: priceUnit,
          quantity: quantityAvailable,
          user: userId,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating chicken`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new chicken ${error}`);
      }
    } else if (itemName === 'Fish') {
      const url = `api/v1/listing/create/fish`;
      const {
        userId,
        displayName,
        categoryName,
        itemSelling,
        breedName,
        hasFishPound,
        additionalInformation,
        quantityAvailable,
        priceUnit,
        fullAddress,
        askingPrice,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      const body = {
        user: userId,
        displayName,
        categoryName,
        productType: itemName,
        breed: breedName,
        type: itemSelling,
        hasFishPound,
        additionalInformation,
        quantityAvailable,
        quantityType: priceUnit,
        media: mediaUriArray,
        location: fullAddress,
        askingPrice,
        latitude: itemLatitude,
        longitude: itemLongitude,
      };
      const { response, status } = await post(url, body, true);
      if (status === 200) {
        setIsLoading(false);
        setAdUploaded(true);
      } else {
        setIsLoading(false);
        console.log(
          `status is not 200 while creating fish ${status} while creating chicken`,
        );
      }
    } else if (itemName === 'Birds') {
      const url = `api/v1/listing/create/bird`;
      const {
        itemName,
        displayName,
        categoryName,
        birdName,
        priceUnit,
        additionalInformation,
        fullAddress,
        askingPrice,
        userId,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      const body = {
        user: userId,
        displayName,
        categoryName,
        productType: itemName,
        type: itemName,
        name: birdName,
        quantityType: priceUnit,
        additionalInformation,
        media: mediaUriArray,
        location: fullAddress,
        askingPrice,
        latitude: itemLatitude,
        longitude: itemLongitude,
      };
      const { response, status } = await post(url, body, true);
      if (status === 200) {
        setIsLoading(false);
        setAdUploaded(true);
      } else {
        setIsLoading(false);
        console.log(`status is not 200 ${status} while creating birds`);
      }
    }
    setIsLoading(false);
  };

  const createAnimals = async () => {
    setIsLoading(true);
    if (itemName === 'Other Animals') {
      const url = 'api/v1/listing/create/otherAnimal';
      const {
        userId,
        displayName,
        categoryName,
        itemName,
        name,
        age,
        additionalInformation,
        fullAddress,
        askingPrice,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      try {
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          name,
          age,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating other animals`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new other animal ${error}`);
      }
    } else if (itemName === 'Donkey') {
      try {
        const url = `api/v1/listing/create/donkey`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          gender,
          age,
          hasDeliveredBaby,
          hasFoal,
          isPregnant,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          gender,
          age,
          hasDeliveredBaby,
          hasFoal,
          isPregnant,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setAdUploaded(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating  donkey`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new donkey ${error}`);
      }
    } else if (itemName === 'Dog') {
      try {
        const url = `api/v1/listing/create/dog`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          breed,
          gender,
          age,
          vaccination,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          breed,
          gender,
          age,
          vaccination,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating dog`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new dog ${error}`);
      }
    } else if (itemName === 'Horse' || itemName === 'Cat') {
      let body = {};
      try {
        const url = `api/v1/listing/create/horseCat`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          gender,
          breed,
          age,
          hasDeliveredBaby,
          hasKid,
          isPregnant,
          fullAddress,
          additionalInformation,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: itemName,
          gender,
          breed,
          age,
          deliveredBaby: hasDeliveredBaby,
          hasKid,
          isPregnant,
          media: mediaUriArray,
          location: fullAddress,
          additionalInformation,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating horse and cat`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Goat' || itemName === 'Sheep') {
      try {
        const url = `api/v1/listing/create/goatSheep`;
        const {
          userId,
          categoryName,
          displayName,
          itemName,
          gender,
          breed,
          age,
          currentMilk,
          totalMilk,
          hasDeliveredBaby,
          hasKid,
          isPregnant,
          fullAddress,
          additionalInformation,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: itemName,
          gender,
          breed,
          age,
          currentCapacity: currentMilk,
          maximumCapacity: totalMilk,
          hasDeliveredBaby,
          hasKid,
          isPregnant,
          media: mediaUriArray,
          additionalInformation,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating goat sheep`);
        }
      } catch (error) {
        console.log(`error while creating new ${itemName} ${error}`);
        setIsLoading(false);
      }
    } else if (itemName === 'Bull') {
      try {
        const url = 'api/v1/listing/create/bull';
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          bullBreed,
          bullAge,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          breed: bullBreed,
          age: bullAge,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setAdUploaded(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating bull`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new bull ${error}`);
      }
    } else if (itemName === 'Cow' || itemName === 'Buffalo') {
      const url = `api/v1/listing/create/cowbuffalo`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          breed,
          currentMilk,
          totalMilk,
          hasDeliveredBaby,
          whenDelivered,
          hasKid,
          isPregnant,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: itemName,
          breed,
          currentCapacity: currentMilk,
          maximumCapacity: totalMilk,
          hasDeliveredBaby,
          whenDelivered,
          hasKid,
          isPregnant,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating cow and buffalo`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    }
  };

  const createElectronics = async () => {
    setIsLoading(true);
    if (itemName === 'AC') {
      const url = 'api/v1/listing/create/fridgeAC';
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          brand,
          acType,
          capacity,
          fullAddress,
          additionalInformation,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          displayName,
          user: userId,
          categoryName,
          productType: itemName,
          brand,
          acType,
          capacity,
          media: mediaUriArray,
          location: fullAddress,
          additionalInformation,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating AC`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new AC ${error}`);
      }
    } else if (itemName === 'Fridge') {
      try {
        const url = `api/v1/listing/create/fridgeAC`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          fullAddress,
          capacity,
          fridgeModel,
          brand,
          additionalInformation,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          brand,
          model: fridgeModel,
          capacity,
          media: mediaUriArray,
          location: fullAddress,
          additionalInformation,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status} while creating fridge`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new Fridge ${error}`);
      }
    } else if (itemName === 'TV') {
      const url = `api/v1/listing/create/tv`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          brand,
          tvModel,
          feature,
          fullAddress,
          askingPrice,
          additionalInformation,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          brand,
          model: tvModel,
          screenSize: feature,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new TV ${error}`);
      }
    } else if (itemName === 'Washing Machine') {
      const url = `api/v1/listing/create/washingMachine`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          brand,
          washingMachineType,
          feature,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          brand,
          machineType: washingMachineType,
          capacity: feature,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating washing machine`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new washing machine ${error}`);
      }
    } else if (itemName === 'Coolers and Fans') {
      try {
        const url = `api/v1/listing/create/coolerFan`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          fanType,
          brand,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: fanType,
          brand,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating cooler and fans`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new coolers and fans ${error}`);
      }
    } else if (itemName === 'Kitchen Appliances') {
      const url = `api/v1/listing/create/kitchenAppliance`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          additionalInformation,
          fullAddress,
          askingPrice,
          applianceName,
          brand,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          applianceName,
          brand,
          media: mediaUriArray,
          location: fullAddress,
          additionalInformation,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating kitchen appliance`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new kitchen appliance ${error}`);
      }
    } else if (itemName === 'Laptop/Computer') {
      try {
        const url = `api/v1/listing/create/computerLaptop`;
        const {
          userId,
          displayName,
          categoryName,
          itemSelling,
          itemName,
          brand,
          ram,
          storageType,
          storage,
          fullAddress,
          additionalInformation,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          type: itemSelling,
          productType: itemName,
          brand,
          ram,
          storageType,
          storage,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating laptop computer`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemSelling} ${error}`);
      }
    } else if (itemName === 'Laptop/PC Accessories') {
      const url = `api/v1/listing/create/LaptopPcAccessories`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          accessoriesName,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          accessoriesName,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating Laptop/PC Accessories`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Camera and Lenses') {
      const url = `api/v1/listing/create/cameraLense`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          product,
          brand,
          model,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: product,
          brand,
          model,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating camera and lenses`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Other Electronics') {
      const url = `api/v1/listing/create/otherElectronics`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          name,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          name: name,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 ${status} while creating other electronics`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    }
  };

  const createItem = () => {
    if (categoryName === 'Poultry & Birds') {
      createPoultryItems();
    } else if (categoryName === 'Animals' || categoryName === 'Animals') {
      createAnimals();
    } else if (
      categoryName === 'Electronics' ||
      categoryName === 'Electronic'
    ) {
      createElectronics();
    } else if (categoryName === 'Bikes' || categoryName === 'Bike') {
      createBike();
    } else if (categoryName === 'Mobile' || categoryName === 'Mobiles') {
      createMobile();
    } else if (categoryName === 'Vehicles' || categoryName === 'Vehicle') {
      createVehicle();
    } else if (categoryName === 'Vehicle for Rent') {
      createVehicleRent();
    } else if (categoryName === 'Property' && itemName !== 'Land') {
      createProperty();
    } else if (categoryName === 'Property for Rent') {
      createPropertyRent();
    } else if (categoryName === 'Property' && itemName === 'Land') {
      createLand();
    } else {
      handleSubmit();
    }
  };

  const createBike = async () => {
    setIsLoading(true);
    if (itemName === 'Bike' || itemName === 'Scooty') {
      const url = `api/v1/listing/create/motorCycle`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          brand,
          model,
          registerationDate,
          fuelType,
          kmDriven,
          noOfOwner,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: itemName,
          brand,
          model,
          registerationDate,
          fuelType,
          kmDriven,
          numberOfOwner: noOfOwner,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 while creating bike and scooty ${status}`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Bicycles') {
      const url = `api/v1/listing/create/bicycle`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          fullAddress,
          additionalInformation,
          askingPrice,
          brand,
          model,
          monthsOld,
          bicycleElectric,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          brand,
          model,
          isElectric: bicycleElectric,
          oldInMonths: monthsOld,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating bicycle ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Spare Parts') {
      const url = `api/v1/listing/create/spareParts`;
      try {
        const {
          userId,
          displayName,
          itemName,
          categoryName,
          sparePart,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          sparePartName: sparePart,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating spare parts ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    }
  };

  const createMobile = async () => {
    setIsLoading(true);
    if (itemName === 'Mobile') {
      try {
        const url = `api/v1/listing/create/phone`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          brand,
          model,
          internalStorage,
          ram,
          monthsOld,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          brand,
          model,
          internalStorage,
          ram,
          oldInMonths: monthsOld,
          media: mediaUriArray,
          additionalInformation,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating mobile ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Tablet') {
      const url = `api/v1/listing/create/tablet`;
      setIsLoading(true);
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          brand,
          model,
          monthsOld,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          brand,
          model,
          oldInMonths: monthsOld,
          media: mediaUriArray,
          additionalInformation,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating tablet ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    } else if (itemName === 'Accessories') {
      try {
        const url = `api/v1/listing/create/accessories`;
        const {
          userId,
          displayName,
          itemName,
          categoryName,
          accessoriesType,
          brand,
          model,
          monthsOld,
          additionalInformation,
          askingPrice,
          fullAddress,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          accessoriesType,
          brand,
          model,
          monthsOld,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating Accessories ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new ${itemName} ${error}`);
      }
    }
  };

  const createVehicle = async () => {
    setIsLoading(true);
    try {
      const url = 'api/v1/listing/create/car';
      const {
        userId,
        displayName,
        categoryName,
        itemName,
        brand,
        model,
        registerationDate,
        fuelType,
        transmission,
        kmDriven,
        numberOfOwner,
        additionalInformation,
        fullAddress,
        askingPrice,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      const body = {
        user: userId,
        displayName,
        categoryName,
        productType: itemName,
        type: itemName,
        brand,
        model,
        registerationDate,
        fuelType,
        transmission,
        kmDriven,
        numberOfOwner,
        additionalInformation,
        media: mediaUriArray,
        location: fullAddress,
        askingPrice,
        latitude: itemLatitude,
        longitude: itemLongitude,
      };
      const { response, status } = await post(url, body, true);
      if (status === 200) {
        setIsLoading(false);
        setAdUploaded(true);
      } else {
        setIsLoading(false);
        console.log(
          `status is not 200 while creating creating vehicle sale ${status}`,
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.log(`error while creating new vehicle ${error}`);
    }
  };

  const createVehicleRent = async () => {
    setIsLoading(true);
    const url = `api/v1/listing/create/carRent`;
    if (itemName === 'Car') {
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          carType,
          carModel,
          carAvailable,
          carAdditionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          vehicleType: carType,
          vehicleModel: carModel,
          availibility: carAvailable,
          additionalInformation: carAdditionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          fareKm: askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        setIsLoading(true);
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 while creating vehicle rent ${status}`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating vehicle rent ${error}`);
      }
    } else if (itemName === 'Ambulance') {
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          ambulanceAvailable,
          additionalInformation,
          askingPrice,
          fullAddress,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          availibility: ambulanceAvailable,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          fareKm: askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating ambulance ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating vehicle rent ${error}`);
      }
    } else if (itemName === 'Bus') {
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          busModel,
          seatInBus,
          isBusAc,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          vehicleModel: busModel,
          seatsInBus: seatInBus,
          isBusAc,
          media: mediaUriArray,
          additionalInformation,
          location: fullAddress,
          fareKm: askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating Bus ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating vehicle rent ${error}`);
      }
    } else {
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          vehicleModel,
          additionalInfo,
          fullAddress,
          askingPrice,
        } = itemDetails;
        const body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          vehicleModel,
          additionalInformation: additionalInfo,
          media: mediaUriArray,
          location: fullAddress,
          fareKm: askingPrice,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 while creating vehicles rent ${status}`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating vehicle rent ${error}`);
      }
    }
  };

  const createProperty = async () => {
    setIsLoading(true);
    const url = `api/v1/listing/create/property`;
    let body = {};
    try {
      const {
        userId,
        displayName,
        categoryName,
        itemName,
        propertyType,
        bedroom,
        bathroom,
        furnishing,
        listedBy,
        carpetArea,
        whichFloor,
        totalFloor,
        liftAvailable,
        parkingAvailable,
        additionalInformation,
        fullAddress,
        askingPrice,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      body = {
        user: userId,
        displayName,
        categoryName,
        productType: itemName,
        type: propertyType,
        bedroom,
        bathroom,
        furnishing,
        listedBy,
        carpetArea,
        whichFloor,
        totalFloor,
        liftAvailable,
        parkingAvailable,
        media: mediaUriArray,
        additionalInformation,
        location: fullAddress,
        askingPrice,
        latitude: itemLatitude,
        longitude: itemLongitude,
      };
      const { response, status } = await post(url, body, true);
      if (status === 200) {
        setIsLoading(false);
        setAdUploaded(true);
      } else {
        setIsLoading(false);
        console.log(`status is not 200 while creating property ${status}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(`error while creating new ${categoryName} ${error}`);
    }
  };

  const createLand = async () => {
    setIsLoading(true);
    try {
      const url = 'api/v1/listing/create/land';
      const {
        userId,
        categoryName,
        itemName,
        displayName,
        propertyType,
        propertyArea,
        measurementType,
        listedBy,
        additionalInformation,
        fullAddress,
        askingPrice,
        itemLatitude,
        itemLongitude,
      } = itemDetails;
      const body = {
        displayName,
        user: userId,
        categoryName,
        productType: itemName,
        type: propertyType,
        totalArea: propertyArea,
        measurementType,
        listedBy,
        media: mediaUriArray,
        additionalInformation,
        location: fullAddress,
        askingPrice,
        latitude: itemLatitude,
        longitude: itemLongitude,
      };
      const { response, status } = await post(url, body, true);
      if (status === 200) {
        setIsLoading(false);
        setAdUploaded(true);
      } else {
        setIsLoading(false);
        console.log(`status is not 200 while creating land ${status}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(`error while creating new land ${error}`);
    }
  };

  const createPropertyRent = async () => {
    setIsLoading(true);
    let body = {};
    if (itemName === 'Residential' || itemName === 'Commercial') {
      setIsLoading(true);
      const url = `api/v1/listing/create/propertyRent`;
      try {
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          propertyType,
          bedroom,
          bathroom,
          furnishing,
          listedBy,
          carpetArea,
          whichFloor,
          totalFloor,
          liftAvailable,
          parkingAvailable,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;
        body = {
          user: userId,
          displayName,
          categoryName,
          productType: itemName,
          type: propertyType,
          bedroom,
          bathroom,
          furnishing,
          listedBy,
          carpetArea,
          whichFloor,
          totalFloor,
          liftAvailable,
          parkingAvailable,
          media: mediaUriArray,
          additionalInformation,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(
            `status is not 200 while creating property rent ${status}`,
          );
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new  ${categoryName} ${error}`);
      }
    } else {
      try {
        const url = `api/v1/listing/create/hostel`;
        const {
          userId,
          displayName,
          categoryName,
          itemName,
          availableFor,
          mealIncludes,
          roomSharing,
          bathroom,
          listedBy,
          carpetArea,
          totalFloor,
          whichFloor,
          liftAvailable,
          parkingAvailable,
          additionalInformation,
          fullAddress,
          askingPrice,
          itemLatitude,
          itemLongitude,
        } = itemDetails;

        const body = {
          user: userId,
          categoryName,
          displayName,
          productType: itemName,
          type: itemName,
          availableFor,
          mealIncludes,
          roomSharing,
          bathroom,
          carpetArea,
          listedBy,
          totalFloor,
          whichFloor,
          liftAvailable,
          parkingAvailable,
          additionalInformation,
          media: mediaUriArray,
          location: fullAddress,
          askingPrice,
          latitude: itemLatitude,
          longitude: itemLongitude,
        };
        const { response, status } = await post(url, body, true);
        if (status === 200) {
          setIsLoading(false);
          setAdUploaded(true);
        } else {
          setIsLoading(false);
          console.log(`status is not 200 while creating hostel ${status}`);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(`error while creating new  ${categoryName} ${error}`);
      }
    }
  };

  const formatLabel = text => {
    if (!text) return text;

    // Add spaces before capital letters and capitalize the first letter
    const formattedText = text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before each uppercase letter
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize the first letter

    return formattedText;
  };




  // 💰 Start PayU payment directly
const initiatePayUPayment = async () => {
  setIsLoading(true);
  try {
    const body = {
      name : userName, 
      phone: userNumber,
      itemLatitude : itemDetails.itemLatitude,
      itemLongitude : itemDetails.itemLongitude,
      address : itemDetails.fullAddress,
      categoryName:categoryName
     };

    const { response, status } = await post(
      "api/v1/payment/payu/initiate",
      body,
      true
    );

    if (status === 200) {
      const responseData = response.response;
      setCurrentResponseData(responseData);

      if (responseData.payment) {
        const payload = responseData.payuPayload;
        setPayuPayload(payload);
        setShowPayUModal(true);
      } else {
        await createItem(); // for free listings
      }
    }
  } catch (error) {
    console.error("Error initiating PayU payment:", error);
    Alert.alert("Error", "Payment initiation failed.");
  } finally {
    setIsLoading(false);
  }
};


  // ✅ Step 5: Handle PayU result
  const handlePayUResult = async (status) => {
    setShowPayUModal(false);

    if (status === "success") {
      try {
        await analytics().logEvent("listing_fee_payment", {
          value: currentResponseData.amount / 100,
          currency: "INR",
          category: itemDetails.categoryName,
        });

        await createItem();

        await analytics().logEvent("upload_item", {
          category: "listing",
          item_category: itemDetails.categoryName,
          location: `${itemDetails.itemLatitude},${itemDetails.itemLongitude}`,
          payment_required: true,
          payment_amount: currentResponseData.amount / 100,
        });

        Alert.alert("Success", "Your item has been uploaded successfully.");
      } catch (err) {
        Alert.alert("Payment successful", "But upload failed. Please retry.");
      }
    } else if (status === "failure") {
      const rewardData = currentResponseData;
      if (rewardData?.isReward) {
        setRewardData({
          requiredViews: rewardData.rewardViewsRequired || 5,
          discountedAmount: rewardData.rewardAmount,
          originalAmount: rewardData.amount,
        });
        setShowRewardModal(true);
        setAdViewCount(0);
      } else {
        Alert.alert("Payment failed", "Your ad could not be uploaded.");
      }
    }
  };

  // ✅ Step 6: Rewarded ad logic
  const showRewardedAd = () => {
    const rewardedAdUnitId = "ca-app-pub-9372794286829313/2160297504";
    const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribe = rewarded.addAdEventsListener(async ({ type }) => {
      if (type === RewardedAdEventType.LOADED) rewarded.show();

      if (type === RewardedAdEventType.EARNED_REWARD) {
        const newCount = adViewCount + 1;
        setAdViewCount(newCount);

        if (newCount >= 5) {
          setRewardData({
            requiredViews: 5,
            discountedAmount: currentResponseData.rewardAmount,
            originalAmount: currentResponseData.amount,
          });
          setAdViewCount(0);
        } else {
          Alert.alert(`Watched ${newCount} of 5 ads.`);
        }
      }
    });

    rewarded.load();
    return () => unsubscribe();
  };

  const handleDirectPayment = () => {
    setShowRewardModal(false);
    const amountToPay =
      rewardData?.discountedAmount || rewardData?.originalAmount;
    if (amountToPay) initiatePayUPayment(amountToPay, currentResponseData);
  };

  return (
    <SafeAreaView style={[styles.pdt16, { flex: 1 }]}>
      <RewardModal
        visible={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        rewardData={rewardData}
        adViewCount={adViewCount}
        onAdView={showRewardedAd}
        onDirectPayment={handleDirectPayment}
      />

      <PayUWebViewModal
        visible={showPayUModal}
        payuPayload={payuPayload}
        onClose={() => setShowPayUModal(false)}
        onResult={handlePayUResult}
      />

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
      </View>
      {/* {adUploaded && <ProductUploadModal />} */}

      {adUploaded && (
        <ProductUploadModal
          onClose={() => {
            setAdUploaded(false);
            setShowRateModal(true);
          }}
        />
      )}

      {showRateModal && (
        <RateUsModal
          visible={showRateModal}
          onClose={() => navigation.replace('Home')}
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[{ height: height * 2 }]}>
        <View>
          <FlatList
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={mediaUriArray}
            horizontal={true}
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
            {mediaData && mediaData?.map(renderDot)}
          </View>
        </View>

        {/* remaining screen */}
        <View style={[styles.pdh16]}>
          <View
            style={[
              styles.fdRow,
              { justifyContent: 'space-between', alignItems: 'center' },
            ]}>
            {itemDetails.askingPrice && (
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
                  {itemDetails?.askingPrice &&
                    formatPriceIndian(itemDetails.askingPrice)}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.mt8,
              styles.mb8,
              styles.ts18,
              { color: colors.black },
            ]}>
            {itemDetails?.displayName.trim()}
          </Text>
          <View style={[styles.fdRow, { marginTop: 6, alignItems: 'center' }]}>
            <Image
              source={icons.location}
              style={[styles.icon24, styles.mr8]}
            />
            <Text
              style={[
                {
                  color: colors.black,
                  paddingRight: 12,
                },
                styles.ts15,
                styles.fw400,
              ]}>
              {itemDetails.fullAddress}
            </Text>
          </View>
          <View style={[styles.mt20]}>
            <BannerAd
              unitId={`ca-app-pub-9372794286829313/3411561192`}
              size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
              onAdFailedToLoad={error => {
                console.log('Ad failed to load:', error);
              }}
              onAdLoaded={() => {
                console.log('Ad loaded successfully');
              }}
            />
          </View>

          <View style={[styles.mt12]}>
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
                      style={[styles.ts14, { color: colors.black }, styles.mr8]}>
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
                styles.ts19,
                styles.mb16,
                { color: colors.black, color: colors.red },
              ]}>
              Disclaimer
            </Text>
            <Text style={[{ color: colors.black }]}>
              Your safety is our first priority. Make face to face deal only.
              Don't try to pay or receive any amount in advance.
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
              <Text style={[{ color: colors.black }, styles.ts15]}>
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

          <View style={{ width: '100%', marginBottom: 20, marginTop: 10 }}>
            <BannerAd
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              unitId={'ca-app-pub-9372794286829313/2903257633'}
              onAdFailedToLoad={error => {
                console.log('Ad failed to load:', error);
              }}
              onAdLoaded={() => {
                console.log('Ad loaded successfully');
              }}
            />
          </View>

          <View style={[{ height: 'auto' }, styles.mt8, styles.mb16]}>
            <Text style={[styles.ts17, { color: colors.black }]}>
              Seller Profile
            </Text>
            <SellerProfile
              style={[styles.mt12, styles.mb20]}
              name={itemDetails.userName}
              customerId={itemDetails.userId}
              userImage={profilePicture}
            />
            <Button
              label={
                isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  'Submit'
                )
              }
              style={[{ width: '50%', alignSelf: 'center' }, styles.mt28]}
              textStyle={[styles.fwBold, styles.ts18]}
              onPress={initiatePayUPayment}
              disable={isLoading}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewAd;
