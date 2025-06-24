import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Button,
  TitleHeader,
  TitleInput,
  DropDown,
} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const LaptopComputer = ({navigation, route}) => {
  const storageOption = ['SSD', 'HD', 'SSD/HD'];
  const {itemName, categoryName, forEdit, itemData, parentId, productType} =
    route.params;

  const [itemSelling, setItemSelling] = useState('');
  const [brand, setBrand] = useState('');
  const [ram, setRam] = useState('');
  const [storageType, setStorageType] = useState('');
  const [storage, setStorage] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [itemSellingEmpty, setItemSellingEmpty] = useState(false);
  const [brandEmpty, setBrandEmpty] = useState(false);
  const [ramEmpty, setRamEmpty] = useState(false);
  const [storageTypeEmpty, setStorageTypeEmpty] = useState(false);
  const [storageEmpty, setStorageEmpty] = useState(false);
  const [askingPriceEmpty, setAskingPriceEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setItemSelling(itemData?.type);
      setBrand(itemData?.brand);
      setRam(itemData?.ram.toString());
      setStorageType(itemData?.storageType);
      setStorage(itemData?.storage.toString());
      setAdditionalInformation(itemData?.additionalInformation);
      setAskingPrice(itemData?.askingPrice.toString());
    }
  }, []);

  const goToMedia = async () => {
    if (!brand && !ram && !storageType && !storage && !askingPrice) {
      setBrandEmpty(true);
      setRamEmpty(true);
      setStorageTypeEmpty(true);
      setStorageEmpty(true);
      setAskingPriceEmpty(true);
    }

    if (!brand) {
      setBrandEmpty(true);
    } else if (!ram) {
      setRamEmpty(true);
    } else if (!storageType) {
      setStorageTypeEmpty(true);
    } else if (!storage) {
      setStorageEmpty(true);
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
            itemSelling,
            brand,
            ram,
            storageType,
            storage,
            additionalInformation,
            askingPrice,
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
          console.log(status, 'status is not 200 while updating ', productType);
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: brand + ' ' + itemSelling + ' ' + 'available for sale',
          itemSelling,
          brand,
          ram,
          storageType,
          storage,
          additionalInformation,
          askingPrice,
        });
      }
    }
  };
  const handleInputChange = (text, type) => {
    if (type === 'brand') {
      const isAlphabets = /^[a-zA-Z\s]*$/;
      if (isAlphabets.test(text)) {
        setBrand(text);
        setBrandEmpty(false);
      }
    } else if (type === 'ram') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setRam(text);
        setRamEmpty(false);
      }
    } else if (type === 'storage') {
      const isNumbers = /^[0-9]*$/;
      if (isNumbers.test(text)) {
        setStorage(text);
        setStorageEmpty(false);
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
    if (type === 'storageType') {
      setStorageType(storageOption[index]);
      setStorageTypeEmpty(false);
    } else if (type === 'itemSelling') {
      setItemSelling(value);
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
        <DropDown
          defaultValue={forEdit ? itemData?.type : 'Please select...'}
          options={['Laptop', 'Computer']}
          title={'What are you selling*'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            itemSellingEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'itemSelling'}
        />
        {itemSellingEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select what are you selling
          </Text>
        )}

        <TitleInput
          title={'Brand Name *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={brandEmpty ? styles.mb4 : styles.mb12}
          value={brand}
          type={'brand'}
          setValue={handleInputChange}
        />
        {brandEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter brand
          </Text>
        )}
        <TitleInput
          title={'Ram *'}
          inputPlaceholder={'4 gb'}
          boxStyle={styles.mb12}
          keyboardType={'numeric'}
          value={ram}
          type={'ram'}
          setValue={handleInputChange}
        />
        {ramEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            please enter ram
          </Text>
        )}

        <DropDown
          defaultValue={forEdit ? itemData?.storageType : 'Please select...'}
          options={storageOption}
          title={'Storage type *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            storageTypeEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'storageType'}
        />
        {storageTypeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please select storage type
          </Text>
        )}
        <TitleInput
          title={'Storage *'}
          inputPlaceholder={'Enter Here'}
          boxStyle={storageEmpty ? styles.mb4 : styles.mb12}
          keyboardType={'numeric'}
          value={storage}
          type={'storage'}
          setValue={handleInputChange}
        />
        {storageEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter storage
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
          title={'Asking Price *'}
          inputPlaceholder={'Enter Here'}
          keyboardType={'numeric'}
          boxStyle={askingPriceEmpty ? styles.mb4 : styles.mb40}
          value={askingPrice}
          type={'askingPrice'}
          setValue={handleInputChange}
        />
        {askingPriceEmpty && (
          <Text style={[{color: colors.red}, styles.mb36]}>
            Please enter asking pric
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
export default LaptopComputer;
