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
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import {put} from '../../../utils/requestBuilder';

const OtherElectronics = ({navigation, route}) => {
  const type = route.params;
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [name, setName] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [nameEmpty, setNameEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmpty] =
    useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);
  useEffect(() => {
    if (forEdit) {
      setName(itemData?.name);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const handleInputChange = (text, type) => {
    if (type === 'name') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setName(text);
        setNameEmpty(false);
      }
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
      setAdditionalInformationEmpty(false);
    } else if (type === 'askingPrice') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setAskingPrice(text);
        setAskingPriceEmpty(false);
      }
    }
  };
  const goToMedia = async () => {
    if (!name && !additionalInformation && !askingPrice) {
      setNameEmpty(true);
      setAdditionalInformationEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!name) {
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
            name,
            additionalInformation,
            askingPrice,
            displayName: `${name} available for sale`,
          },
        };
        console.log(body, 'body for update');
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          console.log(
            response,
            status,
            'response while updating other electronics ad',
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
            response,
            'status is not 200 while updating other electronics',
          );
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: name + ' available for sale',
          name,
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
        titleStyle={[{fontSize: 17.5, marginTop: 10}]}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView style={[styles.pdt12]}>
        <TitleInput
          title={`What are you selling ? *`}
          inputPlaceholder={'Enter here'}
          boxStyle={nameEmpty ? styles.mb4 : styles.mb12}
          titleStyle={styles.ts16}
          value={name}
          type={'name'}
          setValue={handleInputChange}
        />
        {nameEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please describe what are you selling
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          multiline={true}
          numberOfLines={4}
          boxStyle={additionalInformationEmpty ? styles.mb4 : styles.mb12}
          type={'additionalInformation'}
          value={additionalInformation}
          setValue={handleInputChange}
        />
        {additionalInformationEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter additional information
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
          <Text style={[{color: colors.red}, styles.mb36]}>
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

export default OtherElectronics;
