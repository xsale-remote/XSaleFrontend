// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   ScrollView,
//   ActivityIndicator,
//   ToastAndroid,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {Button, TitleHeader} from '../../component/shared';
// import styles from '../../assets/styles';
// import colors from '../../assets/colors';
// import {MediaBox} from '../../component/addNewListing';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {post} from '../../utils/requestBuilder';
// import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

// const Media = ({navigation, route}) => {
//   const [mediaArray, setMediaArray] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);

//   const handleMediaSelection = async () => {
//     const options = {
//       mediaType: 'mixed',
//       includeBase64: false,
//       selectionLimit: 0,
//       multiple: true,
//     };

//     try {
//       const response = await launchImageLibrary(options);

//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.error('Image picker error:', response.error);
//       } else {
//         const assets = response.assets;

//         setIsUploading(true);

//         // Iterate over each selected file
//         for (const asset of assets) {
//           const {uri, fileName, type} = asset;

//           try {
//             // Request a pre-signed URL from the server
//             const presignedResponse = await post(
//               `api/v1/user/generate-presigned-url`,
//               {
//                 fileName,
//                 fileType: type,
//               },
//               true,
//             );

//             if (presignedResponse.status === 200) {
//               const {response: presignedUrl} = presignedResponse.response;

//               // Fetch the file as a blob
//               const fileBlob = await fetch(uri).then(res => res.blob());

//               // Upload the file directly to S3 using the pre-signed URL
//               const uploadResponse = await fetch(presignedUrl, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': type,
//                 },
//                 body: fileBlob,
//               });

//               if (uploadResponse.ok) {
//                 // Construct the uploaded file's URL
//                 const uploadedUrl = presignedUrl.split('?')[0]; // Remove query params from the URL

//                 const isImage = /\.(jpeg|jpg|png)$/.test(uploadedUrl);
//                 const newMedia = {
//                   uri: uploadedUrl,
//                   type: isImage ? 'image' : 'video',
//                 };

//                 setMediaArray(prev => [...prev, newMedia]);
//               } else {
//                 console.error('Failed to upload file to S3', uploadResponse);
//               }
//             } else {
//               console.error('Failed to get pre-signed URL', presignedResponse);
//             }
//           } catch (error) {
//             console.error('Error during file upload', error);
//             ToastAndroid.showWithGravityAndOffset(
//               'Failed to upload media. Please try again.',
//               ToastAndroid.LONG,
//               ToastAndroid.BOTTOM,
//               25,
//               50,
//             );
//           }
//         }

//         setIsUploading(false);
//       }
//     } catch (error) {
//       setIsUploading(false);
//       console.error('Error selecting image:', error);
//     }
//   };

//   const handleClosePress = itemToRemove => {
//     setMediaArray(mediaArray.filter(item => item !== itemToRemove)); // Filter and update mediaArray
//   };

//   const handleContinue = () => {
//     // Check if there is at least one image in the mediaArray
//     const hasImage = mediaArray.some(item => item.type === 'image');

//     if (!hasImage) {
//       // Show a message if there is no image
//       ToastAndroid.showWithGravityAndOffset(
//         'Please select at least one image.',
//         ToastAndroid.LONG,
//         ToastAndroid.BOTTOM,
//         25,
//         50,
//       );
//     } else {
//       // Continue to the next screen if there's an image
//       const item = route.params;
//       const itemDetails = {
//         ...item,
//         mediaArray: mediaArray,
//       };
//       navigation.navigate('ListingLocation', itemDetails);
//     }
//   };
//   return (
//     <SafeAreaView style={[styles.pdh16]}>
//       <TitleHeader
//         title={'Add New Listing'}
//         onBackPress={() => navigation.pop()}
//       />
//       <View
//         style={[
//           {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
//         ]}></View>
//       <ScrollView
//         style={[styles.pdt12, {height: '100%'}]}
//         showsVerticalScrollIndicator={false}>
//         <Text style={[styles.ts19, {color: colors.black}]}>
//           Uploads your Item's photo or video
//         </Text>
//         <Text
//           style={[styles.mt8, styles.ts15, styles.mb8, {color: colors.black}]}>
//           {'(Please use clear photos and videos for good impressions)'}
//         </Text>
//         <Button
//           label={'Add Media'}
//           style={[{width: '50%', alignSelf: 'center'}, styles.mb20]}
//           onPress={handleMediaSelection}
//         />
//         {isUploading && (
//           <ActivityIndicator
//             size={'large'}
//             color={colors.mintGreen}
//             style={[styles.mt48]}
//           />
//         )}
//         {mediaArray.length > 0 && !isUploading && (
//           <View style={[{flex: 1}]}>
//             <FlatList
//               data={mediaArray}
//               renderItem={({item}) => (
//                 <MediaBox
//                   mediaUri={item.uri}
//                   mediaType={item.type}
//                   style={[styles.mb12, styles.mr16]}
//                   onClosePress={() => handleClosePress(item)}
//                 />
//               )}
//               keyExtractor={item => item.uri || Math.random().toString()}
//               numColumns={2}
//             />
//           </View>
//         )}
//         {mediaArray.length > 0 && !isUploading && (
//           <Button
//             label={'Continue'}
//             style={{marginBottom: 100, marginTop: 30}}
//             onPress={handleContinue}
//           />
//         )}
//         <View style={{width: '100%'}}>
//           <BannerAd
//             size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//             unitId={'ca-app-pub-9372794286829313/9005653637'}
//             onAdFailedToLoad={error => {
//               console.log('Ad failed to load:', error);
//             }}
//             onAdLoaded={() => {
//               console.log('Ad loaded successfully');
//             }}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Media;






