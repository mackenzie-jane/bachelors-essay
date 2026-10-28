import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ImageScreen from "./screens/ImageScreen";
import AudioScreen from "./screens/AudioScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Image" component={ImageScreen} />
        <Stack.Screen name="Audio" component={AudioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
