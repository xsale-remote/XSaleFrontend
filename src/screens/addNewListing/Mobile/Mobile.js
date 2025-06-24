import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Mobile = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [ram, setRam] = useState('');
  const [internalStorage, setInternalStorage] = useState('');
  const [monthsOld, setMonthsOld] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState(false);
  const [modelEmpty, setModelEmpty] = useState(false);
  const [ramEmpty, setRamEmpty] = useState(false);
  const [internalStorageEmpty, setInternalStorageEmpty] = useState(false);
  const [monthsOldEmpty, setMonthsOldEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    setBrand(itemData?.brand);
    setModel(itemData?.model);
    setRam(itemData?.ram.toString());
    setInternalStorage(itemData?.internalStorage.toString());
    setMonthsOld(itemData?.oldInMonths.toString());
    setAdditionalInformation(itemData?.additionalInformation);
    setAskingPrice(itemData?.askingPrice.toString());
  }, []);

  const goToMedia = async () => {
    if (
      !brand &&
      !model &&
      !ram &&
      !internalStorage &&
      !monthsOld &&
      !askingPrice
    ) {
      setBrandEmpty(true);
      setModelEmpty(true);
      setRamEmpty(true);
      setInternalStorageEmpty(true);
      setMonthsOldEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!brand) {
      setBrandEmpty(true);
    } else if (!model) {
      setModelEmpty(true);
    } else if (!ram) {
      setRamEmpty(true);
    } else if (!internalStorage) {
      setInternalStorageEmpty(true);
    } else if (!monthsOld) {
      setMonthsOldEmpty(true);
    } else if (!askingPrice) {
      setAskingPriceEmpty(true);
    } else {
      if (forEdit) {
        setIsLoading(true);
        const url = 'api/v1/listing/item/edit/item';
        const body = {
          categoryName,
          parentId,
          productType,
          itemId: itemData._id,
          updatedInfo: {
            brand,
            model,
            ram,
            internalStorage,
            oldInMonths: monthsOld,
            additionalInformation,
            askingPrice,
            displayName: `${brand} ${model} available for sale`,
          },
        };
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          console.log(
            response,
            status,
            `response while updating ${productType} ad`,
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
          console.log(status, 'status is not 200 while updating ', productType);
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: `${brand} ${model} available for sale`,
          brand,
          model,
          ram,
          internalStorage,
          monthsOld,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const regex = /^[a-zA-Z\s]*$/; // Allow empty string
      if (regex.test(text)) {
        setBrand(text);
        setBrandEmpty(false);
      }
    } else if (type === 'model') {
      const regex = /^[a-zA-Z0-9\s]+$/;
      if (regex.test(text)) {
        setModel(text);
        setModelEmpty(false);
      }
    } else if (type === 'ram') {
      const numericText = text.replace(/[^0-9]/g, '');
      setRam(numericText);
      setRamEmpty(false);
    } else if (type === 'internalStorage') {
      const numericText = text.replace(/[^0-9]/g, '');
      setInternalStorage(numericText);
      setInternalStorageEmpty(false);
    } else if (type === 'monthsOld') {
      const numericText = text.replace(/[^0-9]/g, '');
      setMonthsOld(numericText);
      setMonthsOldEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
    } else if (type === 'askingPrice') {
      const numericText = text.replace(/[^0-9]/g, '');
      setAskingPrice(numericText);
      setAskingPriceEmpty(false);
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
      <ScrollView
        style={[styles.pdt12, {height: 'auto'}]}
        showsVerticalScrollIndicator={false}>
        <TitleInput
          title={`${itemName} Brand *`}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          type={'brand'}
          value={brand}
          setValue={handleInputChange}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Brand of Mobile is required
          </Text>
        )}
        <TitleInput
          title={`${itemName} Model *`}
          inputPlaceholder={'Enter Here'}
          boxStyle={modelEmpty ? styles.mb4 : styles.mb12}
          value={model}
          type={'model'}
          setValue={handleInputChange}
        />
        {modelEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Model is required
          </Text>
        )}
        <TitleInput
          title={`Ram *`}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={ramEmpty ? styles.mb4 : styles.mb12}
          value={ram}
          type={'ram'}
          setValue={handleInputChange}
        />
        {ramEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            ram is required
          </Text>
        )}
        <TitleInput
          title={'Internal Storage * (enter in gb)'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={internalStorageEmpty ? styles.mb4 : styles.mb12}
          value={internalStorage}
          type={'internalStorage'}
          setValue={handleInputChange}
        />
        {internalStorageEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            internal storage information required
          </Text>
        )}
        <TitleInput
          title={'How much old your mobile ?* (In month)'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={monthsOldEmpty ? styles.mb4 : styles.mb12}
          value={monthsOld}
          type={'monthsOld'}
          setValue={handleInputChange}
        />
        {monthsOldEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            old in months is required
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          multiline={true}
          numberOfLines={4}
          boxStyle={styles.mb12}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb40}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
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

export default Mobile;
