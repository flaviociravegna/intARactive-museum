import React from 'react';
import { View } from 'react-native';
import { Text } from "@rneui/themed";
import { TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {styles} from "./Styles";
import { TouchableOpacity } from 'react-native-gesture-handler';

/********************** PROPS ********************** 
- titleName: title of the header
- isMenuHidden: if the menu bar is hidden, it has different css styles
- navigation: component for navigation between pages
- onCloseOrHelp: function to call when user clicks on "x" or "?" icon
- isClose: represents the icon on the right.
    - true -> it shows an home icon
    - false -> it shows a "?" icon
    - undefined: no right icons (a hidden one to maintain alignment)
- isHome: represents the icon on the left.
    - true -> it shows an home icon
    - false -> it shows a "<-" icon
    - undefined: no left icons (a hidden one to maintain alignment)
- onHomeOrBack: function to call when click on "home" or "back" icon.
    If undefined, it is (as default) "navigation.navigate('Home')" or "navigation.goBack()"
***************************************************/

function ActivityBar(props) {
    return (
        <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: props.isMenuHidden ? 0 : 5, height: props.isMenuHidden ? "auto" : 45,
            backgroundColor: props.isMenuHidden ? "#417D7A" : "#417D7AAA" /* The last two hex digits are the alpha channel of the color */
        }}>

            {props.isHome === true && !props.isClose ?
                <TouchableOpacity>
                    <IonIcon name='arrow-back' size={props.isMenuHidden ? 28 : 25} style={{ color: "#FFF", marginLeft: 13, paddingVertical: props.isMenuHidden ? 13 : 0 }} onPress={() => props.navigation.goBack()}></IonIcon>
                </TouchableOpacity>
                :
                props.isHome === false ? 
                <TouchableOpacity>
                    <IonIcon name='arrow-back' size={props.isMenuHidden ? 28 : 25} style={{ color: "#FFF", marginLeft: 13, paddingVertical: props.isMenuHidden ? 13 : 0  }} onPress={props.onHomeOrBack !== undefined ? props.onHomeOrBack : () => props.navigation.goBack()}></IonIcon>
                </TouchableOpacity>
                    : 
                <TouchableOpacity> 
                    <IonIcon name='arrow-back' size={props.isMenuHidden ? 28 : 25} style={{ opacity: 0, marginLeft: 13, paddingVertical: props.isMenuHidden ? 13 : 0  }}></IonIcon>
                </TouchableOpacity>}
            <Text style={{ alignSelf: 'center', fontSize: 23, color: "#FFF", opacity: 1 }}>{props.titleName}</Text>
            {props.isClose !== undefined && props.onCloseOrHelp !== undefined ?
                <TouchableOpacity>
                    <MCIcon name="close-circle" onPress={()=>props.onCloseOrHelp()} size={props.isMenuHidden ? 28 : 25} style={{color: "#FFF", opacity: 1, marginRight: 13, paddingVertical: props.isMenuHidden ? 13 : 0  }}></MCIcon>
                </TouchableOpacity>
                :
                <TouchableOpacity>
                    <Icon name="question-circle" onPress={()=>props.onHelp()} size={props.isMenuHidden ? 28 : 25} style={{color: "#FFF", opacity: 1, marginRight: 13, paddingVertical: props.isMenuHidden ? 13 : 0  }}></Icon>
                </TouchableOpacity>
                }
        </View>
    );
}

export { ActivityBar }