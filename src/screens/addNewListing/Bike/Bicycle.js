import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
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

const Bicycle = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [bicycleElectric, setBicycleElectric] = useState('');
  const [monthsOld, setMonthsOld] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [brandEmpty, setBrandEmpty] = useState(false);
  const [modelEmpty, setModelEmpty] = useState(false);
  const [bicycleElectricEmpty, setBicycleElectricEmpty] = useState(false);
  const [monthsOldEmpty, setMonthsOldEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setBrand(itemData?.brand);
      setModel(itemData?.model);
      setBicycleElectric(itemData?.isElectric);
      setMonthsOld(itemData?.oldInMonths);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!brand && !model && !bicycleElectric && !monthsOld && !askingPrice) {
      setBrandEmpty(true);
      setModelEmpty(true);
      setBicycleElectricEmpty(true);
      setMonthsOldEmpty(true);
      setAskingPriceEmpty(true);
    }
    if (!brand) {
      setBrandEmpty(true);
    } else if (!model) {
      setModelEmpty(true);
    } else if (!bicycleElectric) {
      setBicycleElectricEmpty(true);
    } else if (!monthsOld) {
      setMonthsOldEmpty(true);
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
            isElectric: bicycleElectric,
            oldInMonths: monthsOld,
            additionalInformation,
            askingPrice,
            displayName: `${brand} ${model} available for sale`,
          },
        };
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          console.log(response, status, 'response while updating bicycle ad');
          ToastAndroid.showWithGravityAndOffset(
            'Ad updated successfully',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          navigation.pop();
        } else {
          console.log(status, 'status is not 200 while updating bicycle');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: brand + ' ' + model + ' availbale for sale',
          brand,
          model,
          bicycleElectric,
          monthsOld,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const alphabeticText = text.replace(/[^a-zA-Z\s]/g, '');
      setBrand(alphabeticText);
      setBrandEmpty(false);
    } else if (type === 'model') {
      const regex = /^[a-zA-Z0-9\s]+$/;
      if (regex.test(text)) {
        setModel(text);
        setModelEmpty(false);
      }
    } else if (type === 'monthsOld') {
      const numericText = text.replace(/[^0-9]/g, '');
      setMonthsOld(numericText);
      setMonthsOldEmpty(false);
    } else if (type === 'additionalInformation') {
      setAdditionalInformation(text);
    } else if (type === 'askingPrice') {
      const numericText = text.replace(/[^0-9]/g, '');
      setAskingPrice(numericText);
      setAskingPriceEmpty(false);
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
        <TitleInput
          title={'Brand *'}
          inputPlaceholder={'Enter here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          type={'brand'}
          setValue={handleInputChange}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Brand of Bicycle is required
          </Text>
        )}
        <TitleInput
          title={'Model *'}
          inputPlaceholder={'Enter here'}
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
        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          Is this Bicycle electric ? *
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Yes'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  bicycleElectric === 'yes' ? colors.mintGreen : 'transparent',
                borderWidth: bicycleElectric === 'yes' ? null : 1,
              },
            ]}
            textStyle={{
              color: bicycleElectric === 'yes' ? colors.white : colors.black,
            }}
            onPress={() => {
              setBicycleElectric('yes');
              setBicycleElectricEmpty(false);
            }}
          />
          <Button
            label={'No'}
            style={{
              backgroundColor:
                bicycleElectric === 'no' ? colors.mintGreen : 'transparent',
              borderWidth: bicycleElectric === 'no' ? null : 1,
            }}
            textStyle={{
              color: bicycleElectric === 'no' ? colors.white : colors.black,
            }}
            onPress={() => {
              setBicycleElectric('no');
              setBicycleElectricEmpty(false);
            }}
          />
        </View>
        {bicycleElectricEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select one option
          </Text>
        )}
        <TitleInput
          title={'How much old ? * (In Month)'}
          inputPlaceholder={'Enter here'}
          keyboardType={'numeric'}
          boxStyle={monthsOldEmpty ? styles.mb4 : styles.mb12}
          value={monthsOld}
          type={'monthsOld'}
          setValue={handleInputChange}
        />
        {monthsOldEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            old in months is required
          </Text>
        )}
        <TitleInput
          title={'Additional Information'}
          inputPlaceholder={'Enter here'}
          multiline={true}
          boxStyle={styles.mb12}
          value={additionalInformation}
          type={'additionalInformation'}
          setValue={handleInputChange}
        />
        <TitleInput
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
          title={'Asking Price *'}
          inputPlaceholder={'Enter here'}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            asking price is required
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

export default Bicycle;
