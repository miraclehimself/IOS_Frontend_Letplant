import { StyleSheet } from "react-native";
import { rs } from "react-native-full-responsive";

export default StyleSheet.create({
  progressContainer: {
    width: rs(200),
    height: rs(10),
    borderWidth: rs(2),
    borderColor: "#1ABC76",
    borderRadius: rs(5),
    overflow: "hidden",
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1ABC76",
    borderRadius: rs(5),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
