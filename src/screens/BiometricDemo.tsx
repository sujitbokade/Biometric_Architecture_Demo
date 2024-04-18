import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  Alert,
  BackHandler,
  Text,
  TouchableOpacity,
  Button,
  NativeModules,
} from 'react-native';
import RTNMyBiometric from 'rtn-my-biometric/js/NativeMyBiometric';

interface CarouselItem {
  id: string;
  image: any;
}

const BiometricDemo: React.FC = () => {
  const flatListRef = useRef<FlatList<CarouselItem>>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const screenWidth = Dimensions.get('window').width;

  const ToastService = NativeModules.ToastModule;

  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [modalVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex]);

  useEffect(() => {
    biometricAuth();
  }, []);

  const biometricAuth = async () => {
    // Check if biometric authentication is supported
    try {
      const data = await RTNMyBiometric?.getAvailableBiometric()!;
      console.log(data);
    } catch (e) {
      console.log(e);
    }

    try {
      const isAuthenticated = await RTNMyBiometric?.authenticate();
      console.log('ISAuthenticated', isAuthenticated);
      setModalVisible(false);
      Alert.alert('Authentication successful!!');
    } catch (e: any) {
      console.log('error==>', e);
      if (
        e.code ==
          'Authentication error Fingerprint operation canceled by user.' ||
        e.code == 'Authentication error Authentication canceled by user.' ||
        e.code == 'Authentication error Fingerprint operation canceled.' ||
        e.code == 'Authentication error Authentication canceled'
      ) {
        return setModalVisible(true);
      } else {
        console.log('authentication error');
      }
    }
  };

  const showToastMessage = () => {
    //Two parameters needed  for toast message, first parameter is the message and second is location.
    ToastService.showToast('Hello World', 'Bottom');
  };

  const getItemLayout = (data: CarouselItem[] | null, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  const carouselData: CarouselItem[] = [
    {
      id: '01',
      image: require('../assets/slide1.png'),
    },
    {
      id: '02',
      image: require('../assets/slide2.png'),
    },
    {
      id: '03',
      image: require('../assets/slide3.png'),
    },
  ];

  const renderItem = ({item, index}: {item: CarouselItem; index: number}) => {
    return (
      <View>
        <Image
          source={item.image}
          style={[{width: screenWidth}, styles.imgStyle]}
        />
      </View>
    );
  };

  const renderDotIndicators = () => {
    return carouselData.map((_, index) => (
      <View
        key={index}
        style={[
          styles.indicatorStyle,
          {
            backgroundColor: activeIndex === index ? '#F79D20' : '#D0D0D0',
          },
        ]}
      />
    ));
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / screenWidth;
    setActiveIndex(index);
  };

  const handleModalButtonPress = () => {
    setModalVisible(false);
    biometricAuth();
  };
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View>
        <FlatList
          data={carouselData}
          ref={flatListRef}
          getItemLayout={getItemLayout}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onScroll={handleScroll}
        />
        <View style={styles.View}>{renderDotIndicators()}</View>
      </View>
      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.txtStyle}>App is locked</Text>
            <Text>Authentication is required to access the app</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalButtonPress}>
              <Text style={styles.closeButtonText}>Unlock now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.buttonView}>
        <Button title="click" onPress={showToastMessage} />
      </View>
    </View>
  );
};

export default BiometricDemo;

const styles = StyleSheet.create({
  View: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  imgStyle: {
    height: 200,
  },
  indicatorStyle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  txtStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
