import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../../../assets/styles';
import colors from '../../../assets/colors';
import images from '../../../assets/images';
import {TitleHeader, Button} from '../../../component/shared';
import { logEvent } from '../../../utils/analytics';

const Selection = ({navigation, route}) => {
  const [selected, setSelected] = useState('');
  return (
    <SafeAreaView style={[styles.pdh16]}>
      <TitleHeader
        title={`Add New Listing`}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <ScrollView showsVerticalScrollIndicator={false} style={[styles.pdt12]}>
        <Text style={[styles.h3, {color: colors.black}, styles.mb12]}>Job</Text>
        <Text style={[styles.h5, {color: colors.black}, styles.mb16]}>
          Select only one
        </Text>
        <Button
          label={'I am looking for a job'}
          onPress={() => {
            setSelected('I am looking for a job');
            logEvent('category_form_opened', { category: 'Jobs', job_type: 'looking_for_job' });
            navigation.navigate('SubCategory', {
              title: 'Jobs',
              jobStatus: 'I am looking for a job',
            });
          }}
          style={[styles.mb28]}
        />
        <Button
          label={'I am hiring'}
          onPress={() => {
            setSelected('I am hiring');
            logEvent('category_form_opened', { category: 'Jobs', job_type: 'hiring' });
            navigation.navigate('SubCategory', {
              title: 'Jobs',
              jobStatus: 'I am hiring',
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Selection;
