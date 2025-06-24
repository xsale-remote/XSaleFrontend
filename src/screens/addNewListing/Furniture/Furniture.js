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
import {TitleHeader, Button, TitleInput} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Furniture = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;
  const [furnitureName, setFurnitureName] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [nameEmpty, setNameEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmpty] =
    useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setFurnitureName(itemData.furnitureName);
      setAdditionalInformation(itemData.additionalInformation);
      setAskingPrice(itemData.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!furnitureName && !additionalInformation && !askingPrice) {
      setNameEmpty(true);
      setAdditionalInformationEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!furnitureName) {
      setNameEmpty(true);
    } else if (!additionalInformation) {
      setAdditionalInformationEmpty(true);
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
            furnitureName,
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
          console.log(status, 'status is not 200 while updating job');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          furnitureName,
          additionalInformation,
          askingPrice,
          displayName: furnitureName + ' available for sale',
        });
      }
    }
  };
  const handleInputChange = (text, type) => {
    if (type === 'furnitureName') {
      const isAlphanumeric = /^[a-zA-Z0-9\s]*$/;
      if (isAlphanumeric.test(text)) {
        setFurnitureName(text);
        setNameEmpty(false);
      }
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
      setAdditionalInformationEmpty(false);
    } else if (type === 'askingPrice') {
      const regex = /^[0-9]*$/;
      if (regex.test(text)) {
        setAskingPrice(text);
        setAskingPriceEmpty(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`${itemName ? itemName : productType} Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView style={[styles.pdt12]}>
        <TitleInput
          title={'Name of your Furniture *'}
          inputPlaceholder={'Enter here'}
          boxStyle={nameEmpty ? styles.mb4 : styles.mb12}
          value={furnitureName}
          type={'furnitureName'}
          setValue={handleInputChange}
        />
        {nameEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`furniture name is required`}
          </Text>
        )}
        <TitleInput
          title={'Additional details of your item *'}
          inputPlaceholder={'Type here additional information'}
          boxStyle={setAdditionalInformationEmpty ? styles.mb4 : styles.mb12}
          multiline={true}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        {additionalInformationEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please enter additional information`}
          </Text>
        )}
        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
          type={'askingPrice'}
          value={askingPrice}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please enter asking price`}
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

export default Furniture;
