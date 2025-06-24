import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import colors from '../../../assets/colors';
import styles from '../../../assets/styles';
import {put} from '../../../utils/requestBuilder';

const Sheep_Goat = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const [gender, setGender] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [currentMilk, setCurrentMilk] = useState('');
  const [totalMilk, setTotalMilk] = useState('');
  const [hasDeliveredBaby, setHasDeliveredBaby] = useState('no');
  const [hasKid, setHasKid] = useState('');
  const [isPregnant, setIsPregnant] = useState('no');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [genderEmpty, setGenderEmpty] = useState(false);
  const [breedEmpty, setBreedEmpty] = useState(false);
  const [ageEmpty, setAgeEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

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
            currentCapacity: currentMilk,
            maximumCapacity: totalMilk,
            hasDeliveredBaby,
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
          gender,
          breed,
          age,
          currentMilk,
          totalMilk,
          hasDeliveredBaby,
          hasKid,
          isPregnant,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  useEffect(() => {
    console.log(itemData?.hasDeliverdBaby);
    if (forEdit) {
      setGender(itemData?.gender);
      setBreed(itemData?.breed);
      setAge(itemData?.age.toString());
      setCurrentMilk(itemData?.currentCapacity.toString());
      setTotalMilk(itemData?.maximumCapacity.toString());
      setHasDeliveredBaby(itemData?.hasDeliverdBaby);
      setHasKid(itemData?.hasKid.toString());
      setIsPregnant(itemData?.isPregnant);
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
    } else if (type === 'currentMilk') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setCurrentMilk(text);
      }
    } else if (type === 'totalMilk') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setTotalMilk(text);
      }
    } else if (type === 'hasKid') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setHasKid(text);
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
            label={itemName === 'Sheep' ? 'Male' : 'Bakra'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  gender === 'Male' || gender === 'Bakra'
                    ? colors.mintGreen
                    : 'transparent',
                borderWidth: gender === 'Male' || gender === 'Bakra' ? null : 1,
              },
            ]}
            textStyle={{
              color:
                gender === 'Male' || gender === 'Bakra'
                  ? colors.white
                  : colors.black,
            }}
            onPress={() => {
              if (itemName === 'Sheep') {
                setGender('Male');
                setGenderEmpty(false);
              } else {
                setGender('Bakra');
                setGenderEmpty(false);
              }
            }}
          />
          <Button
            label={itemName === 'Sheep' ? 'Female' : 'Bakri'}
            style={[
              styles.mr20,
              {
                backgroundColor:
                  gender === 'Female' || gender === 'Bakri'
                    ? colors.mintGreen
                    : 'transparent',
                borderWidth:
                  gender === 'Female' || gender === 'Bakri' ? null : 1,
              },
            ]}
            textStyle={{
              color:
                gender === 'Female' || gender === 'Bakri'
                  ? colors.white
                  : colors.black,
            }}
            onPress={() => {
              if (itemName === 'Sheep') {
                setGender('Female');
                setGenderEmpty(false);
              } else {
                setGender('Bakri');
                setGenderEmpty(false);
              }
            }}
          />
          <Button
            label={'Kid'}
            style={{
              backgroundColor:
                gender === 'Kid' ? colors.mintGreen : 'transparent',
              borderWidth: gender === 'Kid' ? null : 1,
            }}
            textStyle={{color: gender === 'Kid' ? colors.white : colors.black}}
            onPress={() => setGender('Kid')}
          />
        </View>
        {genderEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please select gender of the ${itemName}`}
          </Text>
        )}
        <TitleInput
          title={`What's your ${itemName} Breed ? *`}
          inputPlaceholder={itemName === 'Sheep' ? 'Deccani' : 'Sirohi'}
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
        {gender === 'Female' || gender === 'Bakri' ? (
          <>
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
              title={`Total Milk Per day`}
              inputPlaceholder={'20 liter'}
              keyboardType={'numeric'}
              boxStyle={styles.mb12}
              value={totalMilk}
              type={'totalMilk'}
              setValue={handleInputChange}
            />
            <Text
              style={[
                styles.ts17,
                {color: colors.black},
                styles.fw400,
                styles.mb8,
              ]}>
              {`Has the ${itemName} delivered baby ?`}
            </Text>
            <View style={[styles.fdRow, styles.mb12]}>
              <Button
                label={'Yes'}
                style={[
                  styles.mr20,
                  {
                    backgroundColor:
                      hasDeliveredBaby === 'Yes'
                        ? colors.mintGreen
                        : 'transparent',
                    borderWidth: hasDeliveredBaby === 'Yes' ? null : 1,
                  },
                ]}
                textStyle={{
                  color:
                    hasDeliveredBaby === 'Yes' ? colors.white : colors.black,
                }}
                onPress={() => setHasDeliveredBaby('Yes')}
              />
              <Button
                label={'No'}
                style={[
                  styles.mr20,
                  {
                    backgroundColor:
                      hasDeliveredBaby === 'No'
                        ? colors.mintGreen
                        : 'transparent',
                    borderWidth: hasDeliveredBaby === 'No' ? null : 1,
                  },
                ]}
                textStyle={{
                  color:
                    hasDeliveredBaby === 'No' ? colors.white : colors.black,
                }}
                onPress={() => setHasDeliveredBaby('No')}
              />
            </View>
            <TitleInput
              title={`Is there a kid with the ${itemName} ? `}
              inputPlaceholder={'1 kid'}
              keyboardType={'numeric'}
              boxStyle={styles.mb12}
              value={hasKid}
              type={'hasKid'}
              setValue={handleInputChange}
            />
            <Text
              style={[
                styles.ts17,
                {color: colors.black},
                styles.fw400,
                styles.mb8,
              ]}>
              {`Is it Pregnant ? `}
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
                onPress={() => setIsPregnant('Yes')}
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
                onPress={() => setIsPregnant('No')}
              />
            </View>
          </>
        ) : null}

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

export default Sheep_Goat;
