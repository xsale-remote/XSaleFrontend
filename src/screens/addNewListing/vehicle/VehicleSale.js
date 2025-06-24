import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  ToastAndroid,
  useColorScheme,
} from 'react-native';
import {
  Button,
  DropDown,
  TitleHeader,
  TitleInput,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import DatePicker from 'react-native-date-picker';
import {put} from '../../../utils/requestBuilder';

const VehicleSale = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const colorScheme = useColorScheme();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [registerationDate, setRegisterationDate] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [numberOfOwner, setNoOfOwner] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState(false);
  const [modelEmpty, setModelEmpty] = useState(false);
  const [registerationDateEmpty, setRegisterationDateEmpty] = useState(false);
  const [fuelTypeEmpty, setFuelTypeEmpty] = useState(false);
  const [transmissionEmpty, setTransmissionEmpty] = useState(false);
  const [kmDrivenEmpty, setKmDrivenEmpty] = useState(false);
  const [numberOfOwnerEmpty, setNoOfOwnerEmpty] = useState(false);
  const [additionalInformationEmpty, setAdditionalInformationEmpty] =
    useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);
  const transmissions = ['Automatic', 'Manual'];
  const fuelTypes = ['Diesel', 'Petrol', 'CNG', 'LPG', 'Electric'];
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setBrand(itemData?.brand);
      setModel(itemData?.model);
      setRegisterationDate(itemData?.registerationDate);
      setFuelType(itemData?.fuelType);
      setTransmission(itemData?.transmission);
      setKmDriven(itemData?.kmDriven.toString());
      setNoOfOwner(itemData?.numberOfOwner.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (
      !brand &&
      !model &&
      !registerationDate &&
      !fuelType &&
      !transmission &&
      !kmDriven &&
      !numberOfOwner &&
      !additionalInformation &&
      !askingPrice
    ) {
      setBrandEmpty(true);
      setModelEmpty(true);
      setRegisterationDateEmpty(true);
      setFuelTypeEmpty(true);
      setTransmissionEmpty(true);
      setKmDrivenEmpty(true);
      setNoOfOwnerEmpty(true);
      setAdditionalInformationEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!brand) {
      setBrandEmpty(true);
    } else if (!model) {
      setModelEmpty(true);
    } else if (!registerationDate) {
      setRegisterationDateEmpty(true);
    } else if (!fuelType) {
      setFuelTypeEmpty(true);
    } else if (!transmission) {
      setTransmissionEmpty(true);
    } else if (!kmDriven) {
      setKmDrivenEmpty(true);
    } else if (!numberOfOwner) {
      setNoOfOwnerEmpty(true);
    } else if (!additionalInformation) {
      setAdditionalInformationEmpty(true);
    } else if (!askingPrice) {
      setAskingPriceEmpty(true);
    } else {
      if (forEdit) {
        setIsLoading(true);
        const url = 'api/v1/listing/item/edit/item';
        const body = {
          categoryName,
          parentId,
          productType,
          itemId: itemData._id,
          updatedInfo: {
            brand,
            model,
            registerationDate,
            fuelType,
            transmission,
            kmDriven,
            numberOfOwner: numberOfOwner,
            additionalInformation,
            askingPrice,
            displayName: `${brand} ${model} available for sale`,
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
          console.log(status, 'status is not 200 while updating ', productType);
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: `${brand} ${model} available for sale`,
          brand,
          model,
          registerationDate,
          fuelType,
          transmission,
          kmDriven,
          numberOfOwner,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleDropdown = (index, type) => {
    if (type === 'fuelType') {
      setFuelType(fuelTypes[index]);
      setFuelTypeEmpty(false);
    } else if (type === 'transmission') {
      setTransmission(transmissions[index]);
      setTransmissionEmpty(false);
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const alphabeticText = text.replace(/[^a-zA-Z\s]/g, '');
      setBrand(alphabeticText);
      setBrandEmpty(false);
    } else if (type === 'model') {
      const validText = text.replace(/[^a-zA-Z0-9\s]/g, '');
      setModel(validText);
      setModelEmpty(false);
    } else if (type === 'kmDriven') {
      const regex = /^\d+$/;
      const filteredText = text.replace(/[^0-9]/g, '');
      setKmDriven(filteredText);
      setKmDrivenEmpty(false);
    } else if (type === 'noOfOwner') {
      const regex = /^\d+$/;
      const filteredText = text.replace(/[^0-9]/g, '');
      setNoOfOwner(filteredText);
      setNoOfOwnerEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
      setAdditionalInformationEmpty(false);
    } else if (type === 'askingPrice') {
      const regex = /^\d+$/;
      const filteredText = text.replace(/[^0-9]/g, '');
      setAskingPrice(filteredText);
      setAskingPriceEmpty(false);
    }
  };

  const handleDateChange = date => {
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    setRegisterationDate(formattedDate);
    setRegisterationDateEmpty(false);
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
      <ScrollView
        style={[styles.pdt12, {height: 'auto'}]}
        showsVerticalScrollIndicator={false}>
        <TitleInput
          title={`${itemName} Brand *`}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          setValue={handleInputChange}
          value={brand}
          type={'brand'}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            Brand is required
          </Text>
        )}
        <TitleInput
          title={`${itemName} Model *`}
          inputPlaceholder={'Enter Here'}
          boxStyle={modelEmpty ? styles.mb4 : styles.mb16}
          value={model}
          type={'model'}
          setValue={handleInputChange}
        />
        {modelEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            Model is required
          </Text>
        )}
        <View style={[styles.fdRow]}>
          <Button
            label={'Select Registeration Date *'}
            style={[
              {
                backgroundColor: 'transparent',
                borderWidth: 0.4,
                width: '70%',
              },
              styles.pdh8,
              styles.mb12,
              styles.mr16,
            ]}
            textStyle={{color: colors.black}}
            onPress={() => setOpenDatePicker(true)}
          />
          {registerationDate ? (
            <Text style={[styles.mt8, {color: colors.black}, styles.ts15]}>
              {registerationDate}
            </Text>
          ) : null}
        </View>
        {openDatePicker && (
          <View>
            <DatePicker
              mode="date"
              picker
              date={date}
              onDateChange={handleDateChange}
              maximumDate={date}
              style={{
                backgroundColor:
                  colorScheme === 'dark' ? colors.black : null
              }}
            />
            <Button
              label={'done'}
              style={[
                styles.mt8,
                styles.mb12,
                {width: '20%', alignSelf: 'center'},
              ]}
              onPress={() => {
                setOpenDatePicker(false);
              }}
            />
          </View>
        )}
        {registerationDateEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            Registeration year is required
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.fuelType : 'Please select...'}
          onSelect={e => handleDropdown(e, 'fuelType')}
          options={fuelTypes}
          title={'Fuel Type *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            fuelTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
        />
        {fuelTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            Fuel type is required
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.transmission : 'Please select...'}
          onSelect={e => handleDropdown(e, 'transmission')}
          options={transmissions}
          title={'Transmission *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            transmissionEmpty ? styles.mb4 : styles.mb12,
          ]}
        />
        {transmissionEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            Transmission is required
          </Text>
        )}
        <TitleInput
          title={'KM Driven *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={kmDrivenEmpty ? styles.mb4 : styles.mb12}
          value={kmDriven}
          type={'kmDriven'}
          setValue={handleInputChange}
        />
        {kmDrivenEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            Please enter how much KM is driven
          </Text>
        )}
        <TitleInput
          title={'Number of Owners *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={numberOfOwnerEmpty ? styles.mb4 : styles.mb12}
          value={numberOfOwner}
          type={'noOfOwner'}
          setValue={handleInputChange}
        />
        {numberOfOwnerEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            please enter no of owners
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter Here'}
          boxStyle={additionalInformationEmpty ? styles.mb4 : styles.mb12}
          multiline={true}
          numberOfLines={4}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        {additionalInformationEmpty && (
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
            {`Please enter some other details about the ${itemName}`}
          </Text>
        )}
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
          <Text style={[{color: colors.red}, styles.mt4, styles.mb12]}>
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
export default VehicleSale;
