import {StyleSheet, Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
import colors from '../colors';

const styles = StyleSheet.create({
  //for margin
  m4: {margin: 4},
  m8: {margin: 8},
  m12: {margin: 12},
  m16: {margin: 16},
  m20: {margin: 20},
  m24: {margin: 24},
  m28: {margin: 28},
  m32: {margin: 32},
  m36: {margin: 36},
  m40: {margin: 40},
  m44: {margin: 44},
  m48: {margin: 48},

  //margin top
  mt4: {marginTop: 4},
  mt8: {marginTop: 8},
  mt12: {marginTop: 12},
  mt16: {marginTop: 16},
  mt20: {marginTop: 20},
  mt24: {marginTop: 24},
  mt28: {marginTop: 28},
  mt32: {marginTop: 32},
  mt36: {marginTop: 36},
  mt40: {marginTop: 40},
  mt44: {marginTop: 44},
  mt48: {marginTop: 48},

  // MarginBottom styles
  mb4: {marginBottom: 4},
  mb8: {marginBottom: 8},
  mb12: {marginBottom: 12},
  mb16: {marginBottom: 16},
  mb20: {marginBottom: 20},
  mb24: {marginBottom: 24},
  mb28: {marginBottom: 28},
  mb32: {marginBottom: 32},
  mb36: {marginBottom: 36},
  mb40: {marginBottom: 40},
  mb44: {marginBottom: 44},
  mb48: {marginBottom: 48},

  // margin left

  mr4: {marginRight: 4},
  mr8: {marginRight: 8},
  mr12: {marginRight: 12},
  mr16: {marginRight: 16},
  mr20: {marginRight: 20},
  mr24: {marginRight: 24},
  mr28: {marginRight: 28},
  mr32: {marginRight: 32},
  mr36: {marginRight: 36},
  mr40: {marginRight: 40},
  mr44: {marginRight: 44},
  mr48: {marginRight: 48},

  // margin left
  ml4: {marginLeft: 4},
  ml8: {marginLeft: 8},
  ml12: {marginLeft: 12},
  ml16: {marginLeft: 16},
  ml20: {marginLeft: 20},
  ml24: {marginLeft: 24},
  ml28: {marginLeft: 28},
  ml32: {marginLeft: 32},
  ml36: {marginLeft: 36},
  ml40: {marginLeft: 40},
  ml44: {marginLeft: 44},
  ml48: {marginLeft: 48},

  // MarginHorizontal styles
  mh4: {marginHorizontal: 4},
  mh8: {marginHorizontal: 8},
  mh12: {marginHorizontal: 12},
  mh16: {marginHorizontal: 16},
  mh20: {marginHorizontal: 20},
  mh24: {marginHorizontal: 24},
  mh28: {marginHorizontal: 28},
  mh32: {marginHorizontal: 32},
  mh36: {marginHorizontal: 36},
  mh40: {marginHorizontal: 40},
  mh44: {marginHorizontal: 44},
  mh48: {marginHorizontal: 48},

  // MarginVertical styles
  mv4: {marginVertical: 4},
  mv8: {marginVertical: 8},
  mv12: {marginVertical: 12},
  mv16: {marginVertical: 16},
  mv20: {marginVertical: 20},
  mv24: {marginVertical: 24},
  mv28: {marginVertical: 28},
  mv32: {marginVertical: 32},
  mv36: {marginVertical: 36},
  mv40: {marginVertical: 40},
  mv44: {marginVertical: 44},
  mv48: {marginVertical: 48},




  // padding styles

  p4: {padding: 4},
  p8: {padding: 8},
  p12: {padding: 12},
  p16: {padding: 16},
  p20: {padding: 20},
  p24: {padding: 24},
  p28: {padding: 28},
  p32: {padding: 32},
  p36: {padding: 36},
  p40: {padding: 40},
  p44: {padding: 44},
  p48: {padding: 48},



  // PaddingTop styles
  pdt4: {paddingTop: 4},
  pdt8: {paddingTop: 8},
  pdt12: {paddingTop: 12},
  pdt16: {paddingTop: 16},
  pdt20: {paddingTop: 20},
  pdt24: {paddingTop: 24},
  pdt28: {paddingTop: 28},
  pdt32: {paddingTop: 32},
  pdt36: {paddingTop: 36},
  pdt40: {paddingTop: 40},
  pdt44: {paddingTop: 44},
  pdt48: {paddingTop: 48},

  // PaddingBottom styles
  pdb4: {paddingBottom: 4},
  pdb8: {paddingBottom: 8},
  pdb12: {paddingBottom: 12},
  pdb16: {paddingBottom: 16},
  pdb20: {paddingBottom: 20},
  pdb24: {paddingBottom: 24},
  pdb28: {paddingBottom: 28},
  pdb32: {paddingBottom: 32},
  pdb36: {paddingBottom: 36},
  pdb40: {paddingBottom: 40},
  pdb44: {paddingBottom: 44},
  pdb48: {paddingBottom: 48},

  // PaddingLeft styles
  pdl4: {paddingLeft: 4},
  pdl8: {paddingLeft: 8},
  pdl12: {paddingLeft: 12},
  pdl16: {paddingLeft: 16},
  pdl20: {paddingLeft: 20},
  pdl24: {paddingLeft: 24},
  pdl28: {paddingLeft: 28},
  pdl32: {paddingLeft: 32},
  pdl36: {paddingLeft: 36},
  pdl40: {paddingLeft: 40},
  pdl44: {paddingLeft: 44},
  pdl48: {paddingLeft: 48},

  // PaddingRight styles
  pdr4: {paddingRight: 4},
  pdr8: {paddingRight: 8},
  pdr12: {paddingRight: 12},
  pdr16: {paddingRight: 16},
  pdr20: {paddingRight: 20},
  pdr24: {paddingRight: 24},
  pdr28: {paddingRight: 28},
  pdr32: {paddingRight: 32},
  pdr36: {paddingRight: 36},
  pdr40: {paddingRight: 40},
  pdr44: {paddingRight: 44},
  pdr48: {paddingRight: 48},

  // PaddingHorizontal styles
  pdh4: {paddingHorizontal: 4},
  pdh8: {paddingHorizontal: 8},
  pdh12: {paddingHorizontal: 12},
  pdh16: {paddingHorizontal: 16},
  pdh20: {paddingHorizontal: 20},
  pdh24: {paddingHorizontal: 24},
  pdh28: {paddingHorizontal: 28},
  pdh32: {paddingHorizontal: 32},
  pdh36: {paddingHorizontal: 36},
  pdh40: {paddingHorizontal: 40},
  pdh44: {paddingHorizontal: 44},
  pdh48: {paddingHorizontal: 48},

  // PaddingVertical styles
  pdv4: {paddingVertical: 4},
  pdv8: {paddingVertical: 8},
  pdv12: {paddingVertical: 12},
  pdv16: {paddingVertical: 16},
  pdv20: {paddingVertical: 20},
  pdv24: {paddingVertical: 24},
  pdv28: {paddingVertical: 28},
  pdv32: {paddingVertical: 32},
  pdv36: {paddingVertical: 36},
  pdv40: {paddingVertical: 40},
  pdv44: {paddingVertical: 44},
  pdv48: {paddingVertical: 48},


  // font size 
  ts10: { fontSize: 10 },
  ts11: { fontSize: 11 },
  ts12: { fontSize: 12 },
  ts13: { fontSize: 13 },
  ts14: { fontSize: 14 },
  ts15: { fontSize: 15 },
  ts16: { fontSize: 16 },
  ts17: { fontSize: 17 },
  ts18: { fontSize: 18 },
  ts19: { fontSize: 19 },
  ts20: { fontSize: 20 },
  ts21: { fontSize: 21 },
  ts22: { fontSize: 22 },
  ts23: { fontSize: 23 },
  ts24: { fontSize: 24 },
  ts25: { fontSize: 25 },


  background: {
    flex: 1,
  },
  headerTop: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seperator: {
    height: 1,
    borderRadius: 1,
    backgroundColor: colors.grey50,
  },
  seperator1: {
    height: 0.2,
    borderRadius: 0.4,
    backgroundColor: '#212121',
    color: '#212121',
  },
  fdRow: {
    flexDirection: 'row',
  },
  icon16: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  icon20: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  icon24: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  icon28: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },
  icon32: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  icon36: {
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
  icon40: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  icon44: {
    height: 44,
    width: 44,
    resizeMode: 'contain',
  },
  icon48: {
    height: 48,
    width: 48,
    resizeMode: 'contain',
  },
  iconLarge : {
    height : 64, 
    width : 64, 
    resizeMode : "contain"
  }, 

  fw700: {fontWeight: '700'},
  fw400: {fontWeight: '400'},
  fwBold: {fontWeight: 'bold'},

  h1: {
    ...Platform.select({
      ios: {fontSize: 24},
      android: {fontSize: 22},
    }),
    fontWeight: 'bold',
    color : colors.black
  },

  h2: {
    ...Platform.select({
      ios: {fontSize: 22},
      android: {fontSize: 20},
    }),
    fontWeight: 'bold',
  },
  h3: {
    // ...Platform.select({
    //   ios: {fontSize: 20},
    //   android: {fontSize: 18},
    // }),
    fontSize: 18,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  h5: {
    ...Platform.select({
      ios: {fontSize: 14},
      android: {fontSize: 14},
    }),
    color: colors.black,
    fontWeight: 'bold',
  },
  h6: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  logoMedium: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    paddingBottom: 0,
  },

  logoSmall: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    paddingBottom: 0,
  },

  input: {
    margin: 15,
    height: 10,
    width: 100,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },

  fonts: {
    FiraSans: 'Fira Sans',
  },
});

export default styles;
