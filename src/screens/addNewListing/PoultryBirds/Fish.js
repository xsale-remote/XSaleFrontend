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

const Fish = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const items = ['Fish', 'Seed'];
  const priceUnitOption = ['Per Piece', 'Per Kg'];
  const [itemSelling, setItemSelling] = useState('');
  const [breedName, setBreedName] = useState('');
  const [haveFishPound, setHaveFishPound] = useState(null);
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [itemSellingEmpty, setItemSellingEmpty] = useState(false);
  const [quantityAvailableEmpty, setQuantityAvailableEmpty] = useState(false);
  const [priceUnitEmpty, setPriceUnitEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setItemSelling(itemData?.type);
      setHaveFishPound(itemData?.hasFishPound);
      setQuantityAvailable(itemData?.quantityAvailable.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setPriceUnit(itemData?.quantityType);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const handleDropdown = (index, value, type) => {
    if (type === 'sellingOption') {
      setItemSelling(items[index]);
      setItemSellingEmpty(false);
    } else if (type === 'priceUnit') {
      setPriceUnit(priceUnitOption[index]);
      setPriceUnitEmpty(false);
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'breedName') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBreedName(text);
      }
    } else if (type === 'quantityAvailable') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setQuantityAvailable(text);
        setQuantityAvailableEmpty(false);
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

  const goToMedia = async () => {
    if (!itemSelling && !quantityAvailable && !priceUnit && !askingPrice) {
      setItemSellingEmpty(true);
      setQuantityAvailableEmpty(true);
      setPriceUnitEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!itemSelling) {
      setItemSellingEmpty(true);
    } else if (!quantityAvailable) {
      setQuantityAvailableEmpty(true);
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
            type: itemSelling,
            hasFishPound: haveFishPound,
            breed: breedName,
            quantity: quantityAvailable,
            additionalInformation,
            quantityType: priceUnit,
            askingPrice,
            displayName: `${itemSelling} available for sale`,
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
          itemName,
          categoryName,
          displayName: itemSelling + ' available for sale',
          itemSelling,
          breedName,
          hasFishPound: haveFishPound,
          quantityAvailable,
          additionalInformation,
          priceUnit,
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
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.pdt12]}>
        <DropDown
          defaultValue={forEdit ? itemData?.type : 'Please select...'}
          options={items}
          title={'What are you selling ? *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            itemSellingEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'sellingOption'}
          onSelect={handleDropdown}
        />
        {itemSellingEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select what are you selling
          </Text>
        )}
        {itemSelling === 'Fish' && (
          <TitleInput
            title={'Breed Name'}
            inputPlaceholder={'Rohu'}
            boxStyle={styles.mb12}
            type={'breedName'}
            value={breedName}
            setValue={handleInputChange}
          />
        )}
        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          Do you have fish pound ?
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Yes'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  haveFishPound === 'yes' ? colors.mintGreen : 'transparent',
                borderWidth: haveFishPound === 'yes' ? null : 1,
              },
            ]}
            textStyle={{
              color: haveFishPound === 'yes' ? colors.white : colors.black,
            }}
            onPress={() => setHaveFishPound('yes')}
          />
          <Button
            label={'No'}
            style={{
              backgroundColor:
                haveFishPound === 'no' ? colors.mintGreen : 'transparent',
              borderWidth: haveFishPound === 'no' ? null : 1,
            }}
            textStyle={{
              color: haveFishPound === 'no' ? colors.white : colors.black,
            }}
            onPress={() => setHaveFishPound('no')}
          />
        </View>
        <TitleInput
          title={'How much quantity available? * (In pcs)'}
          inputPlaceholder={'200 Pcs'}
          boxStyle={quantityAvailableEmpty ? styles.mb4 : styles.mb12}
          keyboardType={'numeric'}
          value={quantityAvailable}
          type={'quantityAvailable'}
          setValue={handleInputChange}
        />
        {quantityAvailableEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter quantity
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
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb40}
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

export default Fish;
