import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  DropDown,
  TitleHeader,
  TitleInput,
  Button,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Bird = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;
  const priceUnitOption = ['Per piece', 'Per kg'];

  const [birdName, setBirdName] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [birdNameEmpty, setBirdNameEmpty] = useState(false);
  const [priceUnitEmpty, setPriceUnitEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setBirdName(itemData?.name);
      setAdditionalInformation(itemData?.additionalInformation);
      setPriceUnit(itemData?.quantityType);
      setAskingPrice(itemData?.askingPrice.toString());
      1;
    }
  }, []);

  const goToMedia = async () => {
    if (!birdName && !priceUnit && !askingPrice) {
      setBirdNameEmpty(true);
      setPriceUnitEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!birdName) {
      setBirdNameEmpty(true);
    } else if (!priceUnit) {
      setPriceUnitEmpty(true);
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
            name: birdName,
            additionalInformation,
            quantityType: priceUnit,
            askingPrice,
            displayName: `${birdName} available for sale`,
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
          displayName: birdName + ' available for sale',
          birdName,
          additionalInformation,
          priceUnit,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    console.log(text, type);
    if (type === 'birdName') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBirdName(text);
        setBirdNameEmpty(false);
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
    if (type === 'priceUnit') {
      setPriceUnit(priceUnitOption[index]);
      setPriceUnitEmpty(false);
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
          title={'Name of the Bird *'}
          inputPlaceholder={'Parrot'}
          boxStyle={birdNameEmpty ? styles.mb4 : styles.mb12}
          value={birdName}
          type={'birdName'}
          setValue={handleInputChange}
        />
        {birdNameEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter name of the bird
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
        <DropDown
          defaultValue={forEdit ? itemData?.quantityType : 'Please select...'}
          options={priceUnitOption}
          title={'Price (Select unit) *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            priceUnitEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'priceUnit'}
          onSelect={handleDropdown}
        />
        {priceUnitEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please select price unit
          </Text>
        )}

        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter here'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
          keyboardType={'numeric'}
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

export default Bird;
