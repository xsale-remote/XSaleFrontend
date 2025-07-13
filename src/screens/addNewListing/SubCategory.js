import {View, FlatList, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {TitleHeader} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {CategoriesItemBox} from '../../component/shared';
import images from '../../assets/images';
import icons from '../../assets/icons';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const SubCategory = ({navigation, route}) => {
  const {title} = route.params;
  const Animals = [
    {id: 1, itemName: 'Cow', image: images.cow, categoryName: 'Animals'},
    {
      id: 2,
      itemName: 'Buffalo',
      image: images.buffalo,
      categoryName: 'Animals',
    },
    {id: 3, itemName: 'Bull', image: images.bull, categoryName: 'Animals'},
    {id: 4, itemName: 'Sheep', image: images.sheep, categoryName: 'Animals'},
    {id: 5, itemName: 'Goat', image: images.goat, categoryName: 'Animals'},
    {id: 6, itemName: 'Cat', image: images.cat, categoryName: 'Animals'},
    {id: 7, itemName: 'Horse', image: images.horse, categoryName: 'Animals'},
    {id: 8, itemName: 'Dog', image: images.dog, categoryName: 'Animals'},
    {id: 9, itemName: 'Donkey', image: images.donkey, categoryName: 'Animals'},
    {
      id: 10,
      itemName: 'Other Animals',
      image: images.otherAnimals,
      categoryName: 'Animals',
    },
  ];

  const Vehicles = [
    {id: 1, itemName: 'Car', image: images.car},
    {id: 2, itemName: 'Ambulance', image: images.ambulance},
    {id: 3, itemName: 'Truck', image: images.truck},
    {id: 4, itemName: 'Tractor', image: images.tractor},
    {id: 5, itemName: 'Farm Machine', image: images.farm_machine},
    {id: 6, itemName: 'JCB', image: images.JCB},
    {id: 7, itemName: 'Bus', image: images.bus},
    {id: 8, itemName: 'Crain', image: images.crain},
    {id: 9, itemName: 'Other Vehicle', image: images.otherVehicles},
  ];

  const Property = [
    {
      id: 1,
      itemName: 'Residential',
      image: images.house,
      categoryName: 'Property',
    },
    {
      id: 2,
      itemName: 'Commercial',
      image: images.shop,
      categoryName: 'Property',
    },
    {id: 3, itemName: 'Land', image: images.land, categoryName: 'Property'},
  ];
  const PropertyRent = [
    {
      id: 1,
      itemName: 'Residential',
      image: images.house,
      categoryName: 'Property for Rent',
    },
    {
      id: 2,
      itemName: 'Commercial',
      image: images.shop,
      categoryName: 'Property for Rent',
    },
    {
      id: 3,
      itemName: 'PG/Hostel',
      image: images.pg_hostel,
      categoryName: 'Property for Rent',
    },
  ];

  const Mobile = [
    {id: 1, itemName: 'Mobile', image: images.mobile, categoryName: 'Mobile'},
    {id: 2, itemName: 'Tablet', image: images.tablet, categoryName: 'Mobile'},
    {
      id: 3,
      itemName: 'Accessories',
      image: images.accessories,
      categoryName: 'Mobile',
    },
  ];

  const Bike = [
    {id: 1, itemName: 'Bike', image: images.bike, categoryName: 'Bikes'},
    {id: 2, itemName: 'Scooty', image: images.scooty, categoryName: 'Bikes'},
    {id: 3, itemName: 'Bicycles', image: images.bicycle, categoryName: 'Bikes'},
    {
      id: 4,
      itemName: 'Spare Parts',
      image: images.spare_parts,
      categoryName: 'Bikes',
    },
  ];

  const Electronics = [
    {id: 1, itemName: 'AC', image: images.ac, categoryName: 'Electronics'},
    {id: 2, itemName: 'TV', image: images.tv, categoryName: 'Electronics'},
    {
      id: 3,
      itemName: 'Fridge',
      image: images.fridge,
      categoryName: 'Electronics',
    },
    {
      id: 4,
      itemName: 'Washing Machine',
      image: images.washing_machine,
      categoryName: 'Electronics',
    },
    {
      id: 5,
      itemName: 'Coolers and Fans',
      image: images.cooler,
      categoryName: 'Electronics',
    },
    {
      id: 6,
      itemName: 'Kitchen Appliances',
      image: images.kitchen_appliances,
      categoryName: 'Electronics',
    },
    {
      id: 7,
      itemName: 'Laptop/Computer',
      image: images.laptop_computer,
      categoryName: 'Electronics',
    },
    {
      id: 8,
      itemName: 'Laptop/PC Accessories',
      image: images.laptop_accessories,
      categoryName: 'Electronics',
    },
    {
      id: 9,
      itemName: 'Camera and Lenses',
      image: images.camera,
      categoryName: 'Electronics',
    },
    {
      id: 10,
      itemName: 'Other Electronics',
      image: images.otherElectronics,
      categoryName: 'Electronics',
    },
  ];

  const Jobs = [
    {id: 1, itemName: 'Farm Labour', image: icons.farmer, categoryName: 'Jobs'},
    {
      id: 2,
      itemName: 'Factory Woker',
      image: icons.factory_worker,
      categoryName: 'Jobs',
    },
    {
      id: 3,
      itemName: 'Building Construction',
      image: icons.building_construction,
      categoryName: 'Jobs',
    },
    {id: 4, itemName: 'Maid', image: icons.maid, categoryName: 'Jobs'},
    {id: 5, itemName: 'Driver', image: icons.driver, categoryName: 'Jobs'},
    {id: 6, itemName: 'Security', image: icons.security, categoryName: 'Jobs'},
    {id: 7, itemName: 'Cook', image: icons.cook, categoryName: 'Jobs'},
    {
      id: 8,
      itemName: 'Supervisor',
      image: icons.supervisor,
      categoryName: 'Jobs',
    },
    {id: 9, itemName: 'Teacher', image: icons.teacher, categoryName: 'Jobs'},
    {
      id: 10,
      itemName: 'Data Entry',
      image: icons.data_entry,
      categoryName: 'Jobs',
    },
    {
      id: 11,
      itemName: 'Sales & Marketing',
      image: icons.sales_marketing,
      categoryName: 'Jobs',
    },
    {id: 12, itemName: 'BPO', image: icons.bpo, categoryName: 'Jobs'},
    {
      id: 13,
      itemName: 'Office Assistant',
      image: icons.office_assistant,
      categoryName: 'Jobs',
    },
    {
      id: 14,
      itemName: 'Accountant',
      image: icons.accountant,
      categoryName: 'Jobs',
    },
    {
      id: 15,
      itemName: 'Operator & Technician',
      image: icons.operator_technician,
      categoryName: 'Jobs',
    },
    {
      id: 16,
      itemName: 'IT Engineer & Developer',
      image: icons.developer,
      categoryName: 'Jobs',
    },
    {id: 17, itemName: 'Designer', image: icons.designer, categoryName: 'Jobs'},
    {
      id: 18,
      itemName: 'Hotel & Restaurant',
      image: icons.hotel_restaurant,
      categoryName: 'Jobs',
    },
  ];

  const Matrimonial = [
    {
      id: 1,
      itemName: 'Groom',
      image: images.bride,
      categoryName: 'Matrimonial',
    },
    {
      id: 2,
      itemName: 'Bride',
      image: images.groom,
      categoryName: 'Matrimonial',
    },
  ];

  const Furniture = [
    {
      id: 1,
      itemName: 'Bed & Wardrobe',
      image: images.bed_wardrobe,
      categoryName: 'Furniture',
    },
    {
      id: 2,
      itemName: 'Sofa & Dining',
      image: images.sofa,
      categoryName: 'Furniture',
    },
    {
      id: 3,
      itemName: 'Home Decor',
      image: images.home_decor,
      categoryName: 'Furniture',
    },
    {
      id: 4,
      itemName: 'Kids & Furniture',
      image: images.kid_furniture,
      categoryName: 'Furniture',
    },
    {
      id: 5,
      itemName: 'Other Furnitures',
      categoryName: 'Furniture',
      image: images.otherFurniture,
    },
  ];

  const Poultry = [
    {
      id: 1,
      itemName: 'Chicken',
      image: images.chicken,
      categoryName: 'Poultry & Birds',
    },
    {
      id: 2,
      itemName: 'Fish',
      image: images.fish,
      categoryName: 'Poultry & Birds',
    },
    {
      id: 3,
      itemName: 'Birds',
      image: images.birds,
      categoryName: 'Poultry & Birds',
    },
  ];

  const FarmMachines = [
    {
      id: 1,
      itemName: 'Threshers',
      image: images.threshers,
      categoryName: 'Farm Machine',
    },
    {
      id: 2,
      itemName: 'Crop Cutter',
      image: images.crop_cutter,
      categoryName: 'Farm Machine',
    },
    {
      id: 3,
      itemName: 'Power Thriller',
      image: images.power_thriller,
      categoryName: 'Farm Machine',
    },
    {
      id: 4,
      itemName: 'Trailor',
      image: images.trailer,
      categoryName: 'Farm Machine',
    },
    {
      id: 5,
      itemName: 'Cultivator',
      image: images.cultivator,
      categoryName: 'Farm Machine',
    },
    {
      id: 6,
      itemName: 'Harvesting & Machinery',
      image: images.harversting_machinery,
      categoryName: 'Farm Machine',
    },
    {
      id: 7,
      itemName: 'Sprayers',
      image: images.sprayer,
      categoryName: 'Farm Machine',
    },
    {
      id: 8,
      itemName: 'Ground Cover',
      image: images.ground_covers,
      categoryName: 'Farm Machine',
    },
    {
      id: 9,
      itemName: 'Boundary Fencing',
      image: images.boundry_fencing,
      categoryName: 'Farm Machine',
    },
    {
      id: 10,
      itemName: 'Other Farm Machinery',
      categoryName: 'Farm Machine',
      image: images.other_farmMachine,
    },
  ];

  const Services = [
    {
      id: 1,
      itemName: 'Education & Classes',
      image: images.education_classes,
      categoryName: 'Services',
    },
    {
      id: 2,
      itemName: 'Tour & Travels',
      image: images.tour_travels,
      categoryName: 'Services',
    },
    {
      id: 3,
      itemName: 'Electronic Repair & Services',
      image: images.electronic_repair_service,
      categoryName: 'Services',
    },
    {
      id: 4,
      itemName: 'Health & Beauty',
      image: images.health_beauty,
      categoryName: 'Services',
    },
    {
      id: 5,
      itemName: 'Home Renovation',
      image: images.homeRenovation_services,
      categoryName: 'Services',
    },
    {
      id: 6,
      itemName: 'Legal & Document Services',
      image: images.legal_documentServices,
      categoryName: 'Services',
    },
    {
      id: 7,
      itemName: 'Packers & Movers',
      image: images.packers_movers,
      categoryName: 'Services',
    },
    {
      id: 8,
      itemName: 'Other services',
      image: images.other_services,
      categoryName: 'Services',
    },
  ];

  const Fashion = [
    {
      id: 1,
      itemName: 'Mens',
      image: images.mens_fashion,
      categoryName: 'Fashion',
    },
    {
      id: 2,
      itemName: 'Womens',
      image: images.womens_fahsion,
      categoryName: 'Fashion',
    },
    {
      id: 3,
      itemName: 'Kids',
      image: images.kids_fashion,
      categoryName: 'Fashion',
    },
  ];

  const renderCatrgoryItemBox = ({item}) => {
    return (
      <CategoriesItemBox
        itemName={item.itemName}
        image={item.image}
        all={item.all ? true : false}
        style={[styles.mr12, {width: '31%'}, styles.mb12]}
        onCardPress={() => {
          if (title === 'Vehicle') {
            navigation.navigate('VehicleSale', {
              itemName: item.itemName,
              categoryName: 'Vehicles',
            });
          } else if (title === 'Vehicle for rent') {
            navigation.navigate('VehicleRent', {
              itemName: item.itemName,
              categoryName: 'Vehicle for Rent',
            });
          } else if (title === 'Mobile') {
            if (item.id === 1) {
              navigation.navigate('Mobile', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 2) {
              navigation.navigate('Tablet', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 3) {
              navigation.navigate('Accessories', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          } else if (title === 'Bike') {
            if (item.id === 1 || item.id === 2) {
              navigation.navigate('Bike_Scooty', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 3) {
              navigation.navigate('Bicycle', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else {
              navigation.navigate('SpareParts', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          } else if (title === 'Jobs') {
            navigation.navigate('Job', {
              itemName: item.itemName,
              categoryName: item.categoryName,
              jobStatus: route.params.jobStatus,
            });
          } else if (title === 'Matrimonial') {
            navigation.navigate('Matrimonial', {
              itemName: item.itemName,
              categoryName: item.categoryName,
            });
          } else if (title === 'Furniture') {
            navigation.navigate('Furniture', {
              itemName: item.itemName,
              categoryName: item.categoryName,
            });
          } else if (title === 'Farm Machines') {
            navigation.navigate('FarmMachine', {
              itemName: item.itemName,
              categoryName: item.categoryName,
            });
          } else if (title === 'Services') {
            navigation.navigate('Services', {
              itemName: item.itemName,
              categoryName: item.categoryName,
            });
          } else if (title === 'Fashion') {
            navigation.navigate('Fashion', {
              itemName: item.itemName,
              categoryName: item.categoryName,
            });
          } else if (title === 'Poultry & Birds') {
            if (item.id === 1) {
              navigation.navigate('Chicken', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 2) {
              navigation.navigate('Fish', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else {
              navigation.navigate('Bird', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          } else if (title === 'Electronics') {
            if (item.id === 1 || item.id === 3) {
              navigation.navigate('ACFridge', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 2 || item.id === 4) {
              navigation.navigate('TV_WashingMachine', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 5 || item.id === 6) {
              navigation.navigate('CoolerFan_KitchenAppliances', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 7) {
              navigation.navigate('LaptopComputer', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 8) {
              navigation.navigate('ComputerAccessories', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 9) {
              navigation.navigate('CameraLense', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 10) {
              navigation.navigate('OtherElectronics', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          } else if (title === 'Animal') {
            if (item.id === 1 || item.id === 2) {
              navigation.navigate('CowBuffalo', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 3) {
              navigation.navigate('Bull', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 4 || item.id === 5) {
              navigation.navigate('GoatSheep', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 6 || item.id === 7) {
              navigation.navigate('HorseCat', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 8) {
              navigation.navigate('Dog', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 9) {
              navigation.navigate('Donkey', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 10) {
              navigation.navigate('OtherAnimals', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          } else if (title === 'Property') {
            if (item.id === 1 || item.id === 2) {
              console.log('here we are');
              navigation.navigate('PropertySale', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 3) {
              navigation.navigate('LandSale', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          } else if (title === 'Property for rent') {
            if (item.id === 1 || item.id === 2) {
              navigation.navigate('PropertyRent', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            } else if (item.id === 3) {
              navigation.navigate('Hostel', {
                itemName: item.itemName,
                categoryName: item.categoryName,
              });
            }
          }
        }}
      />
    );
  };

  // return (
  //   <SafeAreaView style={[{flex: 1}, styles.pdh16]}>
  //     <TitleHeader
  //       title={'Add New Listing'}
  //       style={[styles.mb8]}
  //       onBackPress={() => navigation.pop()}
  //     />
  //     <View
  //       style={[
  //         {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
  //       ]}></View>
  //     <View style={[styles.mt8]}>
  //       {title !== 'Vehicle for rent' &&
  //         title !== 'Services' &&
  //         title !== 'Property for rent' &&
  //         title !== 'Jobs' &&
  //         title !== 'Matrimonial' && (
  //           <Text style={[styles.h3, {color: colors.black}]}>
  //             What do you want to sell ?
  //           </Text>
  //         )}

  //       {(title === 'Vehicle for rent' || title === 'Property for rent') && (
  //         <Text style={[styles.h3, {color: colors.black}]}>
  //           What are you interested in renting?
  //         </Text>
  //       )}

  //       {title === 'Jobs' && (
  //         <Text style={[styles.h3, {color: colors.black}]}>
  //           {route.params.jobStatus === 'I am looking for a job'
  //             ? 'What type of job are you looking for?'
  //             : 'What type of job are you offering?'}
  //         </Text>
  //       )}

  //       {title === 'Services' && (
  //         <Text style={[styles.h3, {color: colors.black}]}>
  //           What service are you providing ?
  //         </Text>
  //       )}

  //       <Text
  //         style={[styles.mt8, styles.h4, styles.mb8, {color: colors.black}]}>
  //         Select one
  //       </Text>
  //       <View style={[styles.mt4]}>
  //         {title === 'Animal' && (
  //           <FlatList
  //             data={Animals}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}

  //         {(title === 'Vehicle' || title === 'Vehicle for rent') && (
  //           <FlatList
  //             data={Vehicles}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}

  //         {title === 'Property' && (
  //           <FlatList
  //             data={Property}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Property for rent' && (
  //           <FlatList
  //             data={PropertyRent}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Mobile' && (
  //           <FlatList
  //             data={Mobile}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Bike' && (
  //           <FlatList
  //             data={Bike}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Electronics' && (
  //           <FlatList
  //             data={Electronics}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Jobs' && (
  //           <FlatList
  //             data={Jobs}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Matrimonial' && (
  //           <FlatList
  //             data={Matrimonial}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Furniture' && (
  //           <FlatList
  //             data={Furniture}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Poultry & Birds' && (
  //           <FlatList
  //             data={Poultry}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Farm Machines' && (
  //           <FlatList
  //             data={FarmMachines}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Services' && (
  //           <FlatList
  //             data={Services}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}
  //         {title === 'Fashion' && (
  //           <FlatList
  //             data={Fashion}
  //             renderItem={renderCatrgoryItemBox}
  //             showsVerticalScrollIndicator={false}
  //             numColumns={3}
  //           />
  //         )}

  //         <View style={{borderWidth : 1, position : "absolute" , bottom : 0}}>
  //           <BannerAd
  //             size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  //             unitId={'ca-app-pub-9372794286829313/9740150801'}
  //             onAdFailedToLoad={error => {
  //               console.log('Ad failed to load:', error);
  //             }}
  //             onAdLoaded={() => {
  //               console.log('Ad loaded successfully');
  //             }}
  //           />
  //         </View>
  //       </View>
  //     </View>
  //   </SafeAreaView>
  // );

  return (
    <SafeAreaView style={[{flex: 1}, styles.pdh16]}>
      <TitleHeader
        title={'Add New Listing'}
        style={[styles.mb8]}
        onBackPress={() => navigation.pop()}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}
      />
      <View style={[styles.mt8, {flex: 1}]}>
        {title !== 'Vehicle for rent' &&
          title !== 'Services' &&
          title !== 'Property for rent' &&
          title !== 'Jobs' &&
          title !== 'Matrimonial' && (
            <Text style={[styles.h3, {color: colors.black}]}>
              What do you want to sell ?
            </Text>
          )}

        {(title === 'Vehicle for rent' || title === 'Property for rent') && (
          <Text style={[styles.h3, {color: colors.black}]}>
            What are you interested in renting?
          </Text>
        )}

        {title === 'Jobs' && (
          <Text style={[styles.h3, {color: colors.black}]}>
            {route.params.jobStatus === 'I am looking for a job'
              ? 'What type of job are you looking for?'
              : 'What type of job are you offering?'}
          </Text>
        )}

        {title === 'Services' && (
          <Text style={[styles.h3, {color: colors.black}]}>
            What service are you providing ?
          </Text>
        )}

        <Text
          style={[styles.mt8, styles.h4, styles.mb8, {color: colors.black}]}>
          Select one
        </Text>
        <View style={[styles.mt4, {flex: 1}]}>
          {title === 'Animal' && (
            <FlatList
              data={Animals}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}

          {(title === 'Vehicle' || title === 'Vehicle for rent') && (
            <FlatList
              data={Vehicles}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}

          {title === 'Property' && (
            <FlatList
              data={Property}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Property for rent' && (
            <FlatList
              data={PropertyRent}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Mobile' && (
            <FlatList
              data={Mobile}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Bike' && (
            <FlatList
              data={Bike}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Electronics' && (
            <FlatList
              data={Electronics}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Jobs' && (
            <FlatList
              data={Jobs}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Matrimonial' && (
            <FlatList
              data={Matrimonial}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Furniture' && (
            <FlatList
              data={Furniture}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Poultry & Birds' && (
            <FlatList
              data={Poultry}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Farm Machines' && (
            <FlatList
              data={FarmMachines}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Services' && (
            <FlatList
              data={Services}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}
          {title === 'Fashion' && (
            <FlatList
              data={Fashion}
              renderItem={renderCatrgoryItemBox}
              showsVerticalScrollIndicator={false}
              numColumns={3}
            />
          )}

          <View style={{width: '100%'}}>
            <BannerAd
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              unitId={'ca-app-pub-9372794286829313/9740150801'}
              onAdFailedToLoad={error => {
                console.log('Ad failed to load:', error);
              }}
              onAdLoaded={() => {
                console.log('Ad loaded successfully');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubCategory;
