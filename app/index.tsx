import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import StackNavigator from "./StackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#246EE9" />
      <StackNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

