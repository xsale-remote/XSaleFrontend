import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Button,
  TitleHeader,
  TitleInput,
  DropDown,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const TV_WashingMachine = ({navigation, route}) => {
  const washingMachineTypes = ['Top Load', 'Front Load'];
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const [brand, setBrand] = useState('');
  const [tvModel, setTvModel] = useState('');
  const [washingMachineType, setWashingMachineType] = useState('');
  const [feature, setFeature] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState(false);
  const [tvModelEmpty, seTvModelEmpty] = useState(false);
  const [machineTypeEmtpy, setMachineTypeEmpty] = useState(false);
  const [featureEmpty, setFeatureEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  const goToMedia = async () => {
    if (itemName === 'Washing Machine') {
      if (!brand && !washingMachineType && !feature && !askingPrice) {
        setBrandEmpty(true);
        setMachineTypeEmpty(true);
        setFeatureEmpty(true);
        setAskingPriceEmpty(true);
      }

      if (!brand) {
        setBrandEmpty(true);
      } else if (!washingMachineType) {
        setMachineTypeEmpty(true);
      } else if (!feature) {
        setFeatureEmpty(true);
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
              washingMachineType,
              capacity: feature,
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
              'status is not 200 while updating  ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: brand + ' ' + itemName + ' available for sale',
            brand,
            washingMachineType,
            feature,
            additionalInformation,
            askingPrice,
          });
        }
      }
    } else if (itemName === 'TV') {
      if (!brand && !tvModel && !feature && !askingPrice) {
        setBrandEmpty(true);
        seTvModelEmpty(true);
        setFeatureEmpty(true);
        setAskingPriceEmpty(true);
      }

      if (!brand) {
        setBrandEmpty(true);
      } else if (!tvModel) {
        setTvModel(true);
      } else if (!feature) {
        setFeatureEmpty(true);
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
              model: tvModel,
              screenSize: feature,
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
              'status is not 200 while updating  ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: brand + ' ' + itemName + ' available for sale',
            brand,
            tvModel,
            feature,
            additionalInformation,
            askingPrice,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (forEdit) {
      setBrand(itemData.brand);
      setWashingMachineType(itemData?.machineType);
      if (productType === 'TV') {
        setTvModel(itemData?.model);
        setFeature(itemData?.screenSize.toString());
      } else {
        setFeature(itemData?.capacity.toString());
      }
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBrand(text);
        setBrandEmpty(false);
      }
    } else if (type === 'tvModel') {
      const isAlphanumericWithWhitespace = /^[a-zA-Z0-9\s]*$/;
      if (isAlphanumericWithWhitespace.test(text)) {
        setTvModel(text);
        seTvModelEmpty(false);
      }
    } else if (type === 'feature') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setFeature(text);
        setFeatureEmpty(false);
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
  const handleDropdown = (index, value, type) => {
    setWashingMachineType(washingMachineTypes[index]);
    setMachineTypeEmpty(false);
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
          titleStyle={styles.ts16}
          value={brand}
          setValue={handleInputChange}
          type={'brand'}
        />

        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter brand name
          </Text>
        )}

        {itemName === 'Washing Machine' ? (
          <DropDown
            options={washingMachineTypes}
            defaultValue={itemData?.machineType}
            title={`Select ${itemName} type *`}
            titleStyle={[styles.ts17, styles.fw400]}
            style={[
              {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
              machineTypeEmtpy ? styles.mb4 : styles.mb12,
            ]}
            type={'machineType'}
            onSelect={handleDropdown}
          />
        ) : (
          <TitleInput
            title={`Model of your ${itemName} *`}
            inputPlaceholder={'Enter here'}
            boxStyle={tvModelEmpty ? styles.mb4 : styles.mb12}
            value={tvModel}
            setValue={handleInputChange}
            type={'tvModel'}
          />
        )}

        {machineTypeEmtpy && itemName === 'Washing Machine' ? (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please select type of washing machine
          </Text>
        ) : null}
        {tvModelEmpty && itemName === 'TV' ? (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter model of your tv
          </Text>
        ) : null}

        <TitleInput
          inputPlaceholder={itemName === 'TV' ? '32 inch' : '7 kg'}
          keyboardType={'numeric'}
          title={
            itemName === 'Washing Machine'
              ? 'Capacity * (Kg)'
              : 'Screen Size * (inch)'
          }
          boxStyle={featureEmpty ? styles.mb4 : styles.mb12}
          value={feature}
          type={'feature'}
          setValue={handleInputChange}
        />

        {featureEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {itemName === 'Washing Machine'
              ? `please enter capacity in litres`
              : `please enter screen size of the tv`}
          </Text>
        )}

        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          boxStyle={styles.mb12}
          multiline={true}
          numberOfLines={4}
          type={'additionalInformation'}
          value={additionalInformation}
          setValue={handleInputChange}
        />
        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb40}
          type={'askingPrice'}
          value={askingPrice}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter asking price
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

export default TV_WashingMachine;
