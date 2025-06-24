import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TitleHeader, TitleInput, Button} from '../../../component/shared';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import {put} from '../../../utils/requestBuilder';

const Job = ({navigation, route}) => {
  const {
    itemName,
    categoryName,
    jobStatus,
    forEdit,
    itemData,
    parentId,
    productType,
  } = route.params;
  const [jobLocation, setJobLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [jobLocationEmpty, setJobLocationEmpty] = useState(false);
  const [salaryRangeEmpty, setSalaryRangeEmpty] = useState(false);
  const [jobDescriptionEmpty, setJobDescriptionEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (forEdit) {
      setJobLocation(itemData?.jobLocation);
      setSalaryRange(itemData?.salaryRange.toString());
      setJobDescription(itemData?.jobDescription);
    }
  }, []);

  const handleInputChange = (text, type) => {
    if (type === 'jobLocation') {
      setJobLocation(text);
      setJobLocationEmpty(false);
    } else if (type === 'salaryRange') {
      const numericText = text.replace(/[^0-9]/g, '');
      setSalaryRange(numericText);
      setSalaryRangeEmpty(false);
    } else if (type === 'jobDescription') {
      setJobDescription(text);
      setJobDescriptionEmpty(false);
    }
  };

  const goToMedia = async () => {
    if (!jobLocation && !salaryRange && !jobDescription) {
      setJobDescriptionEmpty(true);
      setSalaryRangeEmpty(true);
      setJobDescriptionEmpty(true);
    }

    if (!jobLocation) {
      setJobLocationEmpty(true);
    } else if (!salaryRange) {
      setSalaryRangeEmpty(true);
    } else if (!jobDescription) {
      setJobDescriptionEmpty(true);
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
            jobLocation,
            jobDescription,
            salaryRange,
          },
        };
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          console.log(response, status, 'response while updating fashion ad');
          ToastAndroid.showWithGravityAndOffset(
            'Ad updated successfully',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          navigation.pop();
        } else {
          console.log(status, 'status is not 200 while updating job');
        }
        setIsLoading(false);
      } else {
        navigation.navigate('Media', {
          categoryName,
          itemName,
          displayName: jobStatus + ' ' + itemName,
          jobStatus,
          jobLocation,
          salaryRange,
          jobDescription,
        });
      }
    }
  };

  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`Jobs Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.pdt12]}>
        <TitleInput
          title={'Job Location *'}
          inputPlaceholder={'Enter here'}
          boxStyle={jobLocationEmpty ? styles.mb4 : styles.mb12}
          value={jobLocation}
          type={'jobLocation'}
          setValue={handleInputChange}
        />
        {jobLocationEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Please enter the job location
          </Text>
        )}
        <TitleInput
          title={'Salary Range *(Per month)'}
          inputPlaceholder={'8000'}
          boxStyle={salaryRangeEmpty ? styles.mb4 : styles.mb12}
          keyboardType={'numeric'}
          value={salaryRange}
          type={'salaryRange'}
          setValue={handleInputChange}
        />
        {salaryRangeEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Enter salary range
          </Text>
        )}
        <TitleInput
          title={'Job Description *'}
          inputPlaceholder={'Describe information here'}
          boxStyle={jobDescriptionEmpty ? styles.mb4 : styles.mb36}
          multiline={true}
          value={jobDescription}
          type={'jobDescription'}
          setValue={handleInputChange}
        />
        {jobDescriptionEmpty && (
          <Text style={[{color: colors.red}, styles.mb12]}>
            Job description is required
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

export default Job;
