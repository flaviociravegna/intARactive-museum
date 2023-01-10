/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Node } from 'react';
import { Image, Platform, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Button, PermissionsAndroid } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import SwitchSelector from 'react-native-switch-selector';
import { givenAnswersSunflowers } from "./Components/Quiz/QuestionsAndAnswers";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Switch
} from 'react-native';
import styles from './Globals/Styles'


import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Header as HeaderRNE, HeaderProps } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ARComponent from './Components/AR/ARComponent';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import HomePage from './Components/HomePage/HomePage';
import Tips from './Components/Tips/Tips';
import Quiz from './Components/Quiz/Quiz';
import QuizHistory from './Components/QuizHistory/QuizHistory';
import Achievements from './Components/Achievements/Achievements';
import { node } from 'prop-types';
import { achievementsList } from './Components/Achievements/AchievementLists';

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const RightDrawer = createDrawerNavigator();

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: "Cool Photo App Camera Permission",
      message:
        "Cool Photo App needs access to your camera " +
        "so you can take awesome pictures.",
      buttonNeutral: "Ask Me Later",
      buttonNegative: "Cancel",
      buttonPositive: "OK"
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) { console.log("You can use the camera"); }
    else { console.log("Camera permission denied"); }
  } catch (err) { console.warn(err); }
};

/*************************************
********** DRAWER NAVIGATOR **********
**************************************/

const IconComponent = (name, useMCIcons) => {
  return ({ color, size }) => useMCIcons ?
    <View style={{ width: 30, height: 25, marginRight: -10 }}><MCIcon color={styles.palette._1} size={size} name={name} style={{ marginLeft: 1, alignSelf: 'center' }}></MCIcon></View> :
    <View style={{ width: 30, height: 25, marginRight: -10 }}><Icon color={styles.palette._1} size={size} name={name} style={{ marginLeft: 1, alignSelf: 'center' }} /></View>;
};

const CustomSwitchSelector = (props) => {
  return (<SwitchSelector
    hasPadding={true}
    height={20}
    initial={0}
    fontSize={8}
    textColor={styles.palette._1}
    selectedColor={"#fff"}
    buttonColor={styles.palette._1}
    borderColor={styles.palette._1}
    disabled
    style={{ width: 75, marginLeft: 10 }}
    options={props.opts}
  />);
};

const UserInfoText = () => {
  return (
    <View>
      <Text style={{ ...styles.sectionTitle, color: styles.palette._1, textAlign: "center", marginTop: 30 }}> Mario Rossi </Text>
      <Text style={{ fontWeight: "400", fontSize: 13, color: "#555", textAlign: "center", marginTop: 10, marginBottom: 5 }}> mario.rossi@domain.com </Text>
      <Text style={{ fontWeight: "400", fontSize: 13, color: "#555", textAlign: "center" }}> +39 123 4567890 </Text>
    </View>
  );
};

const CustomHeader = (props) => {
  return (
    <View style={{ ...props.style, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <TouchableOpacity>
        <MCIcon style={{ paddingVertical: 13, paddingHorizontal: 13 }} size={28} color="#FFF" name="menu" onPress={() => { props.navigation.getParent("MenuDrawer").openDrawer(); }}></MCIcon>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, color: "#FFF" }}> int<Text style={{ fontWeight: "900", color: styles.palette._0 }}>AR</Text>active museum </Text>
      <TouchableOpacity>
        <Icon style={{ paddingVertical: 13, paddingHorizontal: 13 }} size={25} color="#FFF" name="user-circle" onPress={() => { props.navigation.getParent("RightDrawer").openDrawer() }}></Icon>
      </TouchableOpacity>
    </View>
  );
};

const RightDrawerContent = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always", horizontal: "never" }}>
      <DrawerContentScrollView>
        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
          <Icon style={{ paddingVertical: 15 }} size={90} color="#777" name="user-tie"></Icon>
        </View>
        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
          <UserInfoText />
        </View>
      </DrawerContentScrollView >
      <View>
        <DrawerItem label="Logout" labelStyle={{ color: styles.palette._1, textAlign: "center", marginRight: -32 }} />
      </View>
    </SafeAreaView>

  );
};

