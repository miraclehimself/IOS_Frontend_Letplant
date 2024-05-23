import React from "react";
import { Modal, Button, HStack, useTheme, Spinner } from "native-base";
import calculateResponsiveFontSize from "../../utils/font";
import { Text } from "react-native";

function LogoutAccount({ modalVisible, setModalVisible, handleSubmit }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const { colors } = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;

  return (
    <>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Are you sure want to logout?</Modal.Header>

          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                bg={bgColor}
                _hover={{
                  backgroundColor: bgColor,
                }}
                px="2"
                py={3}
                onPress={handleSubmit}
              >
                <Text
                  style={[
                    {
                      fontSize: calculateResponsiveFontSize(5),
                      color: "#fff",
                      fontWeight: "500",
                    },
                  ]}
                >
                  Log Out
                </Text>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default LogoutAccount;
