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
  TitleHeader,
  TitleInput,
  Button,
  DropDown,
} from '../../../component/shared';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Matrimonial = ({navigation, route}) => {
  const {categoryName, itemName, forEdit, itemData, parentId, productType} =
    route.params;

  const maritalStatusOptions = [
    'Never Married',
    'Divorced',
    'Seperated',
    'Widowed',
  ];
  const religions = [
    'Hindu',
    'Muslim',
    'Sikh',
    'Christian',
    'Jain',
    'Buddhist',
    'Parsi',
    'Other',
  ];

  const educationOptions = [
    'Illiterate',
    '5th Pass',
    '8th Pass',
    '10th Pass',
    '12th Pass',
    'Diploma',
    'Graduates',
    'Master',
  ];

  const occupations = [
    'Self Employed/Business',
    'Private Sector',
    'Goverment Job',
    'Unemployed',
    'Other',
  ];

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [motherTongue, setMotherTongue] = useState('');
  const [educationalQualification, setEducationQualification] = useState('');
  const [currentOccupation, setCurrentOccuptation] = useState('');
  const [otherInformation, setOtherInformation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [nameEmpty, setNameEmpty] = useState(false);
  const [ageEmpty, setAgeEmpty] = useState(false);
  const [heightEmpty, setHeightEmpty] = useState(false);
  const [maritalStatusEmpty, setMaritalStatusEmpty] = useState(false);
  const [religionEmpty, setReligionEmpty] = useState(false);
  const [educationalQualificationEmpty, setEducationQualificationEmpty] =
    useState(false);
  const [currentOccupationEmpty, setCurrentOccuptationEmpty] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setName(itemData?.name);
      setAge(itemData?.age.toString());
      setHeight(itemData?.height);
      setMaritalStatus(itemData?.maritalStatus);
      setReligion(itemData?.religion);
      setCaste(itemData?.caste);
      setMotherTongue(itemData?.motherTongue);
      setEducationQualification(itemData?.educationalQualification);
      setCurrentOccuptation(itemData?.currentOccupation);
      setOtherInformation(itemData?.additionalInformation);
    }
  }, []);

  const goToMedia = async () => {
    if (
      !name &&
      !age &&
      !height &&
      !maritalStatus &&
      !religion &&
      !educationalQualification &&
      !currentOccupation
    ) {
      setNameEmpty(true);
      setAgeEmpty(true);
      setHeightEmpty(true);
      setMaritalStatusEmpty(true);
      setReligionEmpty(true);
      setEducationQualificationEmpty(true);
      setCurrentOccuptationEmpty(true);
    }

    if (!name) {
      setNameEmpty(true);
    } else if (!age) {
      setAgeEmpty(true);
    } else if (!height) {
      setHeightEmpty(true);
    } else if (!maritalStatus) {
      setMaritalStatusEmpty(true);
    } else if (!religion) {
      setReligionEmpty(true);
    } else if (!educationalQualification) {
      setEducationQualificationEmpty(true);
    } else if (!currentOccupation) {
      setCurrentOccuptationEmpty(true);
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
            name,
            age,
            height,
            maritalStatus,
            religion,
            caste,
            motherTongue,
            educationalQualification,
            currentOccupation,
            additionalInformation: otherInformation,
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
          console.log(status, 'status is not 200 while updating matrimonial ');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: itemName + ' available for marriage',
          name,
          age,
          height,
          maritalStatus,
          religion,
          caste,
          motherTongue,
          educationalQualification,
          currentOccupation,
          additionalInformation: otherInformation,
        });
      }
    }
  };
  const handleInputChange = (text, type) => {
    if (type === 'name') {
      const regex = /^[a-zA-Z\s]*$/;
      if (regex.test(text)) {
        setName(text);
        setNameEmpty(false);
      }
    } else if (type === 'age') {
      const regex = /^[0-9]*$/;
      if (regex.test(text)) {
        setAge(text);
        setAgeEmpty(false);
      }
    } else if (type === 'height') {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(text)) {
        setHeight(text);
        setHeightEmpty(false);
      }
    } else if (type === 'caste') {
      const regex = /^[a-zA-Z0-9\s]*$/;
      if (regex.test(text)) {
        setCaste(text);
      }
    } else if (type === 'motherTongue') {
      const regex = /^[a-zA-Z\s]*$/;
      if (regex.test(text)) {
        setMotherTongue(text);
      }
    } else if (type === 'otherInformation') {
      setOtherInformation(text);
    }
  };
  const handleDropdown = (index, value, type) => {
    if (type === 'maritalStatus') {
      setMaritalStatus(maritalStatusOptions[index]);
      setMaritalStatusEmpty(false);
    } else if (type === 'religion') {
      setReligion(religions[index]);
      setReligionEmpty(false);
    } else if (type === 'education') {
      setEducationQualification(educationOptions[index]);
      setEducationQualificationEmpty(false);
    } else if (type === 'occupation') {
      setCurrentOccuptation(occupations[index]);
      setCurrentOccuptationEmpty(false);
    }
  };

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`${itemName ? itemName : itemData.productType} Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.pdt12]}>
        <TitleInput
          title={'Name *'}
          inputPlaceholder={'Enter here'}
          boxStyle={nameEmpty ? styles.mb4 : styles.mb12}
          value={name}
          type={'name'}
          setValue={handleInputChange}
        />
        {nameEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`name of the ${itemName} is required`}
          </Text>
        )}
        <TitleInput
          title={'Age *'}
          inputPlaceholder={'20 Year'}
          boxStyle={ageEmpty ? styles.mb4 : styles.mb12}
          keyboardType={'numeric'}
          value={age}
          type={'age'}
          setValue={handleInputChange}
        />
        {ageEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`age of the ${itemName} is required`}
          </Text>
        )}
        <TitleInput
          title={'Height *'}
          inputPlaceholder={'5.11'}
          boxStyle={heightEmpty ? styles.mb4 : styles.mb12}
          keyboardType={'numeric'}
          value={height}
          type={'height'}
          setValue={handleInputChange}
        />
        {heightEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`height of the ${itemName} is required`}
          </Text>
        )}
        <DropDown
          options={maritalStatusOptions}
          defaultValue={forEdit ? itemData.maritalStatus : 'Please Select'}
          title={'Marital Status *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            maritalStatusEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'maritalStatus'}
        />
        {maritalStatusEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`marital status required`}
          </Text>
        )}
        <DropDown
          options={religions}
          defaultValue={forEdit ? itemData.religion : 'Please Select'}
          title={'Religion *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            religionEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'religion'}
        />
        {religionEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`religion information is required`}
          </Text>
        )}
        <TitleInput
          title={'Caste (If applicable)'}
          inputPlaceholder={'Enter here'}
          boxStyle={styles.mb12}
          value={caste}
          type={'caste'}
          setValue={handleInputChange}
        />
        <TitleInput
          title={'Mother Tongue'}
          inputPlaceholder={'Enter here'}
          boxStyle={styles.mb12}
          value={motherTongue}
          type={'motherTongue'}
          setValue={handleInputChange}
        />
        <DropDown
          options={educationOptions}
          defaultValue={
            forEdit ? itemData.educationalQualification : 'Please Select'
          }
          title={'Educational Qualification *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            educationalQualificationEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'education'}
        />
        {educationalQualificationEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please select educational qualification`}
          </Text>
        )}
        <DropDown
          options={occupations}
          defaultValue={forEdit ? itemData.currentOccupation : 'Please Select'}
          title={'Current Occupation *'}
          titleStyle={[styles.ts17, styles.fw400]}
          style={[
            {borderBottomWidth: 1, borderWidth: 1, borderRadius: 10},
            currentOccupationEmpty ? styles.mb4 : styles.mb12,
          ]}
          onSelect={handleDropdown}
          type={'occupation'}
        />
        {currentOccupationEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            {`Please select current occupation`}
          </Text>
        )}
        <TitleInput
          title={'Give Other Information'}
          inputPlaceholder={'Enter here'}
          boxStyle={styles.mb36}
          multiline={true}
          value={otherInformation}
          type={'otherInformation'}
          setValue={handleInputChange}
        />
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

export default Matrimonial;