// Left drawer
const LeftDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flexDirection: "row", alignItems: "center", alignItems: "center" }}>
        <DrawerItem label="Language" style={{ flex: 4, marginLeft: 0 }} labelStyle={{ color: styles.palette._1 }} icon={IconComponent('globe', 0) /* also "language" icon */} />
        <View style={{ flex: 2 }}><CustomSwitchSelector opts={[
          { label: "ENG", value: 0, },
          { label: "ITA", value: 1 }
        ]} /></View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
        <DrawerItem label="Audio description" style={{ flex: 5, marginLeft: 0 }} labelStyle={{ color: styles.palette._1 }} icon={IconComponent('volume-up', 0) /* also "audio-description" icon */} />
        <Switch value='false' style={{ flex: 1 }}></Switch>
      </View>
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
        <DrawerItem label="Text size" style={{ flex: 4, marginLeft: 0 }} labelStyle={{ color: styles.palette._1 }} icon={IconComponent('text-height', 0)} />
        <View style={{ flex: 2 }}><CustomSwitchSelector opts={[
          { label: "SMALL", value: 0, },
          { label: "BIG", value: 1 }
        ]} /></View>
      </View>
      <DrawerItemList {...props} activeBackgroundColor={styles.palette._1} />
    </DrawerContentScrollView >
  );
};

// Right drawer
const RightDrawerNavigator = () => {
  return (
    <RightDrawer.Navigator id="RightDrawer"
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right', headerShown: false,
        drawerInactiveTintColor: styles.palette._1, drawerInactiveBackgroundColor: "#fff",
        drawerActiveTintColor: styles.palette._1, drawerActiveBackgroundColor: "FFF",
        drawerItemStyle: { marginLeft: 0 }
      }}>
      <RightDrawer.Screen name="MenuDrawer" component={LeftDrawerNavigator} />
      
    </RightDrawer.Navigator>
  );
};

/* Quiz and Home screens are hidden in the drawer, but still available */
const LeftDrawerNavigator = () => {
  const [numTakenQuiz, setNumTakenQuiz] = useState(0);
  return (
    <Drawer.Navigator  id="MenuDrawer" drawerContent={(props) => <LeftDrawerContent {...props} />} screenOptions={{
      drawerPosition: 'left',
      unmountOnBlur:true,
      header: ({ navigation, route, options }) => {
        const title = getHeaderTitle(options, route.name);
        return <CustomHeader navigation={navigation} title={title} style={options.headerStyle} />;
      },
      headerStyle: { backgroundColor: styles.palette._1 }, headerTintColor: '#fff', headerTitleAlign: "center",
      drawerInactiveTintColor: styles.palette._1, drawerInactiveBackgroundColor: "#fff",
      drawerActiveTintColor: styles.palette._1, drawerActiveBackgroundColor: "FFF",
      drawerItemStyle: { marginLeft: 0 }
    }}>
      <Drawer.Screen name="Home" component={HomePage} options={{ drawerItemStyle: { display: "none" }, title: "IntARactive Museum" }} />
      {
        // dalla pagina degli artifact si passa ai quiz prop artifact
        // uguale a "Sunflowers" o a "The Great Wave"
      }
      <Drawer.Screen name="Quiz" options={{ drawerItemStyle: { display: "none" }, title: "IntARactive Museum" }} >
        {(props) => <Quiz {...props} setNumTakenQuiz={setNumTakenQuiz} artifact={"The Great Wave"} />}
      </Drawer.Screen>
      <Drawer.Screen name="Achievements" options={{ drawerIcon: IconComponent('trophy', 0), drawerLabel: "Achievements", title: "IntARactive Museum" }}>
        {(props) => <Achievements {...props} list={achievementsList} />}
      </Drawer.Screen>
      <Drawer.Screen name="QuizHistory" options={{ drawerIcon: IconComponent('clipboard-list', 0), drawerLabel: "Quiz History", title: "IntARactive Museum" }} >
        {(props) => <QuizHistory {...props} numTakenQuiz={numTakenQuiz} />}
      </Drawer.Screen>
      <Drawer.Screen name="Tips" options={{ drawerIcon: IconComponent('lightbulb-on-outline', 1), drawerLabel: "Tips", title: "IntARactive Museum" }} >
        {(props) => <Tips {...props} isFirstVisit={false} />}
      </Drawer.Screen>
      <Stack.Screen name="ARObject" component={ARComponent} options={{drawerItemStyle: { height: 0 }}}/>

    </Drawer.Navigator>)
};

/*************************************
**************************************/

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [place, setPlace] = useState(true);
  const [numTakenQuiz, setNumTakenQuiz] = useState(0);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator>
        
        <Drawer.Screen name="RightDrawer" component={RightDrawerNavigator} options={{ headerShown: false }}/>
        
        </Drawer.Navigator>
      </NavigationContainer>
    </View >
  );
};

export default App;
