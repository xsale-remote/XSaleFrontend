import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../../../assets/styles';
import {Button, TitleHeader, TitleInput} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Fashion = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;
  const [clothing, setClothing] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');

  const [clothingEmpty, setClothingEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmtpy] =
    useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setClothing(itemData?.clothing);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const handleInputChange = (text, type) => {
    if (type === 'clothing') {
      setClothing(text);
      setClothingEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
      setAdditionalInformationEmtpy(false);
    } else if (type === 'askingPrice') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setAskingPrice(text);
        setAskingPriceEmpty(false);
      }
    }
  };

  const goToMedia = async () => {
    if (!clothing && !additionalInformation && !askingPrice) {
      setClothingEmpty(true);
      setAdditionalInformationEmtpy(true);
      setAskingPriceEmpty(true);
    }

    if (!clothing || clothing.length < 10) {
      setClothingEmpty(true);
    } else if (!additionalInformation || additionalInformation.length < 10) {
      setAdditionalInformationEmtpy(true);
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
            clothing,
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
          console.log(status, 'status is not 200 while updating fashion');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          displayName: `${clothing} available for sale`,
          itemName,
          clothing,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };
  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`${itemName ? itemName : productType} Fashion Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView style={[styles.pdt12]}>
        <TitleInput
          title={'What clothing item are you selling ? *'}
          boxStyle={clothingEmpty ? styles.mb4 : styles.mb12}
          inputPlaceholder={'Enter here'}
          value={clothing}
          type={'clothing'}
          setValue={handleInputChange}
        />
        {clothingEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter what are you selling at least 10 characters
          </Text>
        )}
        <TitleInput
          title={'Additional Information *'}
          boxStyle={additionalInformationEmpty ? styles.mb4 : styles.mb12}
          inputPlaceholder={'Enter here'}
          multiline={true}
          type={'additionalInformation'}
          value={additionalInformation}
          setValue={handleInputChange}
        />
        {additionalInformationEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter additional information atleat 10 characters required
          </Text>
        )}
        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter asking price
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

export default Fashion;
