import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../../../assets/styles';
import {Button, TitleHeader, TitleInput} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Tablet = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [monthsOld, setMonthsOld] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState('');
  const [modelEmpty, setModelEmpty] = useState('');
  const [monthsOldEmpty, setMonthsOldEmpty] = useState('');
  const [askingPriceEmpty, setAskingPriceEmpty] = useState('');

  useEffect(() => {
    if (forEdit) {
      setBrand(itemData?.brand);
      setModel(itemData?.model);
      setMonthsOld(itemData?.oldInMonths.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!brand && !model && !monthsOld && !askingPrice) {
      setBrandEmpty(true);
      setModelEmpty(true);
      setMonthsOldEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!brand) {
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
            brand,
            model,
            oldInMonths: monthsOld,
            additionalInformation,
            askingPrice,
            displayName: `${brand} tablet ${model} available for sale`,
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
          monthsOld,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const alphabeticText = text.replace(/[^a-zA-Z\s]/g, '');
      setBrand(alphabeticText);
      setBrandEmpty(false);
    } else if (type === 'model') {
      // const regex = /^[a-zA-Z0-9\s]+$/;
      const alphaNumericText = text.replace(/[^a-zA-Z0-9\s]/g, '');
      setModel(alphaNumericText);
      setModelEmpty(false);
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
          title={'Brand *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          setValue={handleInputChange}
          type={'brand'}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Brand of Tablet is required
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

export default Tablet;
