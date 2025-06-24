import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../assets/colors';
import styles from '../../../assets/styles';
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import {put} from '../../../utils/requestBuilder';

const OtherAnimals = ({navigation, route}) => {
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [nameEmpty, setNameEmpty] = useState(false);
  const [ageEmpty, setAgeEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    setName(itemData?.name);
    setAge(itemData?.age.toString());
    setAdditionalInformation(itemData?.additionalInformation);
    setAskingPrice(itemData?.askingPrice.toString());
  }, []);

  const goToMedia = async () => {
    if (!name && !age && !askingPrice) {
      setNameEmpty(true);
      setAgeEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!name) {
      setNameEmpty(true);
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
            name,
            age,
            additionalInformation,
            askingPrice,
            displayName: `${name} available for sale`,
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
          displayName: name + ' available for sale',
          name,
          age,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };

  const handleInputChange = (text, type) => {
    if (type === 'name') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setName(text);
        setNameEmpty(false);
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
      <View style={[styles.pdt12, {height: 'auto'}]}>
        <TitleInput
          title={`Name of the Animal *`}
          inputPlaceholder={'Enter here'}
          boxStyle={nameEmpty ? styles.mb4 : styles.mb12}
          value={name}
          type={'name'}
          setValue={handleInputChange}
        />
        {nameEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please enter the name of the animal`}
          </Text>
        )}
        <TitleInput
          title={`Age * (In months)`}
          inputPlaceholder={'5 months'}
          boxStyle={ageEmpty ? styles.mb4 : styles.mb12}
          value={age}
          type={'age'}
          setValue={handleInputChange}
        />
        {ageEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`please enter the age of the donkey`}
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
      </View>
    </SafeAreaView>
  );
};

export default OtherAnimals;
