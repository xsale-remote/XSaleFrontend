// import React, {useEffect, useState} from 'react';
// import {Text, View} from 'react-native';
// import ModalDropdown from 'react-native-modal-dropdown';
// import colors from '../../assets/colors';
// import icons from '../../assets/icons';
// import styles from '../../assets/styles';
// import IconButton from './IconButton';

// const maxHeight = 100;

// const DropDown = props => {
//   const [isFocused, setFocuse] = useState(false);
//   const [dropDownRef, setDropDownRef] = useState();
//   const [height, setHeight] = useState(maxHeight);
//   const [isDisabled, setIsDisabled] = useState(props.disabled);
//   const [defaultValue, setDefaultValue] = useState(props.selected);

//   const {
//     error,
//     options,
//     onSelect,
//     border,
//     style,
//     dropdownStyle,
//     disabled,
//     showSearch,
//     defaultIndex,
//     title,
//     titleStyle,
//     type, // Added type prop
//   } = props;

//   useEffect(() => {
//     calculateHeight();
//   }, []);

//   let borderStyle;
//   if (border) {
//     borderStyle = {
//       borderWidth: 2,
//       borderRadius: 2,
//       backgroundColor: colors.white,
//       borderColor: isFocused ? colors.primary : colors.grey200,
//     };
//   } else {
//     borderStyle = {
//       borderBottomColor: isFocused ? colors.primary : colors.grey200,
//       borderBottomWidth: 2,
//       backgroundColor: colors.white,
//     };
//   }

//   const calculateHeight = () => {
//     const maxLines = maxHeight / 25;
//     const numberOfLines =
//       options?.length < maxLines ? options?.length : maxLines;
//     setHeight(numberOfLines * 40);
//     if (options.length === 0) {
//       setDefaultValue('No Data available');
//       setIsDisabled(true);
//     }
//   };

//   const handleSelect = (index, value) => {
//     if (type) {
//       onSelect(index, value, type);
//     } else {
//       onSelect(index, value);
//     }
//   };

//   return (
//     <>
//       {title && (
//         <Text
//           style={[
//             styles.ts20,
//             {color: colors.black},
//             styles.fwBold,
//             styles.mb8,
//             titleStyle,
//           ]}>
//           {title}
//         </Text>
//       )}
//       <View
//         style={[
//           styles.fdRow,
//           styles.pdh8,
//           {
//             height: 48,
//             alignItems: 'center',
//             marginBottom: error !== '' ? 0 : 16,
//             ...borderStyle,
//             backgroundColor: 'transparent',
//           },
//           style,
//         ]}>
//         <ModalDropdown
//           ref={ref => setDropDownRef(ref)}
//           disabled={isDisabled}
//           defaultValue={defaultIndex}
//           options={options}
//           onSelect={handleSelect}
//           showSearch={showSearch}
//           onDropdownWillShow={() => setFocuse(true)}
//           onDropdownWillHide={() => setFocuse(false)}
//           style={{flex: 1}}
//           textStyle={[styles.ts14]}
//           saveScrollPosition={false}
//           dropdownStyle={{
//             width: 250,
//             height: options?.length === 0 ? 50 : height,
//           }}
//           dropdownTextStyle={[
//             styles.fw700,
//             styles.ts16,
//             styles.pdh16,
//             {color: colors.black},
//           ]}
//           animated={true}
//           defaultIndex={defaultIndex >= 0 ? defaultIndex : 0} // Ensure defaultIndex is valid
//         />
//         {!disabled && (
//           <IconButton
//             onPress={() => dropDownRef.show()}
//             icon={icons.dropDownArrow}
//             iconStyle={[styles.icon16]}
//           />
//         )}
//       </View>
//     </>
//   );
// };

// export default DropDown;

import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import styles from '../../assets/styles';
import IconButton from './IconButton';

const maxHeight = 100;

const DropDown = props => {
  const [isFocused, setFocuse] = useState(false);
  const [dropDownRef, setDropDownRef] = useState();
  const [height, setHeight] = useState(maxHeight);
  const [isDisabled, setIsDisabled] = useState(props.disabled);
  const [defaultValue, setDefaultValue] = useState(props.defaultValue);

  const {
    error,
    options,
    onSelect,
    border,
    style,
    dropdownStyle,
    disabled,
    showSearch,
    defaultIndex,
    title,
    titleStyle,
    type, // Added type prop
  } = props;

  useEffect(() => {
    calculateHeight();
  }, [options]);

  // useEffect(() => {
  //   setDefaultValue(props.selected);
  // }, [props.selected]);

  let borderStyle;
  if (border) {
    borderStyle = {
      borderWidth: 2,
      borderRadius: 2,
      backgroundColor: colors.white,
      borderColor: isFocused ? colors.primary : colors.grey200,
    };
  } else {
    borderStyle = {
      borderBottomColor: isFocused ? colors.primary : colors.grey500,
      borderBottomWidth: 2,
      backgroundColor: colors.white,
    };
  }

  const calculateHeight = () => {
    const maxLines = maxHeight / 25;
    const numberOfLines =
      options?.length < maxLines ? options?.length : maxLines;
    setHeight(numberOfLines * 40);
    if (options.length === 0) {
      setDefaultValue('No Data available');
      setIsDisabled(true);
    }
  };

  const handleSelect = (index, value) => {
    if (type) {
      onSelect(index, value, type);
    } else {
      onSelect(index, value);
    }
    setDefaultValue(value); // Update default value on selection
  };

  return (
    <>
      {title && (
        <Text
          style={[
            styles.ts20,
            {color: colors.black},
            styles.fwBold,
            styles.mb8,
            titleStyle,
          ]}>
          {title}
        </Text>
      )}
      <View
        style={[
          styles.fdRow,
          styles.pdh8,
          {
            height: 48,
            alignItems: 'center',
            marginBottom: error !== '' ? 0 : 16,
            ...borderStyle,
            backgroundColor: 'transparent',
          },
          style,
        ]}>
        <ModalDropdown
          ref={ref => setDropDownRef(ref)}
          disabled={isDisabled}
          defaultValue={defaultValue}
          options={options}
          onSelect={handleSelect}
          showSearch={showSearch}
          onDropdownWillShow={() => setFocuse(true)}
          onDropdownWillHide={() => setFocuse(false)}
          style={{flex: 1}}
          textStyle={[styles.ts14, {color : colors.black}]}
          saveScrollPosition={false}
          dropdownStyle={{
            width: 250,
            height: options?.length === 0 ? 50 : height,
          }}
          dropdownTextStyle={[
            styles.fw700,
            styles.ts16,
            styles.pdh16,
            {color: colors.black},
          ]}
          animated={true}
          defaultIndex={defaultIndex >= 0 ? defaultIndex : 0} // Ensure defaultIndex is valid
        />
        {!disabled && (
          <IconButton
            onPress={() => dropDownRef.show()}
            icon={icons.dropDownArrow}
            iconStyle={[styles.icon16]}
          />
        )}
      </View>
    </>
  );
};

export default DropDown;
