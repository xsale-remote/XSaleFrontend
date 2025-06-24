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
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import colors from '../../../assets/colors';
import styles from '../../../assets/styles';
import DatePicker from 'react-native-date-picker';
import {put} from '../../../utils/requestBuilder';

const CowBuffalo = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
    const colorScheme = useColorScheme();
    
  const [breed, setBreed] = useState('');
  const [currentMilk, setCurrentMilk] = useState('');
  const [totalMilk, setTotalMilk] = useState('');
  const [hasDeliveredBaby, setHasDeliveredBaby] = useState('no');
  const [whenDelivered, setWhenDelivered] = useState('');
  const [hasKid, setHasKid] = useState('no');
  const [isPregnant, setIsPregnant] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [breedEmpty, setBreedEmpty] = useState(false);
  const [totalMilkEmpty, setTotalMilkEmpty] = useState(false);
  const [isPregnantEmpty, setIsPregnantEmtpy] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setBreed(itemData?.breed);
      setCurrentMilk(itemData?.currentCapacity.toString());
      setTotalMilk(itemData?.maximumCapacity.toString());
      setHasDeliveredBaby(itemData?.hasDeliveredBaby);
      if (itemData?.hasDeliveredBaby === 'Yes') {
        setOpenDatePicker(true);
      }
      setWhenDelivered(itemData?.whenDelivered);
      setHasKid(itemData?.hasKid);
      setIsPregnant(itemData?.isPregnant);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!breed && !totalMilk && !isPregnant && askingPrice) {
      setBreedEmpty(true);
      setTotalMilkEmpty(true);
      setIsPregnantEmtpy(true);
      setAskingPriceEmpty(true);
    }

    if (!breed) {
      setBreedEmpty(true);
    } else if (!totalMilk) {
      setTotalMilkEmpty(true);
    } else if (!isPregnant) {
      setIsPregnantEmtpy(true);
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
            breed,
            currentCapacity: currentMilk,
            maximumCapacity: totalMilk,
            hasDeliveredBaby,
            whenDelivered,
            hasKid,
            isPregnant,
            additionalInformation,
            askingPrice,
            displayName: `${breed} ${productType} available for sale`,
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
          displayName: breed + ' ' + itemName + ' available for sale',
          breed,
          currentMilk,
          totalMilk,
          hasDeliveredBaby,
          whenDelivered,
          hasKid,
          isPregnant,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };
  const handleInputChange = (text, type) => {
    if (type === 'breed') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBreed(text);
        setBreedEmpty(false);
      }
    } else if (type === 'currentMilk') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setCurrentMilk(text);
      }
    } else if (type === 'totalMilk') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setTotalMilk(text);
        setTotalMilkEmpty(false);
      }
    } else if (type === 'currentMilk') {
      setAdditionalInformation(text);
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

  const handleDateChange = date => {
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    setWhenDelivered(formattedDate);
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
          title={`What's your ${itemName} Breed ? *`}
          inputPlaceholder={itemName === 'Cow' ? 'Jersey' : 'Enter here'}
          boxStyle={breedEmpty ? styles.mb4 : styles.mb12}
          value={breed}
          type={'breed'}
          setValue={handleInputChange}
        />
        {breedEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please enter breed of the ${itemName}`}
          </Text>
        )}
        <TitleInput
          title={`Current Milk per day`}
          inputPlaceholder={'10 liter'}
          keyboardType={'numeric'}
          boxStyle={styles.mb12}
          value={currentMilk}
          type={'currentMilk'}
          setValue={handleInputChange}
        />
        <TitleInput
          title={`Total Milk capacity per day *`}
          inputPlaceholder={'25 liter'}
          keyboardType={'numeric'}
          boxStyle={totalMilkEmpty ? styles.mb4 : styles.mb12}
          value={totalMilk}
          type={'totalMilk'}
          setValue={handleInputChange}
        />
        {totalMilkEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please enter total milk capacity per day`}
          </Text>
        )}
        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          {`has the ${itemName} delivered baby ?`}
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Yes'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  hasDeliveredBaby === 'Yes' ? colors.mintGreen : 'transparent',
                borderWidth: hasDeliveredBaby === 'Yes' ? null : 1,
              },
            ]}
            textStyle={{
              color: hasDeliveredBaby === 'Yes' ? colors.white : colors.black,
            }}
            onPress={() => {
              setHasDeliveredBaby('Yes');
              setOpenDatePicker(true);
            }}
          />
          <Button
            label={'No'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  hasDeliveredBaby === 'No' ? colors.mintGreen : 'transparent',
                borderWidth: hasDeliveredBaby === 'No' ? null : 1,
              },
            ]}
            textStyle={{
              color: hasDeliveredBaby === 'No' ? colors.white : colors.black,
            }}
            onPress={() => {
              setHasDeliveredBaby('No');
              setOpenDatePicker(false);
              setWhenDelivered('');
            }}
          />
          {whenDelivered ? (
            <Text
              style={[
                {color: colors.black, alignSelf: 'center', marginTop: 2},
                styles.ts18,
                styles.fwBold,
              ]}>
              {whenDelivered}
            </Text>
          ) : null}
        </View>
        {openDatePicker && (
          <>
            <Text
              style={[
                styles.ts17,
                {color: colors.black},
                styles.fw400,
                styles.mb8,
              ]}>
              When was the delivery ?
            </Text>
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
                  styles.mt16,
                  styles.mb12,
                  {width: '20%', alignSelf: 'center'},
                ]}
                onPress={() => {
                  setOpenDatePicker(false);
                }}
              />
            </View>
          </>
        )}

        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          {`Is there is a baby with the ${itemName}`}
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Yes'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  hasKid === 'Yes' ? colors.mintGreen : 'transparent',
                borderWidth: hasKid === 'Yes' ? null : 1,
              },
            ]}
            textStyle={{color: hasKid === 'Yes' ? colors.white : colors.black}}
            onPress={() => {
              setHasKid('Yes');
            }}
          />
          <Button
            label={'No'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  hasKid === 'No' ? colors.mintGreen : 'transparent',
                borderWidth: hasKid === 'No' ? null : 1,
              },
            ]}
            textStyle={{color: hasKid === 'No' ? colors.white : colors.black}}
            onPress={() => {
              setHasKid('No');
            }}
          />
        </View>

        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          {`Is the ${itemName} pregnant ? *`}
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Yes'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  isPregnant === 'Yes' ? colors.mintGreen : 'transparent',
                borderWidth: isPregnant === 'Yes' ? null : 1,
              },
            ]}
            textStyle={{
              color: isPregnant === 'Yes' ? colors.white : colors.black,
            }}
            onPress={() => {
              setIsPregnant('Yes');
            }}
          />
          <Button
            label={'No'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  isPregnant === 'No' ? colors.mintGreen : 'transparent',
                borderWidth: isPregnant === 'No' ? null : 1,
              },
            ]}
            textStyle={{
              color: isPregnant === 'No' ? colors.white : colors.black,
            }}
            onPress={() => {
              setIsPregnant('No');
            }}
          />
        </View>
        {isPregnantEmpty && (
          <Text style={[{color: colors.red}, styles.mb36]}>
            {`please select one option`}
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
          title={`Asking price *`}
          inputPlaceholder={'10000'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb36}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />

        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb36]}>
            {`please enter age of the ${itemName}`}
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

export default CowBuffalo;
