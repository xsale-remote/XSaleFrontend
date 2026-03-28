import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Home from '../screens/home/Home';
import { Chats } from '../screens/chats';
import { MyAds } from '../screens/myAds';
import { Profile } from '../screens/profile';

import colors from '../assets/colors';
import icons from '../assets/icons';
import styles from '../assets/styles';
import { getUserInfo } from '../utils/function';
import { logEvent } from '../utils/analytics';

const Tab = createBottomTabNavigator();

const PostAdPlaceholder = () => null;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const handlePostAd = async () => {
    const user = await getUserInfo();
    logEvent('post_ad_tapped', { is_logged_in: user ? 'true' : 'false' });
    if (user) {
      navigation.navigate('AddNewListing');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View
      style={[
        styles.fdRow,
        styles.pdh4,
        {
          backgroundColor: colors.white,
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: colors.grey100,
          elevation: 12,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        },
      ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenter = route.name === 'PostAd';

        const onPress = () => {
          if (isCenter) {
            handlePostAd();
            return;
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.85}
              style={[
                styles.pdb4,
                { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
              ]}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: colors.mintGreen,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -20,
                  elevation: 8,
                }}>
                <Image
                  source={icons.plus_white}
                  style={styles.icon24}
                  tintColor={colors.white}
                />
              </View>
              <Text style={[styles.ts10, styles.fw700, { color: colors.seaGreen }]}>
                Post Ad
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={[
              styles.pdt8,
              styles.pdb4,
              { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
            ]}>
            <View
              style={{
                width: 36,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                backgroundColor: isFocused ? colors.cyanCider : 'transparent',
              }}>
              <Image
                source={options.tabBarIcon}
                style={[
                  styles.icon24,
                  { tintColor: isFocused ? colors.mintGreen : colors.grey800 },
                ]}
              />
            </View>
            <Text
              style={[
                styles.ts10,
                isFocused ? styles.fw700 : styles.fw400,
                { color: isFocused ? colors.mintGreen : colors.grey800 },
              ]}>
              {options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: 'Home', tabBarIcon: icons.home }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{ title: 'Chats', tabBarIcon: icons.chats }}
      />
      <Tab.Screen
        name="PostAd"
        component={PostAdPlaceholder}
        options={{ title: 'Post Ad', tabBarIcon: icons.plus_white }}
      />
      <Tab.Screen
        name="MyAds"
        component={MyAds}
        options={{ title: 'My Ads', tabBarIcon: icons.ads }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Profile', tabBarIcon: icons.person }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
