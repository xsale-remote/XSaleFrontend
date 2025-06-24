import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {
  DropDown,
  TitleHeader,
  TitleInput,
  Button,
} from '../../../component/shared';
import {put} from '../../../utils/requestBuilder';

const Hostel = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [propertyType, setPropertyType] = useState('');
  const [availableFor, setAvailablfor] = useState('');
  const [mealIncludes, setMealIncludes] = useState('');
  const [roomSharing, setRoomSharing] = useState('');
  const [bathroom, setBathroom] = useState('');
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
  const [availableForEmpty, setAvailablforEmpty] = useState(false);
  const [mealIncludesEmpty, setMealIncludesEmpty] = useState(false);
  const [roomSharingEmpty, setRoomSharingEmpty] = useState(false);
  const [bathroomEmpty, setBathroomEmpty] = useState(false);
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
      setAvailablfor(itemData?.availableFor);
      setMealIncludes(itemData?.mealIncludes);
      setRoomSharing(itemData?.roomSharing);
      setBathroom(itemData?.bathroom);
      setListedBy(itemData?.listedBy);
      setCarpetArea(itemData?.carpetArea.toString());
      setTotalFloor(itemData?.totalFloor.toString());
      setWhichFloor(itemData?.whichFloor.toString());
      setLiftAvailable(itemData?.liftAvailable);
      setParkingAvailable(itemData?.parkingAvailable);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const handleInputChange = (text, type) => {
    console.log(text, type, 'this is valye');
    if (type === 'carpetArea') {
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

  const handleDropdown = (index, value, type) => {
    console.log(index, value, type);
    if (type === 'propertyType') {
      setPropertyType(value);
      setPropertyTypeEmpty(false);
    } else if (type === 'availableFor') {
      setAvailablfor(value);
      setAvailablforEmpty(false);
    } else if (type === 'mealIncludes') {
      setMealIncludes(value);
      setMealIncludesEmpty(false);
    } else if (type === 'roomSharing') {
      setRoomSharing(value);
      setRoomSharingEmpty(false);
    } else if (type === 'bathroom') {
      setBathroom(value);
      setBathroomEmpty(false);
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

  const goToMedia = async () => {
    if (
      !propertyType &&
      !availableFor &&
      !mealIncludes &&
      !roomSharing &&
      !bathroom &&
      !listedBy &&
      !carpetArea &&
      !totalFloor &&
      !whichFloor &&
      !liftAvailable &&
      !parkingAvailable &&
      !askingPrice
    ) {
      setPropertyTypeEmpty(true);
      setAvailablforEmpty(true);
      setMealIncludesEmpty(true);
      setRoomSharingEmpty(true);
      setBathroomEmpty(true);
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
    } else if (!availableFor) {
      setAvailablforEmpty(true);
    } else if (!mealIncludes) {
      setMealIncludesEmpty(true);
    } else if (!roomSharing) {
      setRoomSharingEmpty(true);
    } else if (!bathroom) {
      setBathroomEmpty(true);
    } else if (!listedBy) {
      setListedByEmpty(true);
    } else if (!carpetArea) {
      setCarpetArea(true);
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
        console.log('first ');
        setIsLoading(true);
        const url = `api/v1/listing/item/edit/item`;
        const body = {
          categoryName,
          parentId,
          productType,
          itemId: itemData._id,
          updatedInfo: {
            type: propertyType,
            availableFor,
            mealIncludes,
            roomSharing,
            bathroom,
            listedBy,
            carpetArea,
            totalFloor,
            whichFloor,
            liftAvailable,
            parkingAvailable,
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
          console.log(
            status,
            'status is not 200 while updating pg/hostel rent ',
          );
        }
        setIsLoading(false);
        console.log('second');
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: propertyType + ' available for rent',
          propertyType,
          availableFor,
          mealIncludes,
          roomSharing,
          bathroom,
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
          options={['PG / Hostel', 'Guest House']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Type of Property *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            propertyTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'propertyType'}
        />
        {propertyTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select property type
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.availableFor : 'Please select...'}
          options={['Male', 'Female', 'Male & Female both']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Available for? *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            availableForEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'availableFor'}
        />
        {availableForEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select available for
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.mealIncludes : 'Please select...'}
          options={['Yes', 'No', 'Available on Extra cost']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Meal includes ? *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            mealIncludesEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'mealIncludes'}
        />
        {mealIncludesEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select meal providing option
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.roomSharing : 'Please select...'}
          options={[
            'Single Room',
            '2 sharing',
            '3 sharing',
            '4 sharing',
            '4+ sharing',
          ]}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Room Sharing *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            roomSharingEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'roomSharing'}
        />
        {roomSharingEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please select room sharing
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.bathroom : 'Please select...'}
          options={['Attached Bathroom', 'Common Bathroom']}
          titleStyle={[styles.ts17, styles.fw400]}
          title={'Bathroom *'}
          onSelect={handleDropdown}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            bathroomEmpty ? styles.mb4 : styles.mb12,
          ]}
          type={'bathroom'}
        />
        {bathroomEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please select bathroom
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
            Please select who is listing
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

export default Hostel;
