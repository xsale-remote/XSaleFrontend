import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../../../assets/styles';
import {
  DropDown,
  TitleHeader,
  TitleInput,
  Button,
} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Accessories = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const accessoriesTypes = [
    'Smart Watch',
    'Headphone',
    'Ear bud',
    'Wireless Speaker',
    'Power Bank',
    'Other',
  ];
  const [accessoriesType, setAccessoriesType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [monthsOld, setMonthsOld] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [accessoriesTypeEmpty, setAccessoriesTypeEmpty] = useState(false);
  const [brandEmpty, setBrandEmpty] = useState('');
  const [modelEmpty, setModelEmpty] = useState('');
  const [monthsOldEmpty, setMonthsOldEmpty] = useState('');
  const [askingPriceEmpty, setAskingPriceEmpty] = useState('');

  useEffect(() => {
    if (forEdit) {
      setAccessoriesType(itemData?.accessoriesType);
      setBrand(itemData?.brand);
      setModel(itemData?.model);
      setMonthsOld(itemData?.monthsOld.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!accessoriesType && !brand && !model && !monthsOld && !askingPrice) {
      setAccessoriesTypeEmpty(true);
      setBrandEmpty(true);
      setModelEmpty(true);
      setMonthsOldEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!accessoriesType) {
      setAccessoriesTypeEmpty(true);
    } else if (!brand) {
      setBrandEmpty(true);
    } else if (!model) {
      setModelEmpty(true);
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
            accessoriesType,
            brand,
            model,
            monthsOld,
            additionalInformation,
            askingPrice,
            displayName: `${brand} ${accessoriesType} available for sale`,
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
          displayName: `${brand} ${accessoriesType} available for sale`,
          accessoriesType,
          brand,
          model,
          monthsOld,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleDropdown = index => {
    setAccessoriesType(accessoriesTypes[index]);
    setAccessoriesTypeEmpty(false);
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const regex = /^[a-zA-Z\s]+$/;
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
        <DropDown
          defaultValue={
            forEdit ? itemData?.accessoriesType : 'Please select...'
          }
          options={accessoriesTypes}
          title={'Types of Accessories *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            accessoriesTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
        />
        {accessoriesTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Accessories type is required
          </Text>
        )}
        <TitleInput
          title={'Brand *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          setValue={handleInputChange}
          type={'brand'}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Accessories brand is required
          </Text>
        )}
        <TitleInput
          title={'Model *'}
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
          title={'How much old ?* (In month)'}
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

export default Accessories;
