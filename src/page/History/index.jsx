import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import calculateResponsiveFontSize from "../../utils/font";
import { HStack, Stack } from "native-base";
import { useGetPaymentHistoryQuery } from "../../redux/api";
import { format, parseISO } from "date-fns";
import { rs } from "react-native-full-responsive";

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { data, isLoading, isSuccess } = useGetPaymentHistoryQuery();
  const paymentHistory = isSuccess ? data?.data : [];
  const formatDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, "MMMM, dd, yyyy");
  };

  const renderItem = useMemo(
    () =>
      ({ item }) => {
        return (
          <HStack
            justifyContent="space-between"
            mb={calculateResponsiveFontSize(1)}
            alignItems="center"
          >
            <HStack space={calculateResponsiveFontSize(1)} alignItems="center">
              <Image
                source={require("../../images/hisory-logo.png")}
                alt="editor"
              />
              <Stack>
                <Text
                  style={[
                    styles.premium,
                    { fontSize: calculateResponsiveFontSize(8) },
                  ]}
                >
                  Premium
                </Text>
                <Text
                  style={[
                    styles.date,
                    { fontSize: calculateResponsiveFontSize(4) },
                  ]}
                >
                  Create on {formatDate(item?.created_at)}
                </Text>
              </Stack>
            </HStack>
            <Stack>
              <Text
                style={[
                  styles.date,
                  { fontSize: calculateResponsiveFontSize(4) },
                ]}
              >
                8.99 GBP
              </Text>
              <Text
                style={[
                  styles.monthly,
                  { fontSize: calculateResponsiveFontSize(3.5) },
                ]}
              >
                Monthly
              </Text>
            </Stack>
          </HStack>
        );
      },
    [],
  );

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: rs(16),
            color: "#000",
            fontWeight: "500",
          }}
        >
          No history find
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <HStack space={calculateResponsiveFontSize(4)}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../images/backArrow.png")}
              alt="editor"
            />
          </TouchableWithoutFeedback>
          <Text style={styles.mainText}>Payment History</Text>
        </HStack>
      </View>
      <FlatList
        data={paymentHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{
          paddingHorizontal: calculateResponsiveFontSize(2),
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  mainContainer: {
    padding: calculateResponsiveFontSize(10),
    gap: calculateResponsiveFontSize(5),
  },

  mainText: {
    fontSize: calculateResponsiveFontSize(8),
    fontWeight: "400",
    color: "#000",
  },
  premium: {
    color: "#1ABC76",
    fontWeight: "600",
  },
  date: {
    fontWeight: "500",
    color: "#000",
  },
  monthly: {
    fontWeight: "500",
    color: "#000",
  },
});

export default HistoryScreen;
