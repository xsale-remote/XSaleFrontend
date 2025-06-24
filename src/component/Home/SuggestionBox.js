import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import images from '../../assets/images';

const SuggestionBox = ({title}) => { 
  return (
    <View
      style={[
        {
          height:  '24%',
          paddingHorizontal: 16,
          width: '100%',
          backgroundColor: colors.grey700,
          borderRadius: 6,
        },
        styles.pdt8,
        styles.mt8,
        styles.pdt8,
      ]}>
      <View
        style={[
          styles.fdRow,
          styles.mb4, 
          {justifyContent: 'space-between'},
        ]}>
        <Text
          style={[
            styles.fwBold,
            styles.mb8,
            {fontSize: 17, color: colors.blackOlive, fontFamily: 'Fira Sans'},
          ]}>
          {title}
        </Text>
        <TouchableOpacity>
          <Text
            style={[
              styles.fwBold,
              {fontFamily: 'Fira Sans', fontSize: 13, color: colors.taupeGray},
            ]}>
            View more
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View
            style={[
              {
                borderRadius: 12,
                height: 140,
                width: 140,
                shadowColor: colors.black,
                shadowOffset: {width: 4, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 10,
                backgroundColor: colors.silver,
                elevation: 5,
              },
              styles.mr16,
            ]}>
            <Image
              source={images.thing1}
              style={[styles.icon40, {height: '60%', width: '100%'}]}
            />
            <View style={[{height: '40%'}]}>
              <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
                <Text
                  style={[
                    styles.fwBold,
                    styles.ts13,
                    styles.ml8,
                    styles.mt4,
                    {color: colors.blackOlive},
                  ]}>
                  Batman Toy
                </Text>
                <Text
                  style={[
                    styles.ts18,
                    styles.fwBold,
                    styles.ml8,
                    {marginTop: 2, marginRight: 6},
                  ]}>
                  899
                </Text>
              </View>
              <Text
                style={[
                  styles.ts11,
                  styles.mt8,
                  styles.ml8,
                  {color: colors.lightPink},
                ]}>
                Ranchi , Jharkhand
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View
            style={[
              {
                borderRadius: 12,
                height: 140,
                width: 140,
                shadowColor: colors.black,
                shadowOffset: {width: 4, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 10,
                backgroundColor: colors.white,
                elevation: 5,
              },
              styles.mr16,
            ]}>
            <Image
              source={images.thing1}
              style={[styles.icon40, {height: '60%', width: '100%'}]}
            />
            <View style={[{height: '40%'}]}>
              <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
                <Text
                  style={[
                    styles.fwBold,
                    styles.ts13,
                    styles.ml8,
                    styles.mt4,
                    {color: colors.blackOlive},
                  ]}>
                  Batman Toy
                </Text>
                <Text
                  style={[
                    styles.ts18,
                    styles.fwBold,
                    styles.ml8,
                    {marginTop: 2, marginRight: 6},
                  ]}>
                  899
                </Text>
              </View>
              <Text
                style={[
                  styles.ts11,
                  styles.mt8,
                  styles.ml8,
                  {color: colors.lightPink},
                ]}>
                Ranchi , Jharkhand
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View
            style={[
              {
                borderRadius: 12,
                height: 140,
                width: 140,
                shadowColor: colors.black,
                shadowOffset: {width: 4, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 10,
                backgroundColor: colors.white,
                elevation: 5,
              },
              styles.mr16,
            ]}>
            <Image
              source={images.thing1}
              style={[styles.icon40, {height: '60%', width: '100%'}]}
            />
            <View style={[{height: '40%'}]}>
              <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
                <Text
                  style={[
                    styles.fwBold,
                    styles.ts13,
                    styles.ml8,
                    styles.mt4,
                    {color: colors.blackOlive},
                  ]}>
                  Batman Toy
                </Text>
                <Text
                  style={[
                    styles.ts18,
                    styles.fwBold,
                    styles.ml8,
                    {marginTop: 2, marginRight: 6},
                  ]}>
                  899
                </Text>
              </View>
              <Text
                style={[
                  styles.ts11,
                  styles.mt8,
                  styles.ml8,
                  {color: colors.lightPink},
                ]}>
                Ranchi , Jharkhand
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default SuggestionBox;