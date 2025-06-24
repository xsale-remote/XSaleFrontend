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
import {
  TitleHeader,
  Button,
  TitleInput,
  DropDown,
} from '../../../component/shared';
import {put} from '../../../utils/requestBuilder';

const LandSale = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [propertyType, setPropertyType] = useState('');
  const [propertyArea, setPropertyArea] = useState('');
  const [measurementType, setMeasurementType] = useState('');
  const [listedBy, setListedBy] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [propertyTypeEmpty, setPropertyTypeEmpty] = useState(false);
  const [propertyAreaEmpty, setPropertyAreaEmpty] = useState(false);
  const [measurementTypeEmpty, setMeasurementTypeEmpty] = useState(false);
  const [listedByEmpty, setListedByEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setPropertyType(itemData?.type);
      setPropertyArea(itemData?.totalArea.toString());
      setMeasurementType(itemData?.measurementType);
      setListedBy(itemData?.listedBy);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData.askingPrice.toString());
    }
  }, []);

  const goToMedia = async function () {
    if (
      !propertyType &&
      !propertyArea &&
      !measurementType &&
      !listedBy &&
      !askingPrice
    ) {
      setPropertyTypeEmpty(true);
      setPropertyAreaEmpty(true);
      setMeasurementTypeEmpty(true);
      setListedByEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!propertyType) {
      setPropertyTypeEmpty(true);
    } else if (!propertyArea) {
      setPropertyAreaEmpty(true);
    } else if (!measurementType) {
      setMeasurementTypeEmpty(true);
    } else if (!listedBy) {
      setListedByEmpty(true);
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
            type: propertyType,
            totalArea: propertyArea,
            measurementType,
            listedBy,
            additionalInformation,
            askingPrice,
            displayName: `${propertyType} available for sale`,
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
          console.log(status, 'status is not 200 while updating land sale');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: `${propertyType} available for sale`,
          propertyType,
          propertyArea,
          measurementType,
          listedBy,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleDropdown = (index, value, type) => {
    console.log(index, value, type);
    if (type === 'propertyType') {
      setPropertyType(value);
      setPropertyTypeEmpty(false);
    } else if (type === 'measurementType') {
      setMeasurementType(value);
      setMeasurementTypeEmpty(false);
    } else if (type === 'listedBy') {
      setListedBy(value);
      setListedByEmpty(false);
    }
  };
  const handleInputChange = (text, type) => {
    console.log(text, type);
    if (type === 'propertyArea') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setPropertyArea(text);
        setPropertyAreaEmpty(false);
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
      <ScrollView style={[styles.pdt12]} showsVerticalScrollIndicator={false}>
        <DropDown
          defaultValue={forEdit ? itemData.type : 'Please select...'}
          options={['Agricultural Land', 'Residential Plot']}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            propertyTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          title={'Property Type *'}
          onSelect={handleDropdown}
          type={'propertyType'}
        />
        {propertyTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select type of property
          </Text>
        )}
        <TitleInput
          title={'Total area of the property *'}
          keyboardType={'numeric'}
          value={propertyArea}
          setValue={handleInputChange}
          type={'propertyArea'}
          boxStyle={propertyAreaEmpty ? styles.mb4 : styles.mb12}
          inputPlaceholder={'450'}
        />
        {propertyAreaEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter total area of the property
          </Text>
        )}
        <DropDown
          defaultValue={
            forEdit ? itemData?.measurementType : 'Please select...'
          }
          options={['Sq ft', 'Yard', 'Dhur', 'Kattha', 'Bigha', 'Acre']}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            measurementTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          title={'Measurement Type *'}
          onSelect={handleDropdown}
          type={'measurementType'}
        />
        {measurementTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select measurement type
          </Text>
        )}

        <DropDown
          defaultValue={forEdit ? itemData?.listedBy : 'Please select...'}
          options={['Owner', 'Broker']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Listed By *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            listedByEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'listedBy'}
        />
        {listedByEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select furnishing status
          </Text>
        )}

        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          multiline={true}
          boxStyle={styles.mb12}
          setValue={handleInputChange}
          value={additionalInformation}
          type={'additionalInformation'}
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
          <Text style={[{color: colors.red}, styles.mb40]}>
            Asking price is required
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

export default LandSale;
