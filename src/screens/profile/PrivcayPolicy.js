import {View, Text, SafeAreaView, ScrollView, useColorScheme} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const PrivacyPolicy = ({navigation}) => {
  const colorTheme = useColorScheme(); 
  console.log(colorTheme , "this isthem")
  return (
    <SafeAreaView style={[styles.pdh16, {flex: 1}]}>
      <TitleHeader
        title="Privacy Policy"
        onBackPress={() => navigation.pop()}
      />
      <View
        style={{
          width: '200%',
          alignSelf: 'center',
          borderBottomWidth: 1,
          opacity: 0.2,
        }}
      />
      <ScrollView
        style={[styles.mt8, styles.mb12, {flex: 1}]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.h4, {color: colors.black}]}>
          Privacy Statement{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          We care about your privacy and are committed to protecting your
          personal data. This privacy statement will inform you how we handle
          your personal data, your privacy rights, and how the law protects you.
          Please read this privacy statement carefully before using our
          Services.{'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>Contents{'\n'}</Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          1. Who Are We?{'\n'}
          2. What Data Do We Collect About You?{'\n'}
          3. How Will We Inform You About Changes in Our Privacy Statement?
          {'\n'}
          4. Communication{'\n'}
          5. Who Do We Share Your Data With?{'\n'}
          6. Where Do We Store Your Data and For How Long?{'\n'}
          7. Your Rights – Data Deletion Requests{'\n'}
          8. Technical and Organizational Measures and Processing Security
          {'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          1. Who Are We?{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          XSale is a service offered by Sky Technologies Pvt Ltd, a company
          incorporated and registered in India. As the data controller, Sky
          Technologies Pvt Ltd is responsible for managing and safeguarding the
          personal data collected through the XSale platform.
          {'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          2. What Data Do We Collect About You?{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          2.1.1 Data Provided Through Direct Interaction{'\n\n'}
          Registration and Other Account Information{'\n\n'}
          When you register to use our Services, we may collect the following
          information about you: {'\n'}
          We only ask for your mobile number so that you can register, and other
          users can contact you when you post ads or are looking to buy items.
          Depending on your choices, you may also provide your name, mobile
          number, and current location.{'\n\n'}
          2.1.2 Data We Collect Automatically When You Use Our Services{'\n\n'}
          Depending on your device permissions, we may collect and process
          information about your actual location. This data allows you to see
          items posted by users near you and helps you post items within your
          location. If you allow access to your location data later, you can go
          to the app settings and disable the permissions related to location
          sharing.{'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          3. How Will We Inform You About Changes in Our Privacy Statement?
          {'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          We may amend and update this privacy statement from time to time. We
          will notify you of material changes by placing a prominent notice
          within our Services or by sending you a message or email. If you do
          not agree with the way we are processing your personal data, you may
          close your account at any time.{'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          4. Communication{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          We will communicate with you by email, SMS, or in-app notifications in
          connection with our Services/Platform to confirm your registration,
          inform you about your ad listing status, and other transactional
          messages. As these are imperative for our Services, you may not be
          able to opt-out.{'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          5. Who Do We Share Your Data With?{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          We may share your personal data with corporate affiliates, third-party
          service providers, and advertising and analytics providers. We ensure
          that our partners respect the security of your data and treat it in
          accordance with the law. For details, please refer to our{' '}
          <Text style={{color: colors.primary}}>
            Policy for Cookies and similar Technologies
          </Text>
          .{'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          6. Where Do We Store Your Data and For How Long?{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          Your data will be stored and processed on secure servers. We will
          retain your personal data for as long as necessary to fulfill the
          purposes we collected it for, including for legal, accounting, or
          reporting requirements.{'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          7. Your Rights – Data Deletion Requests{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          To exercise your privacy rights and choices, you can use the Data
          Deletion Requests feature under Account &gt; Settings &gt; “Deactivate
          account and delete my data”. However, there may be situations where we
          cannot grant your request due to legal obligations.
          {'\n\n'}
        </Text>

        <Text style={[styles.h4, {color: colors.black}]}>
          8. Technical and Organizational Measures and Processing Security{'\n'}
        </Text>
        <Text style={[styles.ts14, {color : colorTheme === "dark" ? colors.grey500 : null} ]}>
          We store your information on secure servers and implement technical
          and organizational measures to protect your personal data. While we
          take necessary precautions, please note that data transfer over the
          Internet is never completely secure.{'\n\n'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
