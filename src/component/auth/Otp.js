import React, {PureComponent} from 'react';
import {View, TextInput, StyleSheet, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../assets/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    height: 49,
    width: 55,
    margin: 4,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    borderBottomWidth: 2,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 222, 1)',
    borderRadius: 8,
  },
});

export default class OTPTextView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: 0,
      otpText: [],
    };
    this.inputs = [];
  }

  componentDidMount() {
    const {defaultValue, cellTextLength} = this.props;
    this.otpText = defaultValue.match(
      new RegExp('.{1,' + cellTextLength + '}', 'g'),
    );
  }

  onTextChange = (text, i) => {
    const {cellTextLength, inputCount, handleTextChange} = this.props;
    this.setState(
      prevState => {
        let {otpText} = prevState;
        otpText[i] = text;
        return {
          otpText,
        };
      },
      () => {
        handleTextChange(this.state.otpText.join(''));
        if (text.length === cellTextLength && i !== inputCount - 1) {
          this.inputs[i + 1].focus();
        }
      },
    );
  };

  onInputFocus = i => {
    this.setState({focusedInput: i});
  };

  onKeyPress = (e, i) => {
    const {otpText = []} = this.state;
    //console.log(e.nativeEvent, i);
    if (e.nativeEvent.key === 'Backspace' && i !== 0) {
      this.inputs[i - 1].focus();
      // console.log(i);
    }
  };

  render() {
    const {
      inputCount,
      offTintColor,
      tintColor,
      defaultValue,
      cellTextLength,
      containerStyle,
      textInputStyle,
      keyboardType,
      onSubmitEditing,
      ...textInputProps
    } = this.props;

    const TextInputs = [];
    const {focusedInput} = this.state;
    for (let i = 0; i < inputCount; i += 1) {
      let defaultChars = [];
      if (defaultValue) {
        defaultChars = defaultValue.match(
          new RegExp('.{1,' + cellTextLength + '}', 'g'),
        );
      }
      const inputStyle = [
        styles.textInput,
        textInputStyle,
        {borderColor: offTintColor},
      ];
      if (this.state.focusedInput === i) {
        inputStyle.push({borderColor: tintColor});
      }

      TextInputs.push(
        <TextInput
          ref={e => {
            this.inputs[i] = e;
          }}
          contextMenuHidden={true}
          key={i}
          //placeholder="✱"
          autoFocus={i === 0}
          defaultValue={defaultValue ? defaultChars[i] : ''}
          style={[
            inputStyle,
            {
              borderBottomColor:
                focusedInput === i ? colors.primary : colors.grey400,
            },
          ]}
          maxLength={this.props.cellTextLength}
          onFocus={() => this.onInputFocus(i)}
          onChangeText={text =>
            this.onTextChange(text.replace(/[^0-9]/g, '').trim(), i)
          }
          multiline={false}
          onKeyPress={e => this.onKeyPress(e, i)}
          keyboardType={keyboardType}
          {...textInputProps}
          onSubmitEditing={onSubmitEditing}
        />,
      );
    }
    return <View style={[styles.container, containerStyle]}>{TextInputs}</View>;
  }
}

OTPTextView.propTypes = {
  defaultValue: PropTypes.string,
  inputCount: PropTypes.number,
  containerStyle: PropTypes.object,
  textInputStyle: PropTypes.object,
  cellTextLength: PropTypes.number,
  tintColor: PropTypes.string,
  offTintColor: PropTypes.string,
  handleTextChange: PropTypes.func,
  inputType: PropTypes.string,
  keyboardType: PropTypes.string,
};

OTPTextView.defaultProps = {
  defaultValue: '',
  inputCount: 4,
  keyboardType: 'number-pad',
  tintColor: colors.primary,
  offTintColor: colors.grey,
  cellTextLength: 1,
  containerStyle: {},
  textInputStyle: {},
  handleTextChange: () => {},
};
