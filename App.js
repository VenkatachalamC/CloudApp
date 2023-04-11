
import { SafeAreaView, StyleSheet, Text, View ,Button, TouchableOpacity} from 'react-native';
import LoginScreen from './screens/Login';
import SignUp from './screens/signup';
import ListData from './screens/listdata';
import Upload from './screens/upload';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewFile from './screens/viewscreen';
export default function App() {
  const stack=createNativeStackNavigator()
  return (
    <NavigationContainer>
    <SafeAreaView style={{flex:1}}>
    <View style={{flex:1}}>
      <stack.Navigator>
      <stack.Screen name="sign-in" component={LoginScreen}/>
      <stack.Screen name="sign-up" component={SignUp}/>
      <stack.Screen name="list-doc" component={ListData}/>
      <stack.Screen name="upload" component={Upload}/>
      <stack.Screen name="viewscreen" component={ViewFile}/>
    </stack.Navigator>
    </View>
    </SafeAreaView>
    </NavigationContainer>
  );
}

