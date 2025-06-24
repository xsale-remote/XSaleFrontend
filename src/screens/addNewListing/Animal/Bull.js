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
import colors from '../../../assets/colors';
import {TitleHeader, Button, TitleInput} from '../../../component/shared';
import {put} from '../../../utils/requestBuilder';

const Bull = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [bullBreed, setBullBreed] = useState('');
  const [bullAge, setBullAge] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [bullBreedEmpty, setBullBreedEmpty] = useState(false);
  const [bullAgeEmpty, setBullAgeEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setBullBreed(itemData?.breed);
      setBullAge(itemData?.age.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const handleInputChange = (text, type) => {
    if (type === 'bullBreed') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBullBreed(text);
        setBullBreedEmpty(false);
      }
    } else if (type === 'bullAge') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setBullAge(text);
        setBullAgeEmpty(false);
      }
    } else if (type === 'askingPrice') {
      const numericText = text.replace(/[^0-9]/g, '');
      setAskingPrice(numericText);
      setAskingPriceEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
    }
  };

  const goToMedia = async () => {
    if (!bullBreed && !bullAge && !askingPrice) {
      setBullBreedEmpty(true);
      setBullAgeEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!bullBreed) {
      setBullAgeEmpty(true);
    } else if (!bullAge) {
      setBullAgeEmpty(true);
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
            breed: bullBreed,
            age: bullAge,
            additionalInformation,
            askingPrice,
            displayName: `${bullBreed} ${productType} available for sale`,
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
          displayName: bullBreed + ' ' + itemName + ' available for sale',
          bullBreed,
          bullAge,
          additionalInformation,
          askingPrice,
        });
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
      <ScrollView style={[styles.pdt12]}>
        <TitleInput
          title={`What's your Bull Breed ? *`}
          inputPlaceholder={'Enter Here'}
          boxStyle={bullBreedEmpty ? styles.mb4 : styles.mb12}
          value={bullBreed}
          setValue={handleInputChange}
          type={'bullBreed'}
        />
        {bullBreedEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter bull's breed
          </Text>
        )}
        <TitleInput
          title={`Age of your bull *(enter in months)`}
          inputPlaceholder={'Enter Here'}
          boxStyle={bullAgeEmpty ? styles.mb4 : styles.mb12}
          value={bullAge}
          setValue={handleInputChange}
          type={'bullAge'}
        />
        {bullAgeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter bull's age
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          multiline={true}
          boxStyle={styles.mb12}
          setValue={handleInputChange}
          value={additionalInformation}
          type={'additionalInformation'}
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
          <Text style={[{color: colors.red}, styles.mb24]}>
            Asking price is required
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

export default Bull;
