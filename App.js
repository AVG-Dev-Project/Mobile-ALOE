import 'react-native-gesture-handler';
import './startup';
import './i18nextConf';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '_theme/Colors';

import Navigation from '_components/navigation/navigation';
import { Provider } from 'react-redux';
import { store } from '_utils/redux/store';

export default function App() {
   return (
      <Provider store={store}>
         <SafeAreaProvider>
            <StatusBar backgroundColor={Colors.greenAvg} />
            <Navigation />
         </SafeAreaProvider>
      </Provider>
   );
}
