import React from "react";
import { Modal, Button, HStack, useTheme, Spinner } from "native-base";
import calculateResponsiveFontSize from "../../utils/font";
import { Text } from "react-native";

function DeleteAccount({
  modalVisible,
  setModalVisible,
  isLoadingDelete,
  handleSubmit,
}) {
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
          <Modal.Header>Are you sure want to delete this account?</Modal.Header>

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
                {isLoadingDelete ? (
                  <Spinner accessibilityLabel="Loading posts" color="#fff" />
                ) : (
                  <Text
                    style={[
                      {
                        fontSize: calculateResponsiveFontSize(5),
                        color: "#fff",
                        fontWeight: "500",
                      },
                    ]}
                  >
                    Delete
                  </Text>
                )}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default DeleteAccount;
