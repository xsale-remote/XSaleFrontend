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
  TitleHeader,
  TitleInput,
  DropDown,
  Button,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Chicken = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;
  const sellingOption = ['Chicken', 'Chicks', 'Eggs'];
  const priceUnitOption = ['Per Piece', 'Per Kg'];

  const [itemSelling, setItemSelling] = useState('');
  const [havePoultryFarm, setHavePoultryFarm] = useState(null);
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [itemSellingEmpty, setItemSellingEmpty] = useState(false);
  const [quantityAvailableEmpty, setQuantityAvailableEmpty] = useState(false);
  const [priceUnitEmpty, setPriceUnitEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setItemSelling(itemData?.type);
      setHavePoultryFarm(itemData?.havePoultryFarm);
      setQuantityAvailable(itemData?.quantity.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setPriceUnit(itemData?.quantityType);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

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
            havePoultryFarm,
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
          categoryName,
          itemName,
          displayName: itemSelling + ' available for sale',
          havePoultryFarm,
          quantityAvailable,
          priceUnit,
          additionalInformation,
          askingPrice,
          itemSelling,
        });
      }
    }
  };
  const handleInputChange = (text, type) => {
    if (type === 'quantityAvailable') {
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
  const handleDropdown = (index, value, type) => {
    if (type === 'sellingOption') {
      setItemSelling(sellingOption[index]);
      setItemSellingEmpty(false);
    } else if (type === 'priceUnit') {
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
        <DropDown
          defaultValue={forEdit ? itemData?.type : 'Please select...'}
          options={sellingOption}
          title={'What do you want to sell *'}
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
        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          Do you have Poultry Farm ?
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Yes'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  havePoultryFarm === 'yes' ? colors.mintGreen : 'transparent',
                borderWidth: havePoultryFarm === 'yes' ? null : 1,
              },
            ]}
            textStyle={{
              color: havePoultryFarm === 'yes' ? colors.white : colors.black,
            }}
            onPress={() => {
              setHavePoultryFarm('yes');
            }}
          />
          <Button
            label={'No'}
            style={{
              backgroundColor:
                havePoultryFarm === 'no' ? colors.mintGreen : 'transparent',
              borderWidth: havePoultryFarm === 'no' ? null : 1,
            }}
            textStyle={{
              color: havePoultryFarm === 'no' ? colors.white : colors.black,
            }}
            onPress={() => {
              setHavePoultryFarm('no');
            }}
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
          type={'additionalInformation'}
          value={additionalInformation}
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

export default Chicken;
