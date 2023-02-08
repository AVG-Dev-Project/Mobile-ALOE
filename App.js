import './ignoreWarning';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { Colors } from '_theme/Colors';

import Navigation from '_components/navigation/navigation';
import { Provider } from 'react-redux';
import { store } from '_utils/redux/store';
import './i18nextConf';

export default function App() {
   return (
      <Provider store={store}>
         <MenuProvider>
            <SafeAreaProvider>
               <StatusBar backgroundColor={'white'} />
               <Navigation />
            </SafeAreaProvider>
         </MenuProvider>
      </Provider>
   );
}
