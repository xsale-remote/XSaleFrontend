import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  DropDown,
  TitleHeader,
  TitleInput,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const CameraLense = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const productTypes = ['Camera', 'Lense'];
  const [product, setProduct] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [productEmpty, setProductEmpty] = useState(false);
  const [brandEmpty, setBrandEmpty] = useState(false);
  const [modelEmpty, setModelEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setProduct(itemData?.type);
      setBrand(itemData?.brand);
      setModel(itemData?.model);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!product && !brand && !model && !askingPrice) {
      setProductEmpty(true);
      setBrandEmpty(true);
      setModelEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!product) {
      setProductEmpty(true);
    } else if (!brand) {
      setBrandEmpty(true);
    } else if (!model) {
      setModelEmpty(true);
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
            product,
            brand,
            model,
            additionalInformation,
            askingPrice,
            displayName: `${product} available for sale`,
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
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: product + ' available for sale',
          product,
          brand,
          model,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };
  const handleDropdown = (index, value, type) => {
    if (type === 'productType') {
      setProduct(productTypes[index]);
      setProductEmpty(false);
    }
  };
  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBrand(text);
        setBrandEmpty(false);
      }
    } else if (type === 'model') {
      const isAlphanumericWithWhitespace = /^[a-zA-Z0-9\s]*$/;
      if (isAlphanumericWithWhitespace.test(text)) {
        setModel(text);
        setModelEmpty(false);
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
        <DropDown
          defaultValue={forEdit ? itemData?.type : 'Please select...'}
          options={productTypes}
          title={'What are you offering ? *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            productEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'productType'}
        />
        {productEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please select what are you offering
          </Text>
        )}
        <TitleInput
          title={'Brand Name *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          type={'brand'}
          setValue={handleInputChange}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter brand name
          </Text>
        )}
        <TitleInput
          title={'Model Name *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={modelEmpty ? styles.mb4 : styles.mb12}
          value={model}
          type={'model'}
          setValue={handleInputChange}
        />
        {modelEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter model name
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          multiline={true}
          numberOfLines={4}
          boxStyle={styles.mb12}
          type={'additionalInformation'}
          value={additionalInformation}
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
          <Text style={[{color: colors.red}, styles.mb36]}>
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

export default CameraLense;
