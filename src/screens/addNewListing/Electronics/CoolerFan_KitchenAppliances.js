import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  TitleHeader,
  TitleInput,
  DropDown,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const CoolerFan_KitchenAppliances = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;
  const fansOption = [
    'Cooler',
    'Stand Fan',
    'Ceiling Fan',
    'Wall Fan',
    'Exhaust Fan',
  ];
  useEffect(() => {
    if (forEdit) {
      if (productType === 'Kitchen Appliances') {
        setApplianceName(itemData?.applianceName);
      } else {
        setSelectFan(itemData?.type);
      }
      setBrand(itemData?.brand);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const [selectFan, setSelectFan] = useState('');
  const [applianceName, setApplianceName] = useState('');
  const [brand, setBrand] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [selectFanEmpty, setSelectFanEmpty] = useState(false);
  const [applianceNameEmpty, setApplianceNameEmpty] = useState(false);
  const [brandEmpty, setBrandEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  const handleDropdown = (index, value, type) => {
    setSelectFan(fansOption[index]);
    setSelectFanEmpty(false);
  };

  const handleInputChange = (text, type) => {
    if (type === 'applianceName') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setApplianceName(text);
        setApplianceNameEmpty(false);
      }
    } else if (type === 'brand') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBrand(text);
        setBrandEmpty(false);
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
    if (itemName === 'Kitchen Appliances') {
      if (!applianceName && !brand && !askingPrice) {
        setApplianceNameEmpty(true);
        setBrandEmpty(true);
        setAskingPriceEmpty(true);
      }

      if (!applianceName) {
        setApplianceNameEmpty(true);
      } else if (!brand) {
        setBrandEmpty(true);
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
              applianceName,
              brand,
              additionalInformation,
              askingPrice,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              'response while updating services ad',
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
              'status is not 200 while updating farm machine',
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: applianceName + ' available for sale',
            applianceName,
            brand,
            additionalInformation,
            askingPrice,
          });
        }
      }
    } else if (itemName === 'Coolers and Fans') {
      if (!selectFan && !brand && !askingPrice) {
        setSelectFanEmpty(true);
        setBrandEmpty(true);
        setAskingPriceEmpty(true);
      }

      if (!selectFan) {
        setSelectFanEmpty(true);
      } else if (!brand) {
        setBrandEmpty(true);
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
              type: selectFan,
              brand,
              additionalInformation,
              askingPrice,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              'response while updating services ad',
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
              'status is not 200 while updating farm machine',
            );
          }
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: selectFan + ' available for sale',
            fanType : selectFan,
            brand,
            additionalInformation,
            askingPrice,
          });
        }
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
        {itemName === 'Coolers and Fans' ? (
          <DropDown
            defaultValue={forEdit ? itemData?.type : 'Please select...'}
            options={fansOption}
            title={'What are you selling *'}
            titleStyle={[styles.ts17, styles.fw400]}
            style={[
              {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
              selectFanEmpty ? styles.mb4 : styles.mb12,
            ]}
            onSelect={handleDropdown}
            type={'selectFan'}
          />
        ) : (
          <TitleInput
            title={'Appliance Name *'}
            inputPlaceholder={'Enter here'}
            boxStyle={applianceNameEmpty ? styles.mb4 : styles.mb12}
            value={applianceName}
            type={'applianceName'}
            setValue={handleInputChange}
          />
        )}
        {selectFanEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Select what are you selling`}
          </Text>
        )}
        {applianceNameEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please enter appliance name`}
          </Text>
        )}

        <TitleInput
          title={
            itemName === 'Coolers and Fans' ? 'Brand *' : 'Appliance Brand *'
          }
          inputPlaceholder={'Enter here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          setValue={handleInputChange}
          type={'brand'}
          value={brand}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please enter brand name`}
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
        <TitleInput
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb48}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please enter asking price`}
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

export default CoolerFan_KitchenAppliances;
