/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Node } from 'react';
import { Image, Platform, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Button, PermissionsAndroid } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import { getHeaderTitle } from '@react-navigation/elements';
import SwitchSelector from 'react-native-switch-selector';
import { questionsGreatWave, questionsSunflowers } from "./Components/Quiz/QuestionsAndAnswers";
import { themes, getIndexByTheme, pointPerLevel } from './Components/Achievements/AchievementLists';

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
import moment from 'moment';
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
import { useRoute } from '@react-navigation/native';
import { node } from 'prop-types';
import { pathStrings, readFromFile, writeToFile, resetFiles } from './Globals/storageFunctions';
import { achievementsList as al, doneByTheme as dbt, quizAnswered as qa, givenAnswersArtifact as gaa } from './Globals/storageFunctions'
import { Divider } from 'react-native-paper';

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
        <MCIcon style={{ paddingVertical: 13, paddingHorizontal: 13, opacity:props.isQuizOpen?0.2:1 }} size={28} color={"#FFF"} name="menu" onPress={props.isQuizOpen? ()=>{} : () => { props.navigation.getParent("MenuDrawer").openDrawer(); }}></MCIcon>
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
          <Icon style={{ paddingVertical: 15, marginTop:20, paddingBottom:0 }} size={90} color="#777" name="user-tie"></Icon>
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
      {/*
      <View style={{ flexDirection: "row", alignItems: "center", alignItems: "center" }}>
        <DrawerItem label="Language" style={{ flex: 4, marginLeft: 0 }} labelStyle={{ color: styles.palette._1 }} icon={IconComponent('globe', 0)} />
        <View style={{ flex: 2 }}><CustomSwitchSelector opts={[
          { label: "ENG", value: 0, },
          { label: "ITA", value: 1 }
        ]} /></View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
        <DrawerItem label="Audio description" style={{ flex: 5, marginLeft: 0 }} labelStyle={{ color: styles.palette._1 }} icon={IconComponent('volume-up', 0)} />
        <Switch value='false' style={{ flex: 1 }}></Switch>
      </View>
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
        <DrawerItem label="Text size" style={{ flex: 4, marginLeft: 0 }} labelStyle={{ color: styles.palette._1 }} icon={IconComponent('text-height', 0)} />
        <View style={{ flex: 2 }}><CustomSwitchSelector opts={[
          { label: "SMALL", value: 0, },
          { label: "BIG", value: 1 }
        ]} /></View>
      </View>
       */}
      <DrawerItemList {...props} activeBackgroundColor={styles.palette._1} />
    </DrawerContentScrollView >
  );
};

// Right drawer
const RightDrawerNavigator = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  return (
    <RightDrawer.Navigator id="RightDrawer"
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right', headerShown: false,
        drawerInactiveTintColor: styles.palette._1, drawerInactiveBackgroundColor: "#fff",
        drawerActiveTintColor: styles.palette._1, drawerActiveBackgroundColor: "FFF",
        drawerItemStyle: { marginLeft: 0 },
        drawerStyle:{backgroundColor:styles.palette._5, width:200},
        swipeEnabled: isQuizOpen ? false : true
      }}>
      <RightDrawer.Screen name="MenuDrawer">
        {(props) => <LeftDrawerNavigator {...props} isQuizOpen={isQuizOpen} setIsQuizOpen={setIsQuizOpen} />}
      </RightDrawer.Screen>
    </RightDrawer.Navigator>
  );
};

