import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BottomNavigation,
  TitleHeader,
  SearchInput,
} from '../../component/shared';
import styles from '../../assets/styles';
import {ChatCard} from '../../component/Chats';
import {get} from '../../utils/requestBuilder';
import colors from '../../assets/colors';
import {getUserInfo} from '../../utils/function';
import {useFocusEffect} from '@react-navigation/native';

const Chats = ({navigation}) => {
  const button = [
    {id: 1, label: 'All'},
    {id: 2, label: 'Buy'},
    {id: 3, label: 'Sell'},
  ];

  const [socket] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  const [interactedUsers, setInteractedUsers] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchNames, setSearchNames] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [conversationId, setConversationId] = useState('');

  const [itemParentId, setItemParentId] = useState('');
  const [anotherUserPhone, setAnotherUserPhone] = useState('');
  const [itemDisplayPicture, setItemDisplayPicture] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [itemLocation, setItemLocation] = useState('');
  const [itemAskingPrice, setItemAskingPrice] = useState('');
  const [userChatsData, setUserChatsData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getUser();
    }, [myId]), 
  );

  useEffect(() => {
    if (socket) {
      socket.on('new_message', message => {
        setMessages(prevMessages => [...prevMessages, message]);
        console.log(`New message received from the backend: ${message}`);
      });
    }
    return () => {
      if (socket) {
        socket.off('new_message');
      }
    };
  }, [socket]);

  useEffect(() => {
    getUser();
  }, []);

  const onRefresh = () => {
    getChatsList(myId);
  };

  const getUser = async () => {
    try {
      const userData = await getUserInfo();
      if (userData) {
        const {_id} = userData.user;
        setMyId(_id);
        getChatsList(_id);
      } else {
        setIsLoading(false);
        console.log('No user data available. User is not logged in.');
      }
    } catch (error) {
      console.log(`Error while fetching user info: ${error}`);
    }
  };


  const getChatsList = async (userId) => {
    setIsLoading(true);
    try {
      const url = `api/v1/messages/fetch/messageList/${userId}`;
      const chatsCardData = [];

      const { response, status } = await get(url, true);
      if (status === 200) {
        if (response.response !== null) {
          response.response.chats.map((item, index) => {
            const { updatedAt, content, _id } = item;
            const lastMessage = item.content[item.content.length - 1]?.message;

            const itemData = item.itemId && Array.isArray(item.itemId.item)
              ? item.itemId.item[0]
              : item.itemId?.item;

            if (!itemData) {
              return; 
            }

            const { displayName, askingPrice, location, media } = itemData || {};
            const { _id: itemId } = item.itemId || {};
            const itemDisplayPicture = media?.find(uri => !uri.endsWith('.mp4'));

            const phoneNumber =
              userId === item.senderId._id
                ? item.receiverId.phoneNumber
                : item.senderId.phoneNumber;
            const userName =
              userId === item.senderId._id
                ? item.receiverId.userName
                : item.senderId.userName;
            const profilePicture =
              userId === item.senderId._id
                ? item.receiverId.profilePicture
                : item.senderId.profilePicture;
            const FCMToken =
              userId === item.senderId._id
                ? item.receiverId.FCMToken
                : item.senderId.FCMToken;

            const data = {
              userName,
              profilePicture,
              updatedAt,
              lastMessage,
              content,
              phoneNumber,
              conversationId: _id,
              displayName,
              askingPrice,
              location,
              itemDisplayPicture,
              itemId,
              FCMToken,
            };
            chatsCardData.push(data);
          });

          chatsCardData.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          );

          setInteractedUsers(chatsCardData);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log(response, 'no chats exist');
        }
      } else {
        setIsLoading(false);
        console.log('Status is not 200: ', status);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(`Error while fetching all the chats: ${error}`);
    }
};


  const handleSearch = text => {
    setSearchInput(text);
  };

  const renderChatCard = ({item}) => {
    return (
      <ChatCard
        key={item.conversationId}
        name={item.userName}
        lastMessage={item.lastMessage}
        profilePic={item.profilePicture}
        lastMessageTime={item.updatedAt}
        conversation={item.content}
        phoneNumber={item.phoneNumber}
        myId={myId}
        conversationId={item.conversationId}
        isNew={false}
        itemId={item.itemId}
        displayName={item.displayName}
        itemDisplayPicture={item.itemDisplayPicture}
        itemLocation={item.location}
        itemAskingPrice={item.askingPrice}
        otherUserFCMToken={item.FCMToken}
      />
    );
  };  

  return (
    <SafeAreaView style={[styles.pdh16, {height: '100%'}]}>
      <TitleHeader
        title={'Messages'}
        onBackPress={() => navigation.navigate('Home')}
      />
      <SearchInput value={searchInput} onChange={handleSearch} />

      <View style={[styles.mt16, {marginBottom: 50, flex: 1}]}>
        {isLoading ? (
          <ActivityIndicator
            size={'large'}
            color={colors.darkGrey}
            style={[{marginTop: 250}]}
          />
        ) : !searchInput ? (
          <FlatList
            data={interactedUsers}
            renderItem={({item}) => renderChatCard({item})}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
                colors={['#D3D3D3', colors.darkGrey]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          interactedUsers.map((item, index) => {
            const trimmedUserName = item.userName.trim().toLowerCase();
            const trimmedInput = searchInput.trim().toLowerCase();
            if (trimmedUserName.includes(trimmedInput)) {
              return (
                <ChatCard
                  key={index}
                  name={item.userName}
                  lastMessage={item.lastMessage}
                  profilePic={item.profilePicture}
                  lastMessageTime={item.updatedAt}
                />
              );
            }
          })
        )}
        {!isLoading && interactedUsers.length === 0 && (
          <View
            style={[{flex: 1, justifyContent: 'center', alignItems: 'center', position : "relative" , top : -200}]}>
            <Text
              style={[
                {color: colors.grey800, textAlign: 'center'},
                styles.ts13,
              ]}>
              You have no messages yet. Start chatting with buyers or sellers to
              see your conversations here.
            </Text>
          </View>
        )}
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default Chats;
