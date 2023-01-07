import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Text } from "@rneui/themed";
import { TouchableHighlight } from "react-native";
import styles from "../../Globals/Styles";
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import { questionsSunflowers, givenAnswersSunflowers, quizAnswered } from "./QuestionsAndAnswers";
import { updateDone } from '../Achievements/AchievementLists';

const Quiz = (props) => {
    const { navigation } = props;

    const [quizPage, setQuizPage] = useState("Home");
    const [quizNum, setQuizNum] = useState(1);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [overlay, setOverlay] = useState(0); //0 no overlay, 1 overlay home, 2 overlay X button

    const updateBest = () => {
        let correctLocalAnswer = [];
        for (let i = 0; i < 3; i++) {
            correctLocalAnswer[i] = (answers[i] == questionsSunflowers[i].solution ? 1 : 0);
        }
        if (quizAnswered[0] == null) {
            quizAnswered[0] = {
                quizID: 1,
                correctAnswers: correctLocalAnswer,
                bestScore: score.valueOf(),
            };
            updateDone(quizAnswered[0], 0);
        } else {
            let count = 0;
            let oldScore = quizAnswered[0].bestScore;
            for (let i = 0; i < 3; i++) {
                quizAnswered[0].correctAnswers[i] |= correctLocalAnswer[i];
                count += quizAnswered[0].correctAnswers[i];
            }
            if (count > quizAnswered[0].bestScore) {
                quizAnswered[0].bestScore = count;
                updateDone(quizAnswered[0], oldScore);
            }
        }
    };

    switch (quizPage) {
        case "Home":
            return <QuizHomePage setQuizNum={setQuizNum} navigation={navigation}
                setQuizPage={setQuizPage} setScore={setScore} setAnswers={setAnswers}
                setOverlay={setOverlay} />
        case "Question":
            return <QuizQuestion navigation={navigation} setQuizPage={setQuizPage}
                quizNum={quizNum} setScore={setScore} answers={answers} score={score}
                setAnswers={setAnswers} setQuizNum={setQuizNum}
                questionAndAnswers={questionsSunflowers[quizNum - 1]}
                setOverlay={setOverlay} overlay={overlay} />
        case "CorrectOrWrong":
            return <QuizCorrectOrWrong navigation={navigation} setQuizPage={setQuizPage}
                answers={answers} setScore={setScore} setAnswers={setAnswers}
                quizNum={quizNum} setQuizNum={setQuizNum} setNumTakenQuiz={props.setNumTakenQuiz}
                questionAndAnswers={questionsSunflowers[quizNum - 1]}
                setOverlay={setOverlay} overlay={overlay} />
        case "Results":
            return <QuizResults navigation={navigation} setQuizPage={setQuizPage}
                setAnswers={setAnswers} answers={answers}
                givenAnswers={givenAnswersSunflowers} setQuizNum={setQuizNum}
                score={score} setScore={setScore} updateBest={updateBest}
                setOverlay={setOverlay} />
        default:
            return "Should not happen"
    }
}

const QuizHomePage = (props) => {
    return <>
        <QuizSecondHeader setScore={props.setScore} setQuizNum={props.setQuizNum}
            setAnswers={props.setAnswers} navigation={props.navigation} xIcon={false}
            setQuizPage={props.setQuizPage} setOverlay={props.setOverlay} />

        <Image source={require('./../../res/default.jpg')} 
        style = {{height: 240, width: 180, alignSelf: "center", marginTop: 60}}/>

        <Text style={{ color: 'black', marginTop: 10, alignSelf: 'center', fontSize: 40 }}>
            Quiz
        </Text>
        <Text style={{ color: 'black', marginTop: 5, alignSelf: 'center', fontSize: 30 }}>
            Test your knowledge{"\n"} about "Sunflowers"
        </Text>
        <Text style={{ fontStyle: 'italic', color: 'black', marginTop: 5, marginHorizontal: 10, alignSelf: 'center', fontSize: 20 }}>
            There will be 3 questions in this quiz.{"\n"}
            Only one answer for each question is correct.
        </Text>

        <View style={{ ...styles.bottom }}>
            <TouchableHighlight style={{ ...styles.button, width: "90%", alignSelf: 'center' }} onPress={() => props.setQuizPage("Question")}>
                <Text style={{ color: 'white', alignSelf: 'center' }}>Start now</Text>
            </TouchableHighlight>
        </View>
    </>
}

