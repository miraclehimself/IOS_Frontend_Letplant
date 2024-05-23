import { PixelRatio } from "react-native";

const calculateResponsiveFontSize = (fontSize) => {
  const scaleFactor = PixelRatio.get();
  const scaledFontSize = Math.round(fontSize * scaleFactor);
  return scaledFontSize;
};

export default calculateResponsiveFontSize;
