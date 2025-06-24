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

const PropertyRent = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const residentialTypes = ['Flat', 'House', 'Farm House'];
  const commercialType = ['Shop', 'Office', 'Other commercial property'];
  const furnishingOptions = ['Furnished', 'Semi Furnished', 'Unfurnished'];

  const [propertyType, setPropertyType] = useState('');
  const [bedroom, setBedroom] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [listedBy, setListedBy] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [totalFloor, setTotalFloor] = useState('');
  const [whichFloor, setWhichFloor] = useState('');
  const [liftAvailable, setLiftAvailable] = useState('');
  const [parkingAvailable, setParkingAvailable] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [propertyTypeEmpty, setPropertyTypeEmpty] = useState(false);
  const [bedroomEmpty, setBedroomEmpty] = useState(false);
  const [bathroomEmpty, setBathroomEmpty] = useState(false);
  const [furnishingEmpty, setFurnishingEmpty] = useState(false);
  const [listedByEmpty, setListedByEmpty] = useState(false);
  const [carpetAreaEmpty, setCarpetAreaEmpty] = useState(false);
  const [totalFloorEmpty, setTotalFloorEmpty] = useState(false);
  const [whichFloorEmpty, setWhichFloorEmpty] = useState(false);
  const [liftAvailableEmpty, setLiftAvailableEmpty] = useState(false);
  const [parkingAvailableEmpty, setParkingAvailableEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setPropertyType(itemData?.type);
      setBedroom(itemData.bedroom.toString());
      setBathroom(itemData?.bathroom.toString());
      setFurnishing(itemData?.furnishing);
      setListedBy(itemData?.listedBy);
      setCarpetArea(itemData?.carpetArea.toString());
      setTotalFloor(itemData?.totalFloor.toString());
      setWhichFloor(itemData?.whichFloor.toString());
      setLiftAvailable(itemData?.liftAvailable);
      setParkingAvailable(itemData?.parkingAvailable);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
      if (productType === 'Residential') {
        console.log('here');
        // setBedroom(itemData?.bedroom.toString());
      }
    }
  }, []);

  const goToMedia = async () => {
    console.log('function called');
    if (
      !propertyType &&
      !bathroom &&
      !furnishing &&
      !listedBy &&
      !carpetArea &&
      !totalFloor &&
      !whichFloor &&
      !liftAvailable &&
      !parkingAvailable &&
      !askingPrice
    ) {
      setPropertyTypeEmpty(true);
      setBathroomEmpty(true);
      setFurnishingEmpty(true);
      setListedByEmpty(true);
      setCarpetAreaEmpty(true);
      setTotalFloorEmpty(true);
      setWhichFloorEmpty(true);
      setLiftAvailableEmpty(true);
      setParkingAvailableEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!propertyType) {
      setPropertyTypeEmpty(true);
    } else if (!bathroom) {
      setBathroomEmpty(true);
    } else if (!furnishing) {
      setFurnishingEmpty(true);
    } else if (!listedBy) {
      setListedByEmpty(true);
    } else if (!carpetArea) {
      setCarpetAreaEmpty(true);
    } else if (!totalFloor) {
      setTotalFloorEmpty(true);
    } else if (!whichFloor) {
      setWhichFloorEmpty(true);
    } else if (!liftAvailable) {
      setLiftAvailableEmpty(true);
    } else if (!parkingAvailable) {
      setParkingAvailableEmpty(true);
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
            bathroom,
            furnishing,
            listedBy,
            carpetArea,
            totalFloor,
            whichFloor,
            liftAvailable,
            parkingAvailable,
            additionalInformation,
            askingPrice,
            displayName: `${propertyType} available for rent`,
          },
        };

        if (productType === 'Residential') {
          body.updatedInfo.bedroom = bedroom;
        }

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
          displayName: `${propertyType} available for rent`,
          propertyType,
          bedroom,
          bathroom,
          furnishing,
          listedBy,
          carpetArea,
          totalFloor,
          whichFloor,
          liftAvailable,
          parkingAvailable,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleDropdown = (index, value, type) => {
    console.log(index, type, value);
    if (type === 'propertType') {
      setPropertyType(value);
      setPropertyTypeEmpty(false);
    } else if (type === 'furnishing') {
      setFurnishing(value);
      setFurnishingEmpty(false);
    } else if (type === 'listedBy') {
      setListedBy(value);
      setListedByEmpty(false);
    } else if (type === 'liftAvailable') {
      setLiftAvailable(value);
      setLiftAvailableEmpty(false);
    } else if (type === 'parkingAvailable') {
      setParkingAvailable(value);
      setParkingAvailableEmpty(false);
    }
  };
  const handleInputChange = (text, type) => {
    console.log(text, type);

    if (type === 'bathroom') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setBathroom(text);
        setBathroomEmpty(false);
      }
    } else if (type === 'bedroom') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setBedroom(text);
        setBathroomEmpty(false);
      }
    } else if (type === 'carpetArea') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setCarpetArea(text);
        setCarpetAreaEmpty(false);
      }
    } else if (type === 'totalFloor') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setTotalFloor(text);
        setTotalFloorEmpty(false);
      }
    } else if (type === 'whichFloor') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setWhichFloor(text);
        setWhichFloorEmpty(false);
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
          defaultValue={forEdit ? itemData?.type : 'Please select...'}
          options={
            itemName === 'Residential' ? residentialTypes : commercialType
          }
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            propertyTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          title={'Type of Property *'}
          onSelect={handleDropdown}
          type={'propertType'}
        />
        {propertyTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select type of property
          </Text>
        )}

        {itemName === 'Residential' && (
          <TitleInput
            keyboardType={'numeric'}
            title={'No of Bedroom *'}
            inputPlaceholder={'Enter here'}
            value={bedroom}
            setValue={handleInputChange}
            type={'bedroom'}
            boxStyle={bedroomEmpty ? styles.mb4 : styles.mb12}
          />
        )}
        {itemName === 'Residential' && bedroomEmpty ? (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter no of bedroom
          </Text>
        ) : null}
        <TitleInput
          keyboardType={'numeric'}
          title={'No of Bathroom *'}
          inputPlaceholder={'Enter here'}
          value={bathroom}
          setValue={handleInputChange}
          type={'bathroom'}
          boxStyle={bathroomEmpty ? styles.mb4 : styles.mb12}
        />
        {bathroomEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter no of bathroom
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.furnishing : 'Please select...'}
          options={furnishingOptions}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Furnishing status *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            furnishingEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'furnishing'}
        />
        {furnishingEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select furnishing status
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
          keyboardType={'numeric'}
          title={'Carpet Area *(sq ft)'}
          inputPlaceholder={'520 sq ft'}
          value={carpetArea}
          setValue={handleInputChange}
          type={'carpetArea'}
          boxStyle={carpetAreaEmpty ? styles.mb4 : styles.mb12}
        />
        {carpetAreaEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter the area of property
          </Text>
        )}

        <TitleInput
          title={'Total floor in this building *'}
          keyboardType={'numeric'}
          value={totalFloor}
          setValue={handleInputChange}
          type={'totalFloor'}
          boxStyle={totalFloorEmpty ? styles.mb4 : styles.mb12}
          inputPlaceholder={'5'}
        />
        {totalFloorEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter total floor in the building
          </Text>
        )}
        <TitleInput
          title={'On which floor property available *'}
          keyboardType={'numeric'}
          value={whichFloor}
          setValue={handleInputChange}
          type={'whichFloor'}
          boxStyle={whichFloorEmpty ? styles.mb4 : styles.mb12}
          inputPlaceholder={'5'}
        />
        {whichFloorEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter on which floor property is
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.liftAvailable : 'Please select...'}
          options={['Yes', 'No']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Lift Available ?*'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            liftAvailableEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'liftAvailable'}
        />
        {liftAvailableEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select lift option
          </Text>
        )}
        <DropDown
          defaultValue={
            forEdit ? itemData?.parkingAvailable : 'Please select...'
          }
          options={['Yes', 'No']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Parking Available ?*'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            parkingAvailableEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'parkingAvailable'}
        />
        {parkingAvailableEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select parking option
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

export default PropertyRent;
