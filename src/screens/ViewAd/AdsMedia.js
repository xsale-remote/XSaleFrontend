import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Video from 'react-native-video';
import {TitleHeader} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const {height, width} = Dimensions.get('window');

const AdsMedia = ({navigation, route}) => {
  const {mediaUriArray} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const handleScroll = e => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  const renderItem = ({item}) => {
    const fileExtension = item.split('.').pop().toLowerCase();
    const isVideo = fileExtension === 'mp4';
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension);

    if (isVideo) {
      return (
        <Pressable
          style={[styles.pdh16, {width: width, height: height * 0.7}]}>
          <Video
            source={{uri: item}}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
            controls
            paused={currentIndex !== mediaUriArray.indexOf(item)}
          />
        </Pressable>
      );
    } else if (isImage) {
      return (
        <Pressable
          style={[styles.pdh16, {width: width, height: height * 0.7}]}>
          <Image
            source={{uri: item}}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        </Pressable>
      );
    } else {
      return (
        <View style={[styles.pdh16, {width: width, height: height * 0.7}]}>
          <Text>Unsupported media type</Text>
        </View>
      );
    }
  };

  const Pagination = () => {
    return (
      <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
        {mediaUriArray.map((_, index) => (
          <View
            key={index}
            style={{
              height: 8,
              width: 8,
              borderRadius: 4,
              backgroundColor:
                currentIndex === index ? colors.mintGreen : '#C4C4C4',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[{flex: 1}]}>
      <TitleHeader
        title={'Ads Media'}
        onBackPress={() => navigation.pop()}
        style={[styles.pdl16]}
      />
      <View style={[{flex: 1}, styles.pdv12]}>
        <FlatList
          style={[{paddingHorizontal: 0}]}
          data={mediaUriArray}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          ref={flatListRef}
        />
        <Pagination />
      </View>
    </SafeAreaView>
  );
};

export default AdsMedia;