import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  useColorScheme
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

const Bike_Scooty = ({navigation, route}) => {
  const type = route.params;
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const colorScheme = useColorScheme(); 

  const fuelTypes = ['Petrol', 'Electric'];
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [registerationDate, setRegisterationDate] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [kmDriven, setKmDriven] = useState('');
  const [noOfOwner, setNoOfOwner] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState('');
  const [modelEmpty, setModelEmpty] = useState('');
  const [registerationDateEmpty, setRegisterationDateEmpty] = useState('');
  const [fuelTypeEmpty, setFuelTypeEmpty] = useState('');
  const [kmDrivenEmpty, setKmDrivenEmpty] = useState('');
  const [noOfOwnerEmpty, setNoOfOwnerEmpty] = useState('');
  const [askingPriceEmpty, setAskingPriceEmpty] = useState('');

  useEffect(() => {
    if (forEdit) {
      setBrand(itemData?.brand);
      setModel(itemData?.model);
      setRegisterationDate(itemData?.registerationDate);
      setFuelType(itemData?.fuelType);
      setKmDriven(itemData?.kmDriven);
      setNoOfOwner(itemData?.numberOfOwner);
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
      !kmDriven &&
      !noOfOwner &&
      !askingPrice
    ) {
      setBrandEmpty(true);
      setModelEmpty(true);
      setRegisterationDateEmpty(true);
      setFuelTypeEmpty(true);
      setKmDrivenEmpty(true);
      setNoOfOwnerEmpty(true);
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
    } else if (!kmDriven) {
      setKmDrivenEmpty(true);
    } else if (!noOfOwner) {
      setNoOfOwner(true);
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
            brand,
            model,
            registerationDate,
            fuelType,
            kmDriven,
            numberOfOwner: noOfOwner,
            additionalInformation,
            askingPrice,
            displayName: `${brand} ${model} available for sale`,
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
          displayName: brand + ' ' + model + ' available for sale',
          brand,
          model,
          registerationDate,
          fuelType,
          kmDriven,
          noOfOwner,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleDateChange = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      date = today;
    }

    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    setRegisterationDate(formattedDate);
    setRegisterationDateEmpty(false);
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const alphabeticText = text.replace(/[^a-zA-Z\s]/g, ''); // for alphabets only include white space entry
      setBrand(alphabeticText);
      setBrandEmpty(false);
    } else if (type === 'model') {
      const validText = text.replace(/[^a-zA-Z0-9\s]/g, ''); // for entering number and character include white space entry
      setModel(validText);
      setModelEmpty(false);
    } else if (type === 'kmDriven') {
      const regex = /^[0-9]*$/; // Regular expression to allow only numbers
      if (regex.test(text)) {
        setKmDriven(text);
        setKmDrivenEmpty(false);
      }
    } else if (type === 'noOfOwner') {
      const regex = /^[0-9]*$/; // Regular expression to allow only numbers
      if (regex.test(text)) {
        setNoOfOwner(text);
        setNoOfOwnerEmpty(false);
      }
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
    } else if (type === 'askingPrice') {
      const regex = /^[0-9]*$/; // Regular expression to allow only numbers
      if (regex.test(text)) {
        setAskingPrice(text);
        setAskingPriceEmpty(false);
      }
    }
  };
  const handleDropdown = index => {
    setFuelType(fuelTypes[index]);
    setFuelTypeEmpty(false);
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
        <TitleInput
          title={'Brand *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          type={'brand'}
          setValue={handleInputChange}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Brand of ${itemName} is required`}
          </Text>
        )}
        <TitleInput
          title={'Model *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={modelEmpty ? styles.mb4 : styles.mb12}
          value={model}
          type={'model'}
          setValue={handleInputChange}
        />
        {modelEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
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
          <Text style={[{color: colors.red}, styles.mb12]}>
            Registeration year is required
          </Text>
        )}
        <DropDown
          options={fuelTypes}
          defaultValue={forEdit ? itemData?.fuelType : 'Please select...'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            fuelTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          title={'Fuel Type *'}
          onSelect={handleDropdown}
        />
        {fuelTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Fuel type is required
          </Text>
        )}
        <TitleInput
          title={'KM Driven *'}
          inputPlaceholder={'Enter here'}
          keyboardType={'numeric'}
          boxStyle={kmDrivenEmpty ? styles.mb4 : styles.mb12}
          value={kmDriven}
          type={'kmDriven'}
          setValue={handleInputChange}
        />
        {kmDrivenEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter how much KM is driven
          </Text>
        )}
        <TitleInput
          title={'Number of Owner *'}
          keyboardType={'numeric'}
          boxStyle={noOfOwnerEmpty ? styles.mb4 : styles.mb12}
          inputPlaceholder={'Enter here'}
          value={noOfOwner}
          type={'noOfOwner'}
          setValue={handleInputChange}
        />
        {noOfOwnerEmpty ? (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter number of previous owner
          </Text>
        ) : null}
        <TitleInput
          title={'Additional Information'}
          multiline={true}
          inputPlaceholder={'Enter here'}
          boxStyle={styles.mb12}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        <TitleInput
          title={'Asking Price *'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
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

export default Bike_Scooty;
