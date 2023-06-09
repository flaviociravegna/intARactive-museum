import React, { useEffect, useState } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { Text, Icon } from "@rneui/themed";
import { Button, Divider, Overlay } from 'react-native-elements';
import { ActivityBar } from '../../Globals/Components'
import { achievementsList, getDone, getNeeded, levels } from './AchievementLists';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import LV1 from '../../res/lv1';
import LV2 from '../../res/lv2';
import LV3 from '../../res/lv3';
import LV4 from '../../res/lv4';
import styles from '../../Globals/Styles';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

const Achievements = (props) => {
    const [helpOverlay, setHelpOverlay] = useState(false);
    return <>
        <ActivityBar titleName="Achievements" navigation={props.navigation} isHome={true} onHelp={()=>setHelpOverlay(true)} />
        <View style={{ alignItems: 'center', paddingTop: 20, flex: 1, flexGrow: 1, backgroundColor:styles.palette._5 }}>
            <Icon2 name='user-tie' color="#777" size={150} onPress={()=>props.setReset}/>
        </View>
        <View style={{ backgroundColor:styles.palette._5, flex: 2 }}>
            <IconsList list={props.list} getDone={props.getDone} setReset={props.setReset}/>
            
        </View>
        <Overlay isVisible={helpOverlay} onBackdropPress={()=>setHelpOverlay(false)} overlayStyle={{borderColor:styles.palette._3, borderWidth:3,  backgroundColor: styles.palette._4, color: styles.palette._4, borderRadius: 15, width: '65%', height: '20%' }}>
            <View>
                <Icon name='close' type='material' onPress={()=>setHelpOverlay(false)} style={{ color: 'black', marginLeft: 'auto' }}></Icon>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, margin: 5, alignSelf: "center", alignContent: 'center', position: 'absolute' }}>HELP</Text>
                <Divider color="black" style={{marginTop:10, width:"70%", alignSelf:'center'}}/>
                <Text style={{ textAlign: "center", fontSize: 14, margin: 10 }}>{"Click on the achievement icons to see more details about the achievements"}</Text>
            </View>
        </Overlay>
    </>
}

const achievementsColors = {
    fill_active: 'black',
    stroke_active: 'black',
    fill_inactive: 'lightgrey',
    stroke_inactive: 'lightgrey'
}

const CustomIcon = (props) => {
    switch (props.level) {
        case levels.enjoyer:
            return <LV1 {...props} fill={props.active ? achievementsColors.fill_active : achievementsColors.fill_inactive}
                stroke={props.active ? achievementsColors.stroke_active : achievementsColors.stroke_inactive} />;
        case levels.novice:
            return <LV2 {...props} fill={props.active ? achievementsColors.fill_active : achievementsColors.fill_inactive}
                stroke={props.active ? achievementsColors.stroke_active : achievementsColors.stroke_inactive} />;
        case levels.fan:
            return <LV3 {...props} fill={props.active ? achievementsColors.fill_active : achievementsColors.fill_inactive}
                stroke={props.active ? achievementsColors.stroke_active : achievementsColors.stroke_inactive} />;
        case levels.expert:
            return <LV4 {...props} fill={props.active ? achievementsColors.fill_active : achievementsColors.fill_inactive}
                stroke={props.active ? achievementsColors.stroke_active : achievementsColors.stroke_inactive} />;
        default:
            return <Icon name='trophy' type='font-awesome' size={50}
                color={props.active ? achievementsColors.fill_active : achievementsColors.fill_inactive}{...props} />;
    }
}

function IconsList(props) {
    const scrollViewRef = React.useRef(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (!isFocused) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }
    }, [isFocused]);
    return <ScrollView ref={scrollViewRef}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: "wrap" }}>
            {props.list.map((achievement) => <AchievementIcon key={achievement.id} title={achievement.title} theme={achievement.theme}
                done={props.getDone(achievement.theme)} needed={getNeeded(achievement)} date_obtained={achievement.date_obtained}
                level={achievement.level} />)}
        </View>
        <TouchableHighlight onPress={() => props.setReset(true)} style={{opacity:0.3}}>
                <Text></Text>
            </TouchableHighlight>
    </ScrollView>;
}

function AchievementIcon(props) {
    const [visible, setVisible] = useState(false);
    const toggleOverlay = () => {
        setVisible(visible => !visible);
    };
    return <View margin={5} flexDirection='column' alignItems='center' flexWrap='wrap'>
        <CustomIcon level={props.level} onPress={toggleOverlay} active={props.needed <= props.done} />
        <Text style={{ width: 75, color: 'black', alignSelf: 'center', margin: 5, textAlign: 'center', fontSize: 12 }}>{props.title}</Text>
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{borderColor:styles.palette._3, borderWidth:3, backgroundColor: styles.palette._0, color: styles.palette._0, borderRadius: 15, width: '65%', height: '20%' }}>
            <View>
                <Icon name='close' type='material' onPress={toggleOverlay} style={{ color: 'black', marginLeft: 'auto' }}></Icon>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, margin: 5, alignSelf: "center", alignContent: 'center', position: 'absolute' }}>{props.title}</Text>
                <Divider color="black" style={{marginTop:10, width:"70%", alignSelf:'center'}}/>
                <Text style={{ textAlign: "center", fontSize: 15, margin: 10 }}>{"Answer correctly to\n" + props.needed + " quiz about " + props.theme}</Text>
                <Text style={{ textAlign: "center", fontSize: 12, color: "#666666" }}>{props.needed <= props.done ? "Obtained " + props.date_obtained :
                    "Not obtained - " + (props.needed - props.done) + " remaining"}</Text>
            </View>
        </Overlay>
    </View>;
}

export default Achievements;

{/* , flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'space-between', flexWrap: 'nowrap', position: 'absolute' */ }
{/*, position: 'absolute' */ }