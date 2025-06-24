import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  TitleHeader,
  TitleInput,
  DropDown,
  Button,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const ACFridge = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const acTypes = ['Split AC', 'Window AC'];
  const [brand, setBrand] = useState('');
  const [fridgeModel, setFridgeModel] = useState('');
  const [acType, setAcType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState(false);
  const [fridgeModelEmpty, setFridgeModelEmpty] = useState(false);
  const [acTypeEmpty, setAcTypeEmpty] = useState(false);
  const [capacityEmpty, setCapacityEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setBrand(itemData?.brand);
      setAcType(itemData?.acType);
      setFridgeModel(itemData?.model);
      setCapacity(itemData?.capacity.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (itemName === 'AC') {
      if (!brand && !acType && !capacity && !askingPrice) {
        setBrandEmpty(true);
        setAcTypeEmpty(true);
        setCapacityEmpty(true);
        setAskingPriceEmpty(true);
      }

      if (!brand) {
        setBrandEmpty(true);
      } else if (!acType) {
        setAcTypeEmpty(true);
      } else if (!capacity) {
        setCapacityEmpty(true);
      } else if (!askingPrice) {
        setAskingPriceEmpty(true);
      } else {
        if (forEdit) {
          setIsLoading(true);
          const url = `api/v1/listing/item/edit/item`;
          const body = {
            categoryName,
            parentId,
            productType,
            itemId: itemData._id,
            updatedInfo: {
              brand,
              acType,
              capacity,
              additionalInformation,
              askingPrice,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(response, status, 'response while updating fashion ad');
            ToastAndroid.showWithGravityAndOffset(
              'Ad updated successfully',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            navigation.pop();
          } else {
            console.log(
              status,
              'status is not 200 while updating matrimonial ',
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: brand + ' ' + acType + ' available for sale',
            brand,
            acType,
            capacity,
            additionalInformation,
            askingPrice,
          });
        }
      }
    } else if (itemName === 'Fridge') {
      if (!brand && !fridgeModel && !capacity && !askingPrice) {
        setBrandEmpty(true);
        setFridgeModelEmpty(true);
        setCapacityEmpty(true);
        setAskingPriceEmpty(true);
      }
      if (!brand) {
        setBrandEmpty(true);
      } else if (!fridgeModel) {
        setFridgeModelEmpty(true);
      } else if (!capacity) {
        setCapacityEmpty(true);
      } else if (!askingPrice) {
        setAskingPriceEmpty(true);
      } else {
        if (forEdit) {
          setIsLoading(true);
          const url = `api/v1/listing/item/edit/item`;
          const body = {
            categoryName,
            parentId,
            productType,
            itemId: itemData._id,
            updatedInfo: {
              brand,
              model: fridgeModel,
              capacity,
              additionalInformation,
              askingPrice,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              'response while updating ',
              productType,
            );
            ToastAndroid.showWithGravityAndOffset(
              'Ad updated successfully',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            navigation.pop();
          } else {
            console.log(
              status,
              'status is not 200 while updating ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: brand + ' Fridge available for sale',
            brand,
            fridgeModel,
            capacity,
            additionalInformation,
            askingPrice,
          });
        }
      }
    }
  };

  const handleDropdown = index => {
    setAcType(acTypes[index]);
    setAcTypeEmpty(false);
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBrand(text);
        setBrandEmpty(false);
      }
    } else if (type === 'fridgeModel') {
      setFridgeModel(text);
      setFridgeModelEmpty(false);
    } else if (type === 'capacity') {
      const isNumberWithDot = /^[0-9.]*$/;
      if (isNumberWithDot.test(text)) {
        setCapacity(text);
        setCapacityEmpty(false);
      }
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
    } else if (type === 'askingPrice') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setAskingPrice(text);
        setAskingPriceEmpty(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`${itemName} Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.pdt12]}>
        <TitleInput
          title={`Type brand name of your ${itemName} *`}
          inputPlaceholder={'Enter here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          type={'brand'}
          setValue={handleInputChange}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Brand of ${itemName} is required`}
          </Text>
        )}
        {itemName === 'AC' ? (
          <DropDown
            defaultValue={forEdit ? itemData.acType : 'Please Select'}
            options={acTypes}
            title={`Select ${itemName} type *`}
            titleStyle={[styles.ts17, styles.fw400]}
            style={[
              {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
              acTypeEmpty ? styles.mb4 : styles.mb12,
            ]}
            onSelect={handleDropdown}
            type={'acType'}
          />
        ) : (
          <TitleInput
            title={`Model of your ${itemName} *`}
            inputPlaceholder={'Enter here'}
            boxStyle={fridgeModelEmpty ? styles.mb4 : styles.mb12}
            value={fridgeModel}
            type={'fridgeModel'}
            setValue={handleInputChange}
          />
        )}
        {acTypeEmpty && itemName === 'AC' ? (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please select ac type
          </Text>
        ) : null}
        {fridgeModelEmpty && itemName !== 'AC' ? (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Pleae enter model of your fridge
          </Text>
        ) : null}
        <TitleInput
          inputPlaceholder={itemName === 'AC' ? '1 Ton' : '250 L'}
          keyboardType={'numeric'}
          title={
            itemName === 'AC'
              ? `${itemName} Capacity in ton *`
              : `${itemName} capacity in litres *`
          }
          boxStyle={capacityEmpty ? styles.mb4 : styles.mb12}
          value={capacity}
          type={'capacity'}
          setValue={handleInputChange}
        />
        {capacityEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter capacity
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          boxStyle={styles.mb12}
          multiline={true}
          numberOfLines={4}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
          type={'askingPrice'}
          value={askingPrice}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb20]}>
            asking price is required
          </Text>
        )}
        <Button
          label={
            isLoading ? (
              <ActivityIndicator size={'small'} color={colors.white} />
            ) : forEdit ? (
              'Update'
            ) : (
              'Next'
            )
          }
          onPress={goToMedia}
          style={{marginBottom: 100}}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ACFridge;
