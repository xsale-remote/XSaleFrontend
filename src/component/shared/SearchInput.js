import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';

const SearchInput = ({onChange, value}) => {
  return (
    <View
      style={[
        styles.fdRow,
        styles.pdh4,
        styles.pdr12,
        {
          borderRadius: 20,
          height: 45,
          width: '100%',
          backgroundColor: colors.grey700,
        },
      ]}>
      <TextInput
        onChangeText={onChange}
        placeholder="Search name"
        value={value}
        placeholderTextColor={colors.grey800}
        style={[
          styles.pdl12,
          styles.ts15,
          {
            color: colors.grey800,
            height: '100%',
            width: '90%',
            borderRadius: 20,
          },
        ]}
      />
    </View>
  );
};
export default SearchInput;
