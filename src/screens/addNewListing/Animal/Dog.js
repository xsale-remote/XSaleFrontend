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
  TitleHeader,
  TitleInput,
  Button,
  DropDown,
} from '../../../component/shared';
import colors from '../../../assets/colors';
import styles from '../../../assets/styles';
import {put} from '../../../utils/requestBuilder';

const Dog = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const vaccinationOption = ['No Vaccination', 'DHPP'];
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [vaccination, setVaccination] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [breedEmpty, setBreedEmpty] = useState(false);
  const [genderEmpty, setGenderEmpty] = useState(false);
  const [ageEmpty, setAgeEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  const handleDropdown = (index, value, type) => {
    setVaccination(vaccinationOption[index]);
  };
  useEffect(() => {
    if (forEdit) {
      setGender(itemData?.gender);
      setBreed(itemData?.breed);
      setAge(itemData?.age.toString());
      setVaccination(itemData?.vaccination);
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);
  const handleInputChange = (text, type) => {
    if (type === 'breed') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBreed(text);
        setBreedEmpty(false);
      }
    } else if (type === 'age') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setAge(text);
        setAgeEmpty(false);
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
    if (!gender && !breed && !age && !askingPrice) {
      setGenderEmpty(true);
      setBreedEmpty(true);
      setAgeEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!gender) {
      setGenderEmpty(true);
    } else if (!breed) {
      setBreedEmpty(true);
    } else if (!age) {
      setAgeEmpty(true);
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
            gender,
            breed,
            age,
            vaccination,
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
          gender,
          breed,
          age,
          vaccination,
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
      <ScrollView
        style={[styles.pdt12, {height: 'auto'}]}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.ts17,
            {color: colors.black},
            styles.fw400,
            styles.mb8,
          ]}>
          What are you selling ? *
        </Text>
        <View style={[styles.fdRow, styles.mb12]}>
          <Button
            label={'Male'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  gender === 'Male' ? colors.mintGreen : 'transparent',
                borderWidth: gender === 'Male' ? null : 1,
              },
            ]}
            textStyle={{color: gender === 'Male' ? colors.white : colors.black}}
            onPress={() => {
              setGender('Male');
              setGenderEmpty(false);
            }}
          />
          <Button
            label={'Female'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  gender === 'Female' ? colors.mintGreen : 'transparent',
                borderWidth: gender === 'Female' ? null : 1,
              },
            ]}
            textStyle={{
              color: gender === 'Female' ? colors.white : colors.black,
            }}
            onPress={() => {
              setGender('Female');
              setGenderEmpty(false);
            }}
          />
          <Button
            label={'Puppy'}
            style={{
              backgroundColor:
                gender === 'Puppy' ? colors.mintGreen : 'transparent',
              borderWidth: gender === 'Puppy' ? null : 1,
            }}
            textStyle={{
              color: gender === 'Puppy' ? colors.white : colors.black,
            }}
            onPress={() => {
              setGender('Puppy');
              setGenderEmpty(false);
            }}
          />
        </View>
        {genderEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please select gender of the ${itemName}`}
          </Text>
        )}
        <TitleInput
          title={`What's your ${itemName} Breed ? *`}
          inputPlaceholder={'Pitbull'}
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
          title={`Age of your ${itemName} * (In months)`}
          inputPlaceholder={'10 months'}
          keyboardType={'numeric'}
          boxStyle={ageEmpty ? styles.mb4 : styles.mb12}
          setValue={handleInputChange}
          type={'age'}
          value={age}
        />
        {ageEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please enter age of the ${itemName}`}
          </Text>
        )}
        <DropDown
          defaultValue={forEdit ? itemData?.vaccination : 'Please Select...'}
          options={vaccinationOption}
          title={'Vaccination Details'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            styles.mb12,
          ]}
          onSelect={handleDropdown}
        />
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
            {`please enter asking price for the ${itemName}`}
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

export default Dog;
