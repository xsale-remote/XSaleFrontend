import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Pressable,
  Modal,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Share,
  Linking,
} from 'react-native';
import {BottomNavigation} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import images from '../../assets/images';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Button} from '../../component/shared';
import {getUserInfo} from '../../utils/function';
import {deleteApi, post} from '../../utils/requestBuilder';
import {CommonActions} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

const LogoutModal = ({visible, onConfirm, onCancel}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={[
          styles.pdh16,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        ]}>
        <View
          style={[
            {
              backgroundColor: colors.white,
              borderRadius: 10,
              alignItems: 'center',
              elevation: 5,
            },
            styles.p20,
          ]}>
          <Text style={[styles.h1, styles.mb12, {textAlign: 'center'}]}>
            Logout
          </Text>
          <Text
            style={[
              styles.ts18,
              styles.mb20,
              {
                textAlign: 'center',
                color : colors.black
              },
            ]}>
            Are you sure you want to log out?
          </Text>
          <View
            style={[
              styles.fdRow,
              {
                justifyContent: 'space-around',
                width: '100%',
                marginTop: 10,
              },
            ]}>
            <Button
              label={'Yes'}
              onPress={onConfirm}
              style={[
                {width: '45%', backgroundColor: 'transparent', borderWidth: 1},
              ]}
              textStyle={{color: colors.black}}
            />
            <Button
              label={'No'}
              onPress={onCancel}
              style={[{width: '45%', backgroundColor: colors.mintGreen}]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DeleteModal = ({visible, onConfirm, onCancel, isLoading}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={[
          styles.pdh16,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        ]}>
        <View
          style={[
            styles.p20,
            {
              backgroundColor: colors.white,
              borderRadius: 10,
              alignItems: 'center',
              elevation: 5,
              borderWidth: 1,
            },
          ]}>
          <Text style={[styles.h1, styles.mb12, {textAlign: 'center'}]}>
            Delete Account
          </Text>
          <Text
            style={[
              styles.ts18,
              styles.mb20,
              {
                textAlign: 'center',
                color : colors.black
              },
            ]}>
            Permanently delete your account & all data associated with it. ?
          </Text>
          {!isLoading ? (
            <View
              style={[
                styles.fdRow,
                {
                  justifyContent: 'space-around',
                  width: '100%',
                  marginTop: 10,
                },
              ]}>
              <Button
                label={'Yes'}
                onPress={onConfirm}
                style={[
                  {
                    width: '45%',
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                  },
                ]}
                textStyle={{color: colors.black}}
              />
              <Button
                label={'No'}
                onPress={onCancel}
                style={[{width: '45%', backgroundColor: colors.mintGreen}]}
              />
            </View>
          ) : (
            <ActivityIndicator size={'small'} color={colors.grey800} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const InputModal = ({
  visible,
  onConfirm,
  onCancel,
  value,
  setValue,
  isLoading,
  isEmpty,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={[
          styles.pdh16,
          {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
          },
        ]}>
        <View
          style={[
            styles.p20,
            {
              backgroundColor: colors.white,
              borderRadius: 10,
              alignItems: 'center',
              elevation: 5,
              borderWidth: 1,
            },
          ]}>
          <Text style={[styles.h1, styles.mb12, {textAlign: 'center'}]}>
            Send Suggestion
          </Text>
          <TextInput
            placeholder="Enter Suggestion here"
            placeholderTextColor={colors.grey500}
            style={[
              {
                borderWidth: 0.5,
                width: '100%',
                borderRadius: 5,
                textAlignVertical: 'top',
                color : colors.grey500
              },
              styles.ts16,
              styles.mb16,
              styles.pdh8,
            ]}
            multiline
            numberOfLines={5}
            value={value}
            onChangeText={setValue}
          />
          {isEmpty && (
            <Text style={[{color: colors.red}, styles.mb12]}>
              Please enter some suggestion
            </Text>
          )}
          <View
            style={[
              styles.fdRow,
              {
                justifyContent: 'space-around',
                width: '100%',
                marginTop: 10,
              },
            ]}>
            <Button
              label={'Cancel'}
              onPress={onCancel}
              style={[
                {width: '45%', backgroundColor: 'transparent', borderWidth: 1},
              ]}
              textStyle={{color: colors.black}}
            />
            <Button
              label={'Submit'}
              onPress={onConfirm}
              style={[{width: '45%', backgroundColor: colors.mintGreen}]}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Profile = ({navigation}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [userData, setUserData] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [suggesstionModal, setSuggesstionModal] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [userId, setUserId] = useState('');
  const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);
  const [suggestionEmpty, setSuggestionEmpty] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    getUserData();
    const timer = setTimeout(() => {
      setIsRendered(true);
      return () => clearTimeout(timer);
    }, 10);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    try {
      const userInfo = await getUserInfo();
      if (!userInfo) {
        setIsLoggedIn(false);
      } else {
        const {userName, phoneNumber, _id, profilePicture} = userInfo.user;
        setProfilePicture(profilePicture);
        setIsLoggedIn(true);
        setUserName(userName);
        setMobileNumber(phoneNumber);
        setUserData(userInfo);
        setUserId(_id);
      }
    } catch (error) {
      console.log(`error while fetching user info ${error}`);
    }
  };

  const sendSuggestion = async () => {
    if (suggestion.length === 0) {
      setSuggestionEmpty(true);
    } else {
      setSuggestionEmpty(false);
      try {
        setSuggestionSubmitting(true);
        const url = `api/v1/user/suggestion`;
        const body = {
          user: userId,
          suggestion,
        };
        const {response, status} = await post(url, body);
        if (status === 200) {
          setSuggestion('');
          setSuggestionSubmitting(false);
          setSuggesstionModal(false);
          ToastAndroid.showWithGravityAndOffset(
            'Thank you for your suggestion! We appreciate your feedback.',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      } catch (error) {
        console.log(`error while sending suggestion ${error}`);
        setSuggestionSubmitting(false);
        setSuggesstionModal(false);
      }
    }
  };
  const logoutUser = async () => {
    try {
      await EncryptedStorage.removeItem('userData');
      setShowLogoutModal(false);
      // navigation.replace('MobileNumber');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MobileNumber'}],
        }),
      );
    } catch (error) {
      console.log(`Error while deleting user data: ${error}`);
    }
  };

  const deleteUser = async () => {
    setDeletingUser(true);
    try {
      const url = `api/v1/user/delete-user`;
      const {response, status} = await deleteApi(url);
      if (status === 200) {
        ToastAndroid.showWithGravityAndOffset(
          'Successfully deleted the user',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
      await EncryptedStorage.removeItem('userData');
      setShowDeleteModal(false);
      navigation.replace('Home');
    } catch (error) {
      console.log(`error while deleting the user ${error}`);
    }
    setDeletingUser(false);
  };

  const firstHeader = [
    {
      id: 1,
      icon: icons.logout,
      title: 'Logout',
      onPress: () => {
        setShowLogoutModal(true);
      },
    },
    {
      id: 2,
      icon: icons.delete,
      title: 'Delete Account',
      onPress: () => {
        setShowDeleteModal(true);
      },
    },
    {
      id: 3,
      icon: icons.suggestion,
      title: 'Send us Suggestion',
      onPress: () => {
        setSuggesstionModal(true);
      },
    },
  ];

  const shareContent = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out this amazing app! Download it here: https://play.google.com/store/apps/details?id=com.Xsale\n\nIt’s really easy to use for buying, selling, and renting items.',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const rateUs = () => {
    const storeUrl = 'https://play.google.com/store/apps/details?id=com.Xsale';
    Linking.openURL(storeUrl).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  const secondHeader = [
    {
      id: 1,
      icon: icons.privacy,
      title: 'Privacy Policies',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: 3,
      icon: icons.invite_friend,
      title: 'Invite Friends',
      onPress: shareContent,
    },
    {id: 4, icon: icons.rate_us, title: 'Rate Us', onPress: rateUs},
  ];

  const OptionHeader = ({label}) => {
    return (
      <View
        style={[
          {
            height: '7%',
            justifyContent: 'center',
            backgroundColor: colors.pink100,
            width: '100%',
          },
        ]}>
        <Text
          style={[
            styles.ts18,
            styles.ml16,
            styles.ts18,
            {color: colors.black},
          ]}>
          {label}
        </Text>
      </View>
    );
  };

  const Option = ({icon, title, id, onPress}) => {
    return (
      <Pressable
        style={[styles.pdh16, {width: '100%', height: 45}]}
        onPress={onPress}>
        <View style={[styles.fdRow, styles.mt8]}>
          <Image
            source={icon}
            style={[styles.mr12, styles.mt4, styles.icon20]}
          />
          <Text style={[styles.ts18, {color: colors.black}]}>{title}</Text>
        </View>
        {id === 3 ? null : (
          <View style={[styles.mt12, {borderBottomWidth: 0.5}]}></View>
        )}
      </Pressable>
    );
  };

  if (!isRendered) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.pdh16, styles.pdv12, {height: '100%'}]}>
      <View style={[styles.mt4, styles.fdRow, {height: 'auto', width: '100%'}]}>
        <Image
          source={profilePicture ? {uri: profilePicture} : icons.avatar}
          style={[
            {borderRadius: 50, height: 68, width: 68, resizeMode: 'cover'},
          ]}
        />
        <View
          style={[
            styles.fdRow,
            styles.pdh16,
            styles.pdr8,
            {justifyContent: 'space-between', width: '80%'},
          ]}>
          <View>
            <Text style={[styles.h1, {color: colors.lightOrange}]}>
              {isLoggedIn && userName ? userName : 'Guest'}
            </Text>
            <Text style={[styles.h3, styles.mt4, {color: colors.black}]}>
              {isLoggedIn && mobileNumber ? (
                mobileNumber
              ) : (
                <Text
                  style={[{color: colors.mintGreen}]}
                  onPress={() => navigation.replace('MobileNumber')}>
                  Login
                </Text>
              )}
            </Text>
          </View>
          {isLoggedIn && (
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('ChangeInfo')}>
              <Image
                source={icons.arrow_back}
                style={[
                  styles.icon44,
                  styles.mt12,
                  {transform: [{rotate: '180deg'}]},
                ]}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={logoutUser}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={deleteUser}
          isLoading={deletingUser}
        />
      )}
      {suggesstionModal && (
        <InputModal
          onCancel={() => setSuggesstionModal(false)}
          onConfirm={sendSuggestion}
          value={suggestion}
          setValue={text => {
            setSuggestion(text);
          }}
          isLoading={suggestionSubmitting}
          isEmpty={suggestionEmpty}
        />
      )}
      <View style={[styles.mt20, {height: '80%'}]}>
        {userData && <OptionHeader label={'Setting'} />}
        <View>
          {userData &&
            firstHeader.map((item, index) => {
              return (
                <Option
                  icon={item.icon}
                  title={item.title}
                  key={item.id}
                  onPress={item.onPress}
                />
              );
            })}
        </View>
        <OptionHeader label={'Support'} />
        <View>
          {secondHeader.map((item, index) => {
            return (
              <Option
                icon={item.icon}
                title={item.title}
                key={item.id}
                id={item.id}
                onPress={item.onPress}
              />
            );
          })}
        </View>
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default Profile;