/* Quiz and Home screens are hidden in the drawer, but still available */
const LeftDrawerNavigator = (props) => {
  const [takenQuiz, setTakenQuiz] = useState([]);
  const [doneByTheme, setDoneByTheme] = useState({});
  const [achievementsList, setAchievementsList] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState([]);
  const [newAchieved, setNewAchieved] = useState([]);
  const [reset, setReset] = useState(false);
  const [curArtifact, setCurArtifact] = useState("");
  const isQuizOpen = props.isQuizOpen, setIsQuizOpen = props.setIsQuizOpen;


  // USE THIS FOR KEEPING THE STATE
  useEffect(() => {

    readFromFile(pathStrings.path_givenAnswers).then((success) => { setTakenQuiz(success) }).catch(e => console.log(e));
    readFromFile(pathStrings.path_doneByTheme).then((success) => { setDoneByTheme(success) }).catch(e => console.log(e));
    readFromFile(pathStrings.path_achievementsList).then((success) => { setAchievementsList(success) }).catch(e => console.log(e));
    readFromFile(pathStrings.path_quizAnswered).then((success) => { setQuizAnswered(success) }).catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if(takenQuiz.length != 0)
    writeToFile(pathStrings.path_givenAnswers, takenQuiz);
  }, [takenQuiz]);

  useEffect(() => {
    if(achievementsList.length != 0)
    writeToFile(pathStrings.path_achievementsList, achievementsList);
  }, [achievementsList]);

  useEffect(() => {
    if(doneByTheme.length != 0)
    writeToFile(pathStrings.path_doneByTheme, doneByTheme);
  }, [doneByTheme]);

  useEffect(() => {
    if(quizAnswered.length != 0)
    writeToFile(pathStrings.path_quizAnswered, quizAnswered);
  }, [quizAnswered]);

  
  // USE THIS FOR RESET
  useEffect(() => {
    if(reset == true){
      resetFiles();
      setAchievementsList(al);
      setDoneByTheme(dbt);
      setQuizAnswered(qa);
      setTakenQuiz(gaa);
      setReset(false);
    }
    
  }, [reset]);

  const getDone = (theme) => {
    let index = getIndexByTheme(theme);
    return doneByTheme[index];
  }

  const getQuizDetails = (quiz) => {
    switch (quiz.artifact) {
      case "Sunflowers":
        return {
          index: 1,
          theme: getIndexByTheme(themes.vanGogh),
          questionSolutions: questionsSunflowers
        };
      case "The Great Wave":
        return {
          index: 2,
          theme: getIndexByTheme(themes.nineteenthCentury),
          questionSolutions: questionsGreatWave
        };
      default: return {};
    }
  }

  const updateQuizAnswered = (lastQuiz, quizDetails) => {
    let count = 0;
    let oldScore = 0;
    let updatedAnswers = [];
    let correctLocalAnswer = [];
    let quizAnsweredToUpdate = quizAnswered.find(q => q.quizID === quizDetails.index);

    if (quizAnsweredToUpdate && quizAnsweredToUpdate.bestScore === 3) {
      return {
        result: quizAnsweredToUpdate,
        oldScore: 3
      };
    }

    for (let i = 0; i < 3; i++) {
      correctLocalAnswer[i] = (lastQuiz.answers[i] === quizDetails.questionSolutions[i].solution ? 1 : 0);
      if(quizAnsweredToUpdate){
        oldScore += quizAnsweredToUpdate.correctAnswers[i];
        updatedAnswers[i] = quizAnsweredToUpdate.correctAnswers[i] | correctLocalAnswer[i];
      }
      else{
        updatedAnswers[i] = correctLocalAnswer[i]
      }
        
      count += updatedAnswers[i];
    }

    return {
      result: {
        quizID: quizDetails.index,
        correctAnswers: updatedAnswers,
        bestScore: count
      },
      oldScore: oldScore
    };
  }

  const updateAchievementList = (theme, scoreDelta) => {
    let newAchieved = [];
    let points = doneByTheme[theme];
    switch (theme) {
      case getIndexByTheme(themes.vanGogh):
        if ((points < pointPerLevel.enjoyer) && ((points + scoreDelta >= pointPerLevel.enjoyer))) {
          setAchievementsList(list => list.map(a => a.id === 1 ? Object.assign({}, a, { date_obtained: moment().format('MM/DD/YYYY') }) : a));
          newAchieved.push(achievementsList.find(a => a.id === 1));
        }
        if ((points < pointPerLevel.fan) && ((points + scoreDelta >= pointPerLevel.fan))) {
          setAchievementsList(list => list.map(a => a.id === 3 ? Object.assign({}, a, { date_obtained: moment().format('MM/DD/YYYY') }) : a));
          newAchieved.push(achievementsList.find(a => a.id === 3));
        }
        if ((points < pointPerLevel.expert) && ((points + scoreDelta >= pointPerLevel.expert))) {
          setAchievementsList(list => list.map(a => a.id === 6 ? Object.assign({}, a, { date_obtained: moment().format('MM/DD/YYYY') }) : a));
          newAchieved.push(achievementsList.find(a => a.id === 6));
        }
        break;
      case getIndexByTheme(themes.nineteenthCentury):
        if ((points < pointPerLevel.novice) && ((points + scoreDelta >= pointPerLevel.novice))) {
          setAchievementsList(list => list.map(a => a.id === 22 ? Object.assign({}, a, { date_obtained: moment().format('MM/DD/YYYY') }) : a));
          newAchieved.push(achievementsList.find(a => a.id === 22));
        }
        if ((points < pointPerLevel.expert) && ((points + scoreDelta >= pointPerLevel.expert))) {
          setAchievementsList(list => list.map(a => a.id === 23 ? Object.assign({}, a, { date_obtained: moment().format('MM/DD/YYYY') }) : a));
          newAchieved.push(achievementsList.find(a => a.id === 23));
        }
        break;
      default:
        break;
    }
    return newAchieved;
  }

  const updateState = (lastQuiz) => {
    let details = getQuizDetails(lastQuiz);
    let updatedQuizAnswered = updateQuizAnswered(lastQuiz, details);
    let scoreDelta = updatedQuizAnswered.result.bestScore - updatedQuizAnswered.oldScore;
    if (scoreDelta !== 0) {
      let res = updateAchievementList(details.theme, scoreDelta);
      setNewAchieved(res);
      setQuizAnswered([...quizAnswered, updatedQuizAnswered.result]);
      //setQuizAnswered(list => list.map((q) => (q.quizID === details.index ? updatedQuizAnswered.result : q)));
      setDoneByTheme(obj => {
        let updated = {};
        updated[details.theme] = obj[details.theme] + scoreDelta;
        return Object.assign({}, obj, updated);
      });
    }
  }
  return (
    <Drawer.Navigator  
      backBehavior="history"
      id="MenuDrawer" drawerContent={(props) => <LeftDrawerContent {...props} />} screenOptions={{
      drawerPosition: 'left',
      unmountOnBlur:false,
      header: ({ navigation, route, options }) => {
        const title = getHeaderTitle(options, route.name);
        return <CustomHeader navigation={navigation} title={title} style={options.headerStyle} isQuizOpen={isQuizOpen} />;
      },
      headerStyle: { backgroundColor: styles.palette._1 }, headerTintColor: '#fff', headerTitleAlign: "center",
      drawerInactiveTintColor: styles.palette._1, drawerInactiveBackgroundColor: styles.palette._5,
      drawerActiveTintColor: styles.palette._1, drawerActiveBackgroundColor: styles.palette._5,
      drawerStyle:{backgroundColor:styles.palette._5, width:200},
      drawerItemStyle: { marginLeft: 0},
      swipeEnabled: isQuizOpen ? false : true
    }}>
      <Drawer.Screen name="Home" options={{ drawerItemStyle: { display: "none" }, title: "IntARactive Museum" }}>
        {(props) => <HomePage {...props} setIsQuizOpen={setIsQuizOpen} setReset={setReset}/>}
      </Drawer.Screen>
      {
        // dalla pagina degli artifact si passa ai quiz prop artifact
        // uguale a "Sunflowers" o a "The Great Wave"
      }
      <Drawer.Screen name="Quiz" options={{ drawerItemStyle: { display: "none" }, title: "IntARactive Museum", swipeEnabled:false }} >
        {(props) => <Quiz {...props} isQuizOpen={isQuizOpen} setIsQuizOpen={setIsQuizOpen} takenQuiz={takenQuiz} setTakenQuiz={setTakenQuiz} updateState={updateState} artifact={curArtifact}
          newAchieved={newAchieved} setNewAchieved={setNewAchieved} />}
      </Drawer.Screen>
      <Drawer.Screen name="Achievements" options={{ drawerIcon: IconComponent('trophy', 0), drawerLabel: "Achievements", title: "IntARactive Museum", drawerItemStyle:{marginTop:20, marginLeft:5, paddingBottom:5, borderBottomColor:styles.palette._1, borderBottomWidth:0.5}}}>
        {(props) => <Achievements {...props} list={achievementsList} getDone={getDone} setReset={setReset} />}
      </Drawer.Screen>


      <Drawer.Screen name="QuizHistory" options={{drawerItemStyle:{marginLeft:5, marginTop:0, paddingBottom:5, borderBottomColor:styles.palette._1, borderBottomWidth:0.5}, drawerIcon: IconComponent('clipboard-list', 0), drawerLabel: "Quiz History", title: "IntARactive Museum" }} >
        {(props) => <QuizHistory {...props} takenQuiz={takenQuiz} />}
      </Drawer.Screen>
      <Drawer.Screen name="Tips" options={{drawerItemStyle:{marginLeft:5, marginTop:0, paddingBottom:5, borderBottomColor:styles.palette._1, borderBottomWidth:0.5},  drawerIcon: IconComponent('lightbulb-on-outline', 1), drawerLabel: "Tips", title: "IntARactive Museum" }} >
        {(props) => <Tips {...props} isFirstVisit={false} />}
      </Drawer.Screen>

      <Drawer.Screen name="ToHome" options={{drawerItemStyle:{marginLeft:5, marginTop:0},  drawerIcon: IconComponent('home', 0), drawerLabel: "Back to home", title: "IntARactive Museum" }} >
        {(props) => <HomePage {...props} setIsQuizOpen={setIsQuizOpen} />}
      </Drawer.Screen>

      <Drawer.Screen name="TipsFirst" options={{drawerItemStyle: { height: 0 }}} >
        {(props) => <Tips {...props} isFirstVisit={true} />}
      </Drawer.Screen>

      <Drawer.Screen name="ARObject" options={{drawerItemStyle: { height: 0 }}}>
        {(props) => <ARComponent {...props} setCurArtifact={setCurArtifact}/>}
      </Drawer.Screen>

    </Drawer.Navigator>)
};

/*************************************
**************************************/

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [place, setPlace] = useState(true);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <RightDrawerNavigator/>
      </NavigationContainer>
    </View >
  );
};

export default App;
