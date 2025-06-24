import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Services = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;

  useEffect(() => {
    if (forEdit) {
      setType(itemData?.type);
      setAdTitle(itemData?.adTitle);
      setAdditionalInformation(itemData?.additionalInformation);
    }
  }, []);

  const [type, setType] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [typeEmpty, setTypeEmpty] = useState(false);
  const [adTitleEmpty, setAdTitleEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmpty] =
    useState(false);

  const handleInputChange = (text, type) => {
    if (type === 'type') {
      setType(text);
      setTypeEmpty(false);
    } else if (type === 'adTitle') {
      setAdTitle(text);
      setAdTitleEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
      setAdditionalInformationEmpty(false);
    }
  };
  const goToMedia = async () => {
    if (!type && !adTitle && !additionalInformation) {
      setTypeEmpty(true);
      setAdTitleEmpty(true);
      setAdditionalInformationEmpty(true);
    }

    if (!type) {
      setTypeEmpty(true);
    } else if (!adTitle) {
      setAdTitleEmpty(true);
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
            type,
            adTitle,
            additionalInformation,
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
          console.log(status, 'status is not 200 while updating services');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          type,
          adTitle,
          additionalInformation,
          displayName: adTitle + ' service available',
        });
      }
    }
  };

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`${itemName ? itemName : productType} Listing`}
        onBackPress={() => navigation.pop()}
        titleStyle={[
          itemName === 'Electronic Repair & Services' ? styles.ts17 : null,
          itemName === 'Electronic Repair & Services' ? styles.mt12 : null,
          itemName === 'Legal & Document Services' ? styles.mt12 : null,
          itemName === 'Legal & Document Services' ? styles.ts17 : null,
        ]}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView style={[styles.pdt12]} showsVerticalScrollIndicator={false}>
        <TitleInput
          title={'Type *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={typeEmpty ? styles.mb4 : styles.mb12}
          value={type}
          type={'type'}
          setValue={handleInputChange}
        />
        {typeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please enter type`}
          </Text>
        )}
        <TitleInput
          title={'Ad title *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={adTitleEmpty ? styles.mb4 : styles.mb12}
          value={adTitle}
          type={'adTitle'}
          setValue={handleInputChange}
        />
        {adTitleEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter title to show
          </Text>
        )}
        <TitleInput
          title={'additional Information *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={additionalInformationEmpty ? styles.mb4 : styles.mb36}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
          multiline={true}
        />
        {additionalInformationEmpty && (
          <Text style={[{color: colors.red}, styles.mb36]}>
            {`additional information about your ${itemName}`}
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

export default Services;
