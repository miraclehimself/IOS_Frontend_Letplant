import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useRecommendImageMutation } from "../../redux/api";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Button, Image, Spinner, useTheme } from "native-base";
import calculateResponsiveFontSize from "../../utils/font";
import { rs } from "react-native-full-responsive";

const Quiz = () => {
  const questions = [
    {
      question: "How often do you water your plant?",
      options: ["Daily", "Every 2-3 days", "Weekly", "Monthly", "I don't know"],
    },
    {
      question: "What type of soil do you use for your plant?",
      options: ["Potting mix", "Compost", "Sand", "Clay", "I don't know"],
    },
    {
      question: "How much sunlight does your plant receive?",
      options: [
        "Full sun",
        "Partial sun",
        "Shade",
        "Artificial light",
        "I don't know",
      ],
    },
    {
      question: "What are the main symptoms of your plant problem?",
      options: [
        "Yellow or brown leaves",
        "Droopy or wilted stems",
        "Spots or holes on leaves",
        "Pests or insects on plant",
        "Other or none of the above",
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [recommendImage, { isLoading }] = useRecommendImageMutation();
  const navigation = useNavigation();
  const data = useSelector((state) => state.auth.item);
  const { colors } = useTheme();
  const bgColor = colors.brand.bg;
  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = "Skipped";
    setAnswers(newAnswers);
    setCurrentQuestion(currentQuestion + 1);
  };

  const AnalysedImage = async () => {
    const formData = new FormData();
    const w = answers[0] ? answers[0] : "";
    const s = answers[1] ? answers[1] : "";
    const s_t = answers[2] ? answers[2] : "";
    const sptm = answers[3] ? answers[3] : "";
    formData.append("user", data?.user_id);
    formData.append("id", data?.id);
    formData.append("latitude", data?.latitude);
    formData.append("longitude", data?.longitude);
    formData.append("water_frequency", w);
    formData.append("sun_frequency", s);
    formData.append("soil_type", s_t);
    formData.append("symptoms", sptm);
    try {
      const data = await recommendImage(formData).unwrap();
      // Handle the response data accordingly (e.g., redirect to the home stack)
      // console.log(data)
      if (data?.status === "success") {
        Toast.show({
          type: "success",
          text1: "",
          text2: data?.message ?? "",
        });
        navigation.navigate("Plant");
      }
    } catch (error) {
      console.log(error);
      if (error) {
        Toast.show({
          type: "error",
          text1: "",
          text2: error?.error ?? "",
        });
      }
    }
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image source={require("../../images/XCircle.png")} alt="cancel" />
      </TouchableWithoutFeedback>
      <View style={styles.progressContainer}>
        <Text
          style={styles.progressText}
        >{`${currentQuestion + 1}/${questions.length}`}</Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>
          {questions[currentQuestion].question}
        </Text>
        {questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswer(option)}
            style={[
              styles.optionContainer,
              answers[currentQuestion] === option && styles.selectedOption,
            ]}
          >
            <View
              style={[
                styles.optionBox,
                answers[currentQuestion] === option && {
                  backgroundColor: "#1ABC76",
                },
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[
            styles.button,
            { backgroundColor: "#1ABC76" },
            currentQuestion === 0 && styles.disabledButton,
          ]}
          disabled={currentQuestion === 0}
        >
          <Text style={{ color: "white" }}>Previous</Text>
        </TouchableOpacity>
        {
          currentQuestion === questions.length - 1  ?null :     <TouchableOpacity
          onPress={handleSkip}
          style={[styles.button, { backgroundColor: "#1ABC76" }]}
        >
          <Text style={{ color: "white" }}>Skip</Text>
        </TouchableOpacity>
        }
    
        {currentQuestion === questions.length - 1 ? null : (
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.button,
              { backgroundColor: "#1ABC76" },
              currentQuestion === questions.length - 1 && styles.disabledButton,
            ]}
            disabled={currentQuestion === questions.length - 1}
          >
            <Text style={{ color: "white" }}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {currentQuestion === questions.length - 1 && (
        <Button
          mt="5"
          bg={bgColor}
          _pressed={{
            backgroundColor: bgColor,
          }}
          _hover={{
            backgroundColor: bgColor,
          }}
          px="2"
          py={3}
          w="100%"
          onPress={AnalysedImage}
        >
          <Text
            style={[
              {
                fontSize: calculateResponsiveFontSize(7),
                color: "#fff",
                fontWeight: "500",
              },
            ]}
          >
            {isLoading ? <Spinner color="#fff" /> : "Growth Recommendation"}
          </Text>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: rs(40),
    paddingHorizontal: rs(20),
  },
  progressContainer: {
    marginBottom: rs(20),
    alignSelf: "flex-end",
  },
  progressText: {
    fontSize: rs(16),
    color: "#000",
    fontWeight: "400",
  },
  questionContainer: {
    marginBottom: rs(20),
  },
  question: {
    fontSize: rs(19),
    marginBottom: rs(10),
    color: "#000",
    fontWeight: "500",
  },
  optionContainer: {
    marginBottom: rs(10),
  },
  optionBox: {
    borderWidth: rs(1),
    borderColor: "#999",
    borderRadius: rs(5),
    padding: rs(10),
    backgroundColor: "white",
  },
  optionText: {
    fontSize: rs(16),
    color: "#000",
    fontWeight: "400",
  },
  selectedOption: {
    backgroundColor: "#1ABC76",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: rs(20),
  },
  button: {
    padding: rs(10),
    backgroundColor: "#1ABC76",
    borderRadius: rs(5),
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default Quiz;