const QuizQuestion = (props) => {
    let [answerSelected, setAnswerSelected] = useState(-1); // -1 means no answer selected yet
    let options = [];
    let disabled = answerSelected === -1;
    for (let i = 0; i <= 3; ++i) {
        options.push(
            <TouchableHighlight key={i} style={answerSelected === i ?
                { ...styles.quizSelected, width: "90%", alignSelf: 'center' } :
                { ...styles.button, height: 40, width: "90%", alignSelf: 'center' }}
                onPress={() => setAnswerSelected(i)}>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 15 }}>{props.questionAndAnswers.options[i]}</Text>
            </TouchableHighlight>
        )
    }

    <hr />

    return <View style={{ flex: 1 }}>
        <QuizSecondHeader setScore={props.setScore} setQuizNum={props.setQuizNum}
            setAnswers={props.setAnswers} navigation={props.navigation} xIcon={true}
            setQuizPage={props.setQuizPage} setOverlay={props.setOverlay} />

        <QuizBreadcrumb quizNum={props.quizNum} />

        <ConfirmExitOverlay setOverlay={props.setOverlay} setQuizNum={props.setQuizNum}
            setScore={props.setScore} setAnswers={props.setAnswers} navigation={props.navigation}
            setQuizPage={props.setQuizPage} overlay={props.overlay} />

        <Text style={{ color: 'black', paddingHorizontal: 20, marginTop: 90, marginBottom: 30, alignSelf: 'center', fontSize: 30 }}>
            {props.questionAndAnswers.question}
        </Text>

        {options}

        <View style={{ ...styles.bottom }}>
            <TouchableHighlight disabled={disabled} style={disabled ?
                { ...styles.buttonDisabled, width: "90%", alignSelf: 'center' } :
                { ...styles.button, width: "90%", alignSelf: 'center' }} onPress={() => {
                    if (answerSelected == props.questionAndAnswers.solution) {
                        props.setScore(x => x + 1);
                    }
                    props.setAnswers(answers => [...answers, answerSelected]);
                    setAnswerSelected(-1);
                    props.setQuizPage("CorrectOrWrong")
                }}>
                <Text style={{ color: 'white', alignSelf: 'center' }}>Confirm</Text>
            </TouchableHighlight>
        </View>
    </View>
}


const QuizCorrectOrWrong = (props) => {
    return <>
        <QuizSecondHeader setScore={props.setScore} setQuizNum={props.setQuizNum}
            setAnswers={props.setAnswers} navigation={props.navigation} xIcon={true}
            setQuizPage={props.setQuizPage} setOverlay={props.setOverlay} />

        <QuizBreadcrumb quizNum={props.quizNum} />

        <ConfirmExitOverlay setOverlay={props.setOverlay} setQuizNum={props.setQuizNum}
            setScore={props.setScore} setAnswers={props.setAnswers} navigation={props.navigation}
            setQuizPage={props.setQuizPage} overlay={props.overlay} />

        <QuizCorrectOrWrongBody answers={props.answers} quizNum={props.quizNum}
            questionAndAnswers={questionsSunflowers[props.quizNum - 1]} />

        <View style={{ ...styles.bottom }}>
            <TouchableHighlight style={{ ...styles.button, width: "90%", alignSelf: 'center' }} onPress={() => {
                if (props.quizNum < 3) {
                    props.setQuizNum(x => x + 1);
                    props.setQuizPage("Question");
                } else {
                    props.setNumTakenQuiz(x => x + 1);
                    props.setQuizNum(1);
                    props.setQuizPage("Results");
                }
            }}>
                <Text style={{ color: 'white', alignSelf: 'center' }}>{props.quizNum == 3 ?
                    "Submit and see results" :
                    "Next"
                }</Text>
            </TouchableHighlight>
        </View>
    </>
}


