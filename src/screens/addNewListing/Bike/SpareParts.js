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
import {Button, TitleHeader, TitleInput} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const SpareParts = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const [sparePart, setSparePart] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [sparePartEmpty, setSparePartEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmpty] =
    useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setSparePart(itemData?.sparePartName);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!sparePart && !askingPrice && !additionalInformation) {
      setSparePartEmpty(true);
      setAskingPriceEmpty(true);
      setAdditionalInformationEmpty(true);
    }

    if (!sparePart) {
      setSparePartEmpty(true);
    } else if (!askingPrice) {
      setAskingPriceEmpty(true);
    } else if (!additionalInformation) {
      setAdditionalInformationEmpty(true);
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
            sparePartName: sparePart,
            additionalInformation,
            askingPrice,
            displayName: `${sparePart} available for sale`,
          },
        };
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          console.log(response, status, 'response while updating services ad');
          ToastAndroid.showWithGravityAndOffset(
            'Ad updated successfully',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          navigation.pop();
        } else {
          console.log(status, 'status is not 200 while updating farm machine');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: sparePart + ' available for sale',
          sparePart,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'sparePart') {
      const validText = text.replace(/[^a-zA-Z0-9\s]/g, '');
      setSparePart(validText);
      setSparePartEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
      setAdditionalInformationEmpty(false);
    } else if (type === 'askingPrice') {
      const regex = /^[0-9]*$/; // Regular expression to allow only numbers
      if (regex.test(text)) {
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
        <TitleInput
          title={'Spare Part Name *'}
          inputPlaceholder={'Enter here'}
          boxStyle={sparePartEmpty ? styles.mb4 : styles.mb12}
          value={sparePart}
          type={'sparePart'}
          setValue={handleInputChange}
        />
        {sparePartEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter Spare part name
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter here'}
          multiline={true}
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
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb28}
          title={'Asking Price'}
          inputPlaceholder={'Enter here'}
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

export default SpareParts;
