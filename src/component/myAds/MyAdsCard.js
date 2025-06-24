import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import images from '../../assets/images';
import {deleteApi, put} from '../../utils/requestBuilder';
import {useNavigation} from '@react-navigation/native';
import {formatPriceIndian} from '../../utils/function';
import FastImage from 'react-native-fast-image';

const formatDate = isoString => {
  const date = new Date(isoString);
  const options = {day: 'numeric', month: 'long', year: 'numeric'};
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const OptionModal = ({
  showMoreOptions,
  handleDelete,
  handleDeactivate,
  handleClose,
  isLoading,
  selectedSubCategory,
  handleEditAds,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={showMoreOptions}
      onRequestClose={handleClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={[
            {
              width: '80%',
              backgroundColor: colors.white,
              borderRadius: 10,
              alignItems: 'center',
            },
            styles.p20,
          ]}>
          <Text
            style={[
              styles.h3,
              {color: colors.black, textAlign: 'left'},
              styles.mb16,
            ]}>
            Ads Option
          </Text>
          {!isLoading ? (
            <>
              <TouchableOpacity
                style={[
                  styles.p8,
                  styles.mb12,
                  {width: '100%', borderWidth: 0.5},
                ]}
                onPress={handleDelete}>
                <Text
                  style={[
                    {color: colors.black, textAlign: 'left'},
                    styles.ts16,
                    styles.fwBold,
                  ]}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.p8,
                  styles.mb12,
                  {width: '100%', borderWidth: 0.5},
                ]}
                onPress={handleDeactivate}>
                <Text
                  style={[
                    {color: colors.black, textAlign: 'left'},
                    styles.ts16,
                    styles.fwBold,
                  ]}>
                  {selectedSubCategory === 'Deactivate'
                    ? 'Activate'
                    : 'De-Activate'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.p8,
                  styles.mb12,
                  {width: '100%', borderWidth: 0.5},
                ]}
                onPress={handleEditAds}>
                <Text
                  style={[
                    {color: colors.black, textAlign: 'left'},
                    styles.ts16,
                    styles.fwBold,
                  ]}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.mt4,
                  {borderRadius: 10, backgroundColor: colors.red, width: 80},
                  styles.p8,
                ]}
                onPress={handleClose}>
                <Text
                  style={[
                    styles.ts16,
                    styles.fwBold,
                    {color: colors.white, textAlign: 'center'},
                  ]}>
                  Close
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator size={'small'} color={colors.mintGreen} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const MyAdsCard = ({
  itemData,
  postedOn,
  userId,
  parentId,
  selectedSubCategory,
  handleSelectActive,
  expiresOn,
}) => {
  const cardStyle = [
    styles.mb8,
    styles.mr8,
    {
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 5,
    },
  ];
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [moreOptionLoading, setMoreOptionLoading] = useState(false);
  const {_id, productType, categoryName, displayName, askingPrice} = itemData;
  const imageFormats = ['jpg', 'jpeg', 'png'];
  const firstImage = itemData.media
    ? itemData.media.find(mediaUrl =>
        imageFormats.some(format => mediaUrl.endsWith(format)),
      )
    : itemData[0].media.find(mediaUrl =>
        imageFormats.some(format => mediaUrl.endsWith(format)),
      );

  const deleteActiveAds = async (
    userId,
    parentId,
    itemId,
    itemCategory,
    productType,
    handleSelectActive,
  ) => {
    try {
      setMoreOptionLoading(true);
      const url = `api/v1/listing/item/deleteItem`;
      const body = {
        userId,
        parentId,
        itemId,
        categoryName: itemCategory,
        productType,
      };

      const {response, status} = await deleteApi(url, body);
      if (status === 200) {
        setMoreOptionLoading(false);
        ToastAndroid.showWithGravityAndOffset(
          'Ad deleted successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        console.log('status is not 200 while deleting item');
      }
    } catch (error) {
      console.log('error while deleting the ad ', error);
    }
    setShowModal(!showModal);
    // handleSelectActive(userId);
    if (handleSelectActive) {
      handleSelectActive(userId); // Call the function only if it's defined
    }
    setMoreOptionLoading(false);
  };

  const deactivateAds = async (
    parentId,
    itemId,
    categoryName,
    productType,
    handleSelectActive,
  ) => {
    setMoreOptionLoading(true);
    try {
      const url = `api/v1/listing/item/deactivate/item`;
      const body = {
        parentId,
        itemId,
        categoryName,
        productType,
      };
      const {response, status} = await put(url, body);
      if (status === 200) {
        setMoreOptionLoading(false);
        ToastAndroid.showWithGravityAndOffset(
          'Ad Deactivated',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        console.log(
          'status is not 200 while deactivating ads ',
          status,
          response,
        );
      }
    } catch (error) {
      console.log(`error while deactivating the ads ${error}`);
    }
    setShowModal(!showModal);
    setMoreOptionLoading(false);
    handleSelectActive(userId);
  };

  const editAds = async (itemData, parentId, categoryName, productType) => {
    setMoreOptionLoading(true);
    try {
      // const categories = {
      //   Jobs: 'Job',
      //   Fashion: 'Fashion',
      //   Services: 'Services',
      //   // Add more category mappings as needed
      // };

      if (categoryName === 'Jobs') {
        navigation.navigate('Job', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
        });
      } else if (categoryName === 'Fashion') {
        navigation.navigate('Fashion', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
        });
      } else if (categoryName === 'Services') {
        navigation.navigate('Services', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
          itemName: productType,
        });
      } else if (categoryName === 'Farm Machine') {
        navigation.navigate('FarmMachine', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
        });
      } else if (categoryName === 'Matrimonial') {
        navigation.navigate('Matrimonial', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
        });
      } else if (categoryName === 'Furniture') {
        navigation.navigate('Furniture', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
        });
      } else if (categoryName === 'Electronics') {
        if (productType === 'AC' || productType === 'Fridge') {
          navigation.navigate('ACFridge', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'TV' || productType === 'Washing Machine') {
          navigation.navigate('TV_WashingMachine', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (
          productType === 'Coolers and Fans' ||
          productType === 'Kitchen Appliances'
        ) {
          navigation.navigate('CoolerFan_KitchenAppliances', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Laptop/Computer') {
          navigation.navigate('LaptopComputer', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Laptop/PC Accessories') {
          navigation.navigate('ComputerAccessories', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Camera and Lenses') {
          navigation.navigate('CameraLense', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Other Electronics') {
          navigation.navigate('OtherElectronics', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Bikes') {
        if (productType === 'Bike' || productType === 'Scooty') {
          navigation.navigate('Bike_Scooty', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Bicycles') {
          navigation.navigate('Bicycle', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Spare Parts') {
          navigation.navigate('SpareParts', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Animals') {
        if (productType === 'Cow' || productType === 'Buffalo') {
          navigation.navigate('CowBuffalo', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Bull') {
          navigation.navigate('Bull', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Sheep' || productType === 'Goat') {
          navigation.navigate('GoatSheep', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Horse' || productType === 'Cat') {
          navigation.navigate('HorseCat', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Dog') {
          navigation.navigate('Dog', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Donkey') {
          navigation.navigate('Donkey', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Other Animals') {
          navigation.navigate('OtherAnimals', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Poultry & Birds') {
        if (productType === 'Chicken') {
          navigation.navigate('Chicken', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Fish') {
          navigation.navigate('Fish', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Birds') {
          navigation.navigate('Bird', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Mobile') {
        if (productType === 'Mobile') {
          navigation.navigate('Mobile', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Tablet') {
          navigation.navigate('Tablet', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Accessories') {
          navigation.navigate('Accessories', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Vehicles') {
        if (productType === 'Car') {
          navigation.navigate('VehicleSale', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Vehicle for Rent') {
        navigation.navigate('VehicleRent', {
          itemData,
          parentId,
          categoryName,
          productType,
          forEdit: true,
          itemName: productType,
        });
      } else if (categoryName === 'Property') {
        if (productType === 'Residential' || productType === 'Commercial') {
          navigation.navigate('PropertySale', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (productType === 'Land') {
          navigation.navigate('LandSale', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      } else if (categoryName === 'Property for Rent') {
        if (productType === 'PG/Hostel') {
          navigation.navigate('Hostel', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        } else if (
          productType === 'Residential' ||
          productType === 'Commercial'
        ) {
          navigation.navigate('PropertyRent', {
            itemData,
            parentId,
            categoryName,
            productType,
            forEdit: true,
            itemName: productType,
          });
        }
      }
    } catch (error) {
      console.log(`error while updating the item ${error}`);
    }
    setShowModal(!showModal);
    setMoreOptionLoading(false);
  };

  return (
    <Pressable
      style={[{height: 125, overflow: 'hidden'}, styles.fdRow, cardStyle]}>
      <View style={[{width: '30%', backgroundColor: colors.black}]}>
        <FastImage
          source={{
            uri: firstImage,
            cache: FastImage.cacheControl.web,
            priority: FastImage.priority.normal,
          }}
          style={{
            height: '100%',
            width: '90%',
            resizeMode: 'contain',
            tintColor: !firstImage ? colors.white : null,
            alignSelf : "center"
          }}
        />
      </View>
      <View style={[{width: '70%'}, styles.p8]}>
        <View style={[styles.fdRow, {width: '100%'}]}>
          <Text
            style={[
              styles.ts15,
              {
                width: '90%',
                height: 'auto',
                color: colors.black,
              },
              styles.mr4,
            ]}>
            {displayName.length > 40
              ? displayName.slice(0, 40) + '...'
              : displayName}
          </Text>
          <Pressable onPress={() => setShowModal(!showModal)}>
            <Image source={icons.dots} style={[styles.icon20, styles.mt4]} />
          </Pressable>
        </View>
        <View
          style={[
            styles.fdRow,
            {marginTop: displayName.length > 50 ? null : 4},
          ]}>
          <Pressable>
            <Image
              source={icons.rupee}
              style={[styles.icon16, styles.mr8, {marginTop: 6}]}
            />
          </Pressable>
          <Text style={[styles.ts19, {color: colors.black}]}>
            {formatPriceIndian(askingPrice) || '---'}
          </Text>
        </View>
        <View style={[{marginTop: 2}, styles.pdv4]}>
          <Text style={[styles.ts13, styles.mb4, {color: colors.black}]}>
            Posting Date: {formatDate(postedOn)}
          </Text>
          <Text style={[styles.ts13, {color: colors.black}]}>
            Expiry Date : {formatDate(expiresOn)}
          </Text>
        </View>
      </View>
      {showModal && (
        <OptionModal
          showMoreOptions={showModal}
          handleDelete={() =>
            deleteActiveAds(
              userId,
              parentId,
              itemData._id,
              itemData.categoryName,
              itemData.productType,
              handleSelectActive,
            )
          }
          handleClose={() => setShowModal(!showModal)}
          isLoading={moreOptionLoading}
          handleDeactivate={() =>
            deactivateAds(
              parentId,
              itemData._id,
              itemData.categoryName,
              itemData.productType,
              handleSelectActive,
            )
          }
          selectedSubCategory={selectedSubCategory}
          handleEditAds={() =>
            editAds(itemData, parentId, categoryName, productType)
          }
        />
      )}
    </Pressable>
  );
};

export default MyAdsCard;