const QuizResults = (props) => {
    props.givenAnswers.push(
        {
            answers: props.answers,
            date: moment().calendar(),
            score: props.score
        }
    );

    props.updateBest();
    let resultCommentMessage = "";

    switch (props.score) {
        case 0:
            resultCommentMessage = "You can definitely do better...\n"
            break;
        case 1:
            resultCommentMessage = "There is room for improvement, but one point is always better than none!\n"
            break;
        case 2:
            resultCommentMessage = "This is a good result, but you can always challenge yourself to obtain an even higher score by attempting again this quiz!\n"
            break;
        case 3:
            resultCommentMessage = "Congratulations! You get them all!\n"
            break;
        default:
            resultCommentMessage = "This should not happen"
            break;
    }
    return <>
        <QuizSecondHeader setScore={props.setScore} setQuizNum={props.setQuizNum}
            setAnswers={props.setAnswers} navigation={props.navigation} xIcon={false}
            setQuizPage={props.setQuizPage} setOverlay={props.setOverlay} />

        <QuizBreadcrumb quizNum={-1} />

        <View style={{ ...styles.quizCards, marginTop: 95 }}>
            <Text style={{ color: 'black', alignSelf: 'center', fontSize: 40 }}>
                Quiz result
            </Text>
            <Text style={{ color: 'black', marginTop: 10, alignSelf: 'center', fontSize: 25 }}>
                You answered correctly at
            </Text>
            <Text style={{ color: 'black', alignSelf: 'center', fontSize: 35 }}>
                {props.score}/3
            </Text>
            <Text style={{ color: 'black', alignSelf: 'center', fontSize: 25 }}>
                proposed questions
            </Text>
        </View>

        <View style={{ ...styles.quizCards, marginTop: 10 }}>
            <Text style={{ color: 'black', marginHorizontal: 10, alignSelf: 'flex-start', fontSize: 20 }}>
                {resultCommentMessage}
            </Text>
            <Text style={{ color: 'black', marginHorizontal: 10, alignSelf: 'flex-start', fontSize: 20 }}>
                This quiz attempt has been saved into Quiz History.
            </Text>
        </View>

        <View style={{ ...styles.bottom }}>
            <TouchableHighlight style={{ ...styles.button, width: "90%", alignSelf: 'center' }} onPress={() => {
                props.setQuizPage("Home");
                props.setScore(0);
                props.setAnswers([]);
            }}>
                <Text style={{ color: 'white', alignSelf: 'center' }}>Back to quiz home page</Text>
            </TouchableHighlight>
        </View>
    </>
}

const QuizSecondHeader = (props) => {
    return <>
        <View style={{ ...styles.secondHeader }}>
            <TouchableHighlight style={{ ...styles.button, width: "20%", alignSelf: 'center' }} onPress={() => {
                if (props.xIcon) { //quizQuestion or quizCorrectOrWrong page
                    props.setOverlay(1);
                } else { //quizHome or quizResult page
                    props.setQuizNum(1);
                    props.setScore(0);
                    props.setAnswers([]);
                    props.navigation.navigate('Home');
                    props.setQuizPage("Home");
                }
            }}>
                <Text style={{ color: 'white', alignSelf: 'center' }}>Home</Text>
            </TouchableHighlight>
            <Text style={{ color: 'white', alignSelf: 'center', fontSize: 30 }}>
                Quiz - Sunflowers
            </Text>
            {props.xIcon ?
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20, padding: 10 }}
                    onPress={() => {
                        props.setOverlay(2);
                    }}>
                    x
                </Text> : <Text></Text>}
        </View>
    </>
}

const QuizBreadcrumb = (props) => {
    return <>
        <View style={{ ...styles.breadcrumb }}>
            <Text style={{ color: props.quizNum == 1 ? 'black' : 'gray', fontSize: 15, paddingRight: 15 }}>
                Question 1
            </Text>
            <Text style={{ color: 'gray', fontSize: 15, paddingRight: 15 }}>
                &gt;
            </Text>
            <Text style={{ color: props.quizNum == 2 ? 'black' : 'gray', fontSize: 15, paddingRight: 15 }}>
                Question 2
            </Text>
            <Text style={{ color: 'gray', fontSize: 15, paddingRight: 15 }}>
                &gt;
            </Text>
            <Text style={{ color: props.quizNum == 3 ? 'black' : 'gray', fontSize: 15, paddingRight: 15 }}>
                Question 3
            </Text>
            <Text style={{ color: 'gray', fontSize: 15, paddingRight: 15 }}>
                &gt;
            </Text>
            <Text style={{ color: props.quizNum == -1 ? 'black' : 'gray', fontSize: 15 }}>
                Results
            </Text>
        </View>
    </>
}

