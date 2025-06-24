import {View, Text, TextInput} from 'react-native';
import React from 'react';
import colors from '../../assets/colors';
import styles from '../../assets/styles';

const TitleInput = ({
  title,
  inputPlaceholder,
  secureTextEntry,
  titleStyle,
  keyboardType,
  inputStyle,
  rightIcon,
  boxStyle,
  value,
  setValue,
  maxLength,
  multiline,
  numberOfLines,
  type,
}) => {
  const handleTextChange = text => {
    if (setValue) {
      if (type) {
        setValue(text, type);
      } else {
        setValue(text);
      }
    }
  };
  return (
    <View style={boxStyle}>
      <Text
        style={[
          styles.ts17,
          {color: colors.black},
          styles.fw400,
          styles.mb8,
          titleStyle,
        ]}>
        {title}
      </Text>
      <TextInput
        secureTextEntry={secureTextEntry ? secureTextEntry : null}
        maxLength={maxLength ? maxLength : null}
        keyboardType={keyboardType}
        value={value}
        onChangeText={handleTextChange}
        placeholder={inputPlaceholder}
        placeholderTextColor={colors.grey800}
        style={[
          styles.fwBold,
          styles.pdh12,
          {
            height: multiline ? 80 : 40,
            fontSize: 15,
            borderWidth: 0.5,
            borderRadius: 12,
            textAlignVertical: multiline ? 'top' : 'center',
            color: colors.black,
          },
          inputStyle,
        ]}
        multiline={multiline}
        numberOfLines={4}
      />
    </View>
  );
};

export default TitleInput;
