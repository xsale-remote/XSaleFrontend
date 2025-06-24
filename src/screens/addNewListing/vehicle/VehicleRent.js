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
import {
  Button,
  DropDown,
  TitleHeader,
  TitleInput,
} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const VehicleRent = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const goToMedia = async () => {
    const url = 'api/v1/listing/item/edit/item';
    if (itemName === 'Car' || productType === 'Car') {
      if (!carType && !carModel && !carAvailable && !carFarePerKm) {
        setCarTypeEmpty(true);
        setCarModelEmpty(true);
        setCarAvailibilityEmpty(true);
        setCarFarePerKmEmpty(true);
      }
      if (!carType) {
        setCarTypeEmpty(true);
      } else if (!carModel) {
        setCarModelEmpty(true);
      } else if (!carAvailable) {
        setCarAvailibilityEmpty(true);
      } else if (!carFarePerKm) {
        setCarFarePerKmEmpty(true);
      } else {
        if (forEdit) {
          setIsLoading(true);
          const body = {
            categoryName,
            parentId,
            productType,
            itemId: itemData._id,
            updatedInfo: {
              vehicleType: carType,
              vehicleModel: carModel,
              availibility: carAvailable,
              additionalInformation: carAdditionalInformation,
              fareKm: carFarePerKm,
              displayName: `${carModel} available for rent`,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              `response while updating ${productType} ad`,
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
              'status is not 200 while updating ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: `${carModel} available for rent`,
            carType,
            carModel,
            carAvailable,
            carAdditionalInformation,
            askingPrice: carFarePerKm,
          });
        }
      }
    } else if (itemName === 'Ambulance' || productType === 'Ambulance') {
      if (!ambulanceAvailable && !ambulanceFare) {
        setAmbulanceAvailableEmpty(true);
        setAmbulanceFareEmpty(true);
      }
      if (!ambulanceAvailable) {
        setAmbulanceAvailableEmpty(true);
      } else if (!ambulanceFare) {
        setAmbulanceAvailableEmpty(true);
      } else {
        if (forEdit) {
          setIsLoading(true);
          const body = {
            categoryName,
            parentId,
            productType,
            itemId: itemData._id,
            updatedInfo: {
              availibility: ambulanceAvailable,
              additionalInformation: ambulanceInformation,
              fareKm: ambulanceFare,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              `response while updating ${productType} ad`,
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
              'status is not 200 while updating ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: `${itemName} available for rent`,
            ambulanceAvailable,
            additionalInformation: ambulanceInformation,
            askingPrice: ambulanceFare,
          });
        }
      }
    } else if (itemName === 'Bus' || productType === 'Bus') {
      if (!busModel && !seatInBus && !busFare) {
        setBusModelEmpty(true);
        setSeatInBusEmpty(true);
        setBusFareEmpty(true);
      }
      if (!busModel) {
        setBusModelEmpty(true);
      } else if (!seatInBus) {
        setSeatInBusEmpty(true);
      } else if (!busFare) {
        setBusFareEmpty(true);
      } else {
        if (forEdit) {
          setIsLoading(true);
          const body = {
            categoryName,
            parentId,
            productType,
            itemId: itemData._id,
            updatedInfo: {
              vehicleModel: busModel,
              seatsInBus: seatInBus,
              isBusAc,
              additionalInformation,
              fareKm: busFare,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              `response while updating ${productType} ad`,
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
              'status is not 200 while updating ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: `${itemName} available for rent`,
            busModel,
            seatInBus,
            isBusAc,
            additionalInformation,
            askingPrice: busFare,
          });
        }
      }
    } else {
      if (!vehicleModel && !vehicleFare) {
        setVehicleModelEmpty(true);
        setVehicleFareEmpty(true);
      }

      if (!vehicleModel) {
        setVehicleModelEmpty(true);
      } else if (!vehicleFare) {
        setVehicleFareEmpty(true);
      } else {
        if (forEdit) {
          setIsLoading(true);
          const body = {
            categoryName,
            parentId,
            productType,
            itemId: itemData._id,
            updatedInfo: {
              vehicleModel,
              additionalInformation: additionalInfo,
              fareKm: vehicleFare,
            },
          };
          const {response, status} = await put(url, body, true);
          if (status === 200) {
            console.log(
              response,
              status,
              `response while updating ${productType} ad`,
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
              'status is not 200 while updating ',
              productType,
            );
          }
          setIsLoading(false);
        } else {
          navigation.navigate('Media', {
            categoryName,
            itemName,
            displayName: `${itemName} available for rent`,
            additionalInfo,
            vehicleModel,
            askingPrice: vehicleFare,
          });
        }
      }
    }
  };

  //  For Car
  const carTypes = ['SUV', 'Sedan', 'Hatchback'];
  const carAvailibility = ['24 Hours', 'Only in Day', 'Only in Night'];
  const [carType, setCarType] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carAvailable, setCarAvailable] = useState('');
  const [carAdditionalInformation, setCarAdditionalInformation] = useState('');
  const [carFarePerKm, setCarFarePerKm] = useState('');
  const [carTypeEmpty, setCarTypeEmpty] = useState(false);
  const [carModelEmpty, setCarModelEmpty] = useState(false);
  const [carAvailableEmpty, setCarAvailibilityEmpty] = useState(false);
  const [carFarePerKmEmpty, setCarFarePerKmEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCarInput = (text, type) => {
    if (type === 'carModel') {
      const isAlphanumericWithWhitespace = /^[a-zA-Z0-9\s]*$/;
      if (isAlphanumericWithWhitespace.test(text)) {
        setCarModel(text);
        setCarModelEmpty(false);
      }
    } else if (type === 'farePerKm') {
      const regex = /^\d+$/;
      if (text === '' || regex.test(text)) {
        setCarFarePerKm(text);
        setCarFarePerKmEmpty(false);
      }
    } else if (type === 'additionalInformation') {
      setCarAdditionalInformation(text);
    }
  };

  const handleCarDropDown = (index, type, value) => {
    if (type === 'CarAvailibility') {
      setCarAvailable(carAvailibility[index]);
      setCarAvailibilityEmpty(false);
    } else if (type === 'CarType') {
      setCarType(carTypes[index]);
      setCarTypeEmpty(false);
    }
  };

  // for ambulance
  const ambulanceAvailibility = ['24 Hours', 'Only in Day', 'Only in Night'];
  const [ambulanceAvailable, setAmbulanceAvailable] = useState('');
  const [ambulanceInformation, setAmbulanceInformation] = useState('');
  const [ambulanceFare, setAmbulanceFare] = useState('');
  const [ambulanceAvailableEmpty, setAmbulanceAvailableEmpty] = useState(false);
  const [ambulanceFareEmpty, setAmbulanceFareEmpty] = useState(false);

  const ambulanceDropdown = (index, type) => {
    setAmbulanceAvailable(type);
    setAmbulanceAvailableEmpty(false);
  };
  const handleAmbulanceInput = (text, type) => {
    if (type === 'ambulanceFare') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setAmbulanceFare(text);
        setAmbulanceFareEmpty(false);
      }
    } else if (type === 'ambulanceInformation') {
      setAmbulanceInformation(text);
    }
  };

  //  for remaining vehicles
  const [vehicleModel, setVehicleModel] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [vehicleFare, setVehicleFare] = useState('');
  const [vehicleModelEmpty, setVehicleModelEmpty] = useState(false);
  const [vehicleFareEmpty, setVehicleFareEmpty] = useState(false);

  const handleVehicleInput = (text, type) => {
    if (type === 'vehicleModel') {
      const filteredText = text.replace(/[^a-zA-Z0-9\s]/g, '');
      setVehicleModel(filteredText);
      setVehicleModelEmpty(false);
    } else if (type === 'vehicleFare') {
      const filteredText = text.replace(/[^0-9]/g, '');
      setVehicleFare(filteredText);
      setVehicleFareEmpty(false);
    } else if (type === 'additionalInfo') {
      setAdditionalInfo(text);
    }
  };

  // for bus
  const [busModel, setBusModel] = useState('');
  const [seatInBus, setSeatInBus] = useState('');
  const [isBusAc, setIsBusAc] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [busFare, setBusFare] = useState('');

  const [busModelEmpty, setBusModelEmpty] = useState(false);
  const [seatInBusEmpty, setSeatInBusEmpty] = useState(false);
  const [busFareEmpty, setBusFareEmpty] = useState(false);

  const handleBusInputChange = (text, type) => {
    if (type === 'busModel') {
      const isAlphanumericWithWhitespace = /^[a-zA-Z0-9\s]*$/;
      if (isAlphanumericWithWhitespace.test(text)) {
        setBusModel(text);
        setBusModelEmpty(false);
      }
    } else if (type === 'seatInBus') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setSeatInBus(text);
        setSeatInBusEmpty(false);
      }
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
    } else if (type === 'busFare') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setBusFare(text);
        setBusFareEmpty(false);
      }
    }
  };

  useEffect(() => {
    if (forEdit) {
      if (productType === 'Car') {
        setCarType(itemData?.vehicleType);
        setCarModel(itemData?.vehicleModel);
        setCarAvailable(itemData?.availibility);
        setCarAdditionalInformation(itemData?.additionalInformation);
        setCarFarePerKm(itemData?.fareKm.toString());
      } else if (productType === 'Ambulance') {
        setAmbulanceAvailable(itemData?.availibility);
        setAmbulanceInformation(itemData?.additionalInformation);
        setAmbulanceFare(itemData?.fareKm.toString());
      } else if (productType === 'Bus') {
        setBusModel(itemData?.vehicleModel);
        setSeatInBus(itemData?.seatsInBus.toString());
        setIsBusAc(itemData?.isBusAc);
        setAdditionalInformation(itemData?.additionalInformation);
        setBusFare(itemData?.fareKm.toString());
      } else {
        setVehicleModel(itemData?.vehicleModel);
        setAdditionalInfo(itemData?.additionalInformation);
        setVehicleFare(itemData?.fareKm.toString());
      }
    }
  }, []);

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`${itemName} for rent Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView style={[styles.pdt12]} showsVerticalScrollIndicator={false}>
        {itemName === 'Car' && (
          <>
            <DropDown
              defaultValue={
                forEdit ? itemData?.vehicleType : 'Please select...'
              }
              options={carTypes}
              title={'Select Car Type *'}
              titleStyle={[styles.ts17, styles.fw400]}
              style={[
                {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
                carTypeEmpty ? styles.mb4 : styles.mb12,
              ]}
              onSelect={e => handleCarDropDown(e, 'CarType')}
            />
            {carTypeEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Car type is required
              </Text>
            )}

            <TitleInput
              title={'Car Model *'}
              inputPlaceholder={'Enter here'}
              boxStyle={carModelEmpty ? styles.mb4 : styles.mb12}
              value={carModel}
              type={'carModel'}
              setValue={handleCarInput}
            />
            {carModelEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Car model is required
              </Text>
            )}
            <DropDown
              defaultValue={
                forEdit ? itemData?.availibility : 'Please select...'
              }
              options={carAvailibility}
              title={'Car Availability *'}
              titleStyle={[styles.ts17, styles.fw400]}
              style={[
                {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
                carAvailableEmpty ? styles.mb4 : styles.mb12,
              ]}
              onSelect={e => handleCarDropDown(e, 'CarAvailibility')}
            />
            {carAvailableEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Car availibility is required
              </Text>
            )}
            <TitleInput
              title={'Additional Information'}
              inputPlaceholder={'Enter Here'}
              multiline={true}
              boxStyle={styles.mb12}
              setValue={handleCarInput}
              value={carAdditionalInformation}
              type={'additionalInformation'}
            />
            <TitleInput
              title={'Fare per KM *'}
              inputPlaceholder={'Enter here'}
              keyboardType={'numeric'}
              boxStyle={carFarePerKmEmpty ? styles.mb4 : styles.mb12}
              setValue={handleCarInput}
              value={carFarePerKm}
              type={'farePerKm'}
            />
            {carFarePerKmEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Fare price is required
              </Text>
            )}
          </>
        )}
        {itemName === 'Bus' && (
          <>
            <TitleInput
              title={`${itemName} Model *`}
              inputPlaceholder={'Enter here'}
              boxStyle={busModelEmpty ? styles.mb4 : styles.mb12}
              type={'busModel'}
              value={busModel}
              setValue={handleBusInputChange}
            />

            {busModelEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Please enter model of the bus
              </Text>
            )}
            <TitleInput
              title={`No of seats in your Bus *`}
              inputPlaceholder={'Enter here'}
              boxStyle={seatInBusEmpty ? styles.mb4 : styles.mb12}
              type={'seatInBus'}
              value={seatInBus}
              setValue={handleBusInputChange}
              keyboardType={'numeric'}
            />
            {seatInBusEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Please enter number of seats
              </Text>
            )}
            <Text
              style={[
                styles.ts17,
                {color: colors.black},
                styles.fw400,
                styles.mb8,
              ]}>
              Is this AC Bus ?
            </Text>
            <View style={[styles.fdRow, styles.mb12]}>
              <Button
                label={'Yes'}
                style={[
                  styles.mr20,
                  {
                    backgroundColor:
                      isBusAc === 'Yes' ? colors.mintGreen : 'transparent',
                    borderWidth: isBusAc === 'Yes' ? null : 1,
                  },
                ]}
                textStyle={{
                  color: isBusAc === 'Yes' ? colors.white : colors.black,
                }}
                onPress={() => setIsBusAc('Yes')}
              />
              <Button
                label={'No'}
                style={{
                  backgroundColor:
                    isBusAc === 'No' ? colors.mintGreen : 'transparent',
                  borderWidth: isBusAc === 'No' ? null : 1,
                }}
                textStyle={{
                  color: isBusAc === 'No' ? colors.white : colors.black,
                }}
                onPress={() => setIsBusAc('No')}
              />
            </View>
            <TitleInput
              title={'Additional Information'}
              inputPlaceholder={'Enter Here'}
              multiline={true}
              boxStyle={styles.mb12}
              setValue={handleBusInputChange}
              value={additionalInformation}
              type={'additionalInformation'}
            />
            <TitleInput
              title={'Fare per KM *'}
              inputPlaceholder={'Enter here'}
              keyboardType={'numeric'}
              type={'busFare'}
              setValue={handleBusInputChange}
              value={busFare}
              boxStyle={busFareEmpty && styles.mb4}
            />
            {busFareEmpty && (
              <Text style={[{color: colors.red}, styles.mb12]}>
                Please enter fare per km
              </Text>
            )}
          </>
        )}
        {itemName === 'Ambulance' && (
          <>
            <DropDown
              defaultValue={
                forEdit ? itemData?.availibility : 'Please select...'
              }
              options={ambulanceAvailibility}
              title={'Ambulance Available on'}
              titleStyle={[styles.ts17, styles.fw400]}
              style={[
                {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
                ambulanceAvailableEmpty ? styles.mb4 : styles.mb12,
              ]}
              onSelect={ambulanceDropdown}
            />
            {ambulanceAvailableEmpty && (
              <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
                Please select ambulance availibility
              </Text>
            )}
            <TitleInput
              title={'Additional Information'}
              inputPlaceholder={'Enter Here'}
              multiline={true}
              boxStyle={styles.mb12}
              setValue={handleAmbulanceInput}
              value={ambulanceInformation}
              type={'ambulanceInformation'}
            />
            <TitleInput
              title={'Fare per KM *'}
              inputPlaceholder={'Enter here'}
              keyboardType={'numeric'}
              value={ambulanceFare}
              setValue={handleAmbulanceInput}
              type={'ambulanceFare'}
            />
            {ambulanceFareEmpty && (
              <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
                Please Enter Fare per KM
              </Text>
            )}
          </>
        )}
        {itemName !== 'Car' &&
          itemName !== 'Bus' &&
          itemName !== 'Ambulance' && (
            <>
              <TitleInput
                title={`${itemName} Model *`}
                inputPlaceholder={'Enter here'}
                boxStyle={vehicleModelEmpty ? styles.mb4 : styles.mb12}
                setValue={handleVehicleInput}
                type={'vehicleModel'}
                value={vehicleModel}
              />
              {vehicleModelEmpty && (
                <Text style={[{color: colors.red}, styles.mb12]}>
                  Vehicle type is required
                </Text>
              )}
              <TitleInput
                title={'Additional Information'}
                inputPlaceholder={'Enter Here'}
                multiline={true}
                boxStyle={styles.mb12}
                setValue={handleVehicleInput}
                value={additionalInfo}
                type={'additionalInfo'}
              />
              <TitleInput
                title={'Fare per KM *'}
                inputPlaceholder={'Enter here'}
                keyboardType={'numeric'}
                type={'vehicleFare'}
                value={vehicleFare}
                setValue={handleVehicleInput}
                boxStyle={vehicleFareEmpty ? styles.mb4 : styles.mb12}
              />
              {vehicleFareEmpty && (
                <Text style={[{color: colors.red}, styles.mb12]}>
                  Vehicle Fare is required
                </Text>
              )}
            </>
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
          style={[styles.mt20, {marginBottom: 100}]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VehicleRent;