export const QuizCorrectOrWrongBody = (props) => {
    let correct;
    if (props.answers[props.quizNum - 1] == props.questionAndAnswers.solution) {
        correct = true;
    } else {
        correct = false;
    }

    return <>

        <View style={{ ...styles.quizCards, marginTop: 95 }}>
            <Text style={{ color: correct ? 'green' : 'red', alignSelf: 'center', fontSize: 40 }}>
                {correct ? "Correct!" : "Wrong!"}
            </Text>

            {correct ?
                <>
                    <Text style={{ color: 'black', marginLeft: 10, marginRight: 10, alignSelf: 'flex-start', fontSize: 25 }}>
                        Your answer:
                    </Text>
                    <Text style={{ color: 'green', fontStyle: 'italic', marginLeft: 50, marginRight: 10, alignSelf: 'flex-start', fontSize: 20 }}>
                        {props.questionAndAnswers.options[props.answers[props.quizNum - 1]]}
                    </Text>
                </>
                :
                <>
                    <Text style={{ color: 'black', marginLeft: 10, marginRight: 10, alignSelf: 'flex-start', fontSize: 25 }}>
                        Your answer:
                    </Text>
                    <Text style={{ color: 'red', fontStyle: 'italic', marginLeft: 50, marginRight: 10, alignSelf: 'flex-start', fontSize: 20 }}>
                        {props.questionAndAnswers.options[props.answers[props.quizNum - 1]]}
                    </Text>
                    <Text style={{ color: 'black', marginLeft: 10, marginRight: 10, alignSelf: 'flex-start', fontSize: 25 }}>
                        Correct answer:
                    </Text>
                    <Text style={{ color: 'green', fontStyle: 'italic', marginLeft: 50, marginRight: 10, alignSelf: 'flex-start', fontSize: 20 }}>
                        {props.questionAndAnswers.options[props.questionAndAnswers.solution]}
                    </Text>
                </>
            }
        </View>

        <View style={{ ...styles.quizCards, marginTop: 10 }}>
            <Text style={{ color: 'black', marginRight: 10, marginLeft: 10, alignSelf: 'flex-start', fontSize: 25 }}>
                {props.questionAndAnswers.question}
            </Text>
            <Text style={{ color: 'black', fontStyle: 'italic', marginRight: 10, marginLeft: 50, alignSelf: 'flex-start', fontSize: 20 }}>
                {props.questionAndAnswers.explanation}
            </Text>
        </View>
    </>
}

const ConfirmExitOverlay = (props) => {
    return <Overlay onBackdropPress={() => props.setOverlay(0)} isVisible={props.overlay != 0} overlayStyle={{ backgroundColor: "#EDE6DB", color: "#EDE6DB" }}>
        <Text style={{ color: "black", alignSelf: "center", fontSize: 20 }}>
            Your progress will be lost
        </Text>
        <Text style={{ color: "black", alignSelf: "center", fontSize: 20 }}>
            Are you sure you want to quit?
        </Text>

        <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TouchableHighlight style={{ ...styles.button, backgroundColor: "red", width: "25%" }}
                onPress={() => {
                    props.setQuizNum(1);
                    props.setScore(0);
                    props.setAnswers([]);
                    if (props.overlay == 1) {
                        props.navigation.navigate('Home');
                    }
                    props.setQuizPage("Home");
                    props.setOverlay(0);
                }}>
                <Text style={{ color: 'black', alignSelf: 'center', fontSize: 15 }}>
                    YES
                </Text>
            </TouchableHighlight>
            <TouchableHighlight style={{ ...styles.button, width: "25%" }}
                onPress={() => props.setOverlay(0)}>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 15 }}>
                    NO
                </Text>
            </TouchableHighlight>
        </View>
    </Overlay>
}

export default Quiz;