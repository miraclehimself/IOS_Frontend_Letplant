export const returnArray = (item) => {
  if (typeof item === "string") {
    // Check if there are single quotes to replace
    if (item.includes("'")) {
      let parsedArray = JSON.parse(item.replace(/'/g, '"'));
      let joinedString = parsedArray.join(" | ");
      return joinedString;
    } else {
      return "";
    }
  } else {
    return "";
  }

  return "";
};
