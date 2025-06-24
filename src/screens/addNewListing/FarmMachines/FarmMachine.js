import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const FarmMachine = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;
  const [askingPrice, setAskingPrice] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setAskingPrice(itemData?.askingPrice.toString());
      setAdditionalInformation(itemData?.additionalInformation);
    }
  }, []);

  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmpty] =
    useState(false);

  const goToMedia = async () => {
    if (!askingPrice && !additionalInformation) {
      setAskingPriceEmpty(true);
      setAdditionalInformationEmpty(true);
    }

    if (!askingPrice) {
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
            askingPrice,
            additionalInformation,
          },
        };

        const {response, status} = await put(url, body, true);
        if (status === 200) {
          console.log(
            response,
            status,
            'response while updating farm machine ad',
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
          console.log(status, 'status is not 200 while updating farm machine');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: itemName + ' available for sale',
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'askingPrice') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setAskingPrice(text);
        setAskingPriceEmpty(false);
      }
    } else {
      setAdditionalInformation(text);
      setAdditionalInformationEmpty(false);
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
          title={'Asking Price *'}
          inputPlaceholder={'2000'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb12}
          keyboardType={'numeric'}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter asking price
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Add more additional details'}
          boxStyle={additionalInformationEmpty ? styles.mb12 : styles.mb36}
          multiline={true}
          numberOfLines={4}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        {additionalInformationEmpty && (
          <Text style={[{color: colors.red}, styles.mb36]}>
            Please enter additional information
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

export default FarmMachine;