import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, TitleHeader} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {MediaBox} from '../../component/addNewListing';
import {launchImageLibrary} from 'react-native-image-picker';
import {post} from '../../utils/requestBuilder';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const Media = ({navigation, route}) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaSelection = async () => {
    const options = {
      mediaType: 'mixed',
      includeBase64: false,
      selectionLimit: 0,
      multiple: true,
    };

    try {
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('Image picker error:', response.error);
      } else {
        const assets = response.assets;

        setIsUploading(true);

        for (const asset of assets) {
          const {uri, fileName, type} = asset;

          try {
            const presignedResponse = await post(
              `api/v1/user/generate-presigned-url`,
              {
                fileName,
                fileType: type,
              },
              true,
            );

            if (presignedResponse.status === 200) {
              const {response: presignedUrl} = presignedResponse.response;

              const fileBlob = await fetch(uri).then(res => res.blob());

              const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                  'Content-Type': type,
                },
                body: fileBlob,
              });

              if (uploadResponse.ok) {
                const uploadedUrl = presignedUrl.split('?')[0];
                const isImage = /\.(jpeg|jpg|png)$/.test(uploadedUrl);
                const newMedia = {
                  uri: uploadedUrl,
                  type: isImage ? 'image' : 'video',
                };

                setMediaArray(prev => [...prev, newMedia]);
              } else {
                console.error('Failed to upload file to S3', uploadResponse);
              }
            } else {
              console.error('Failed to get pre-signed URL', presignedResponse);
            }
          } catch (error) {
            console.error('Error during file upload', error);
            ToastAndroid.showWithGravityAndOffset(
              'Failed to upload media. Please try again.',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
        }

        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Error selecting image:', error);
    }
  };

  const handleClosePress = itemToRemove => {
    setMediaArray(mediaArray.filter(item => item !== itemToRemove));
  };

  const handleContinue = () => {
    const hasImage = mediaArray.some(item => item.type === 'image');

    if (!hasImage) {
      ToastAndroid.showWithGravityAndOffset(
        'Please select at least one image.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      const item = route.params;
      const itemDetails = {
        ...item,
        mediaArray: mediaArray,
      };
      navigation.navigate('ListingLocation', itemDetails);
    }
  };

  return (
    <SafeAreaView style={[{flex: 1}, styles.pdh16]}>
      <TitleHeader
        title={'Add New Listing'}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}
      />
      <ScrollView
        style={[styles.pdt12]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <Text style={[styles.ts19, {color: colors.black}]}>
          Uploads your Item's photo or video
        </Text>
        <Text
          style={[styles.mt8, styles.ts15, styles.mb8, {color: colors.black}]}>
          {'(Please use clear photos and videos for good impressions)'}
        </Text>
        <Button
          label={'Add Media'}
          style={[{width: '50%', alignSelf: 'center'}, styles.mb20]}
          onPress={handleMediaSelection}
        />
        {isUploading && (
          <ActivityIndicator
            size={'large'}
            color={colors.mintGreen}
            style={[styles.mt48]}
          />
        )}
        {mediaArray.length > 0 && !isUploading && (
          <View style={{flex: 1}}>
            <FlatList
              data={mediaArray}
              renderItem={({item}) => (
                <MediaBox
                  mediaUri={item.uri}
                  mediaType={item.type}
                  style={[styles.mb12, styles.mr16]}
                  onClosePress={() => handleClosePress(item)}
                />
              )}
              keyExtractor={item => item.uri || Math.random().toString()}
              numColumns={2}
              contentContainerStyle={{paddingBottom: 20}} // Add padding to ensure content doesn't touch the ad
            />
          </View>
        )}
        {mediaArray.length > 0 && !isUploading && (
          <Button
            label={'Continue'}
            style={{marginBottom: 20, marginTop: 30}}
            onPress={handleContinue}
          />
        )}
      </ScrollView>
      <View style={{width: '100%', borderWidth : 1}}>
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={'ca-app-pub-9372794286829313/9005653637'}
          onAdFailedToLoad={error => {
            console.log('Ad failed to load:', error);
          }}
          onAdLoaded={() => {
            console.log('Ad loaded successfully');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Media;