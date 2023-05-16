// import 'react-native-gesture-handler';
import './ignoreWarning';
import './startup';
import 'expo-dev-client';
import './i18nextConf';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '_theme/Colors';
import Navigation from '_components/navigation/navigation';
import { Provider } from 'react-redux';
import { store } from '_utils/redux/store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
   return (
      <Provider store={store}>
         <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
               <BottomSheetModalProvider>
                  <StatusBar backgroundColor={Colors.greenAvg} />
                  <Navigation />
               </BottomSheetModalProvider>
            </GestureHandlerRootView>
         </SafeAreaProvider>
      </Provider>
   );
}
