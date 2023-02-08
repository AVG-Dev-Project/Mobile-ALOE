import { useRef, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Colors } from '_theme/Colors';
import Lottie from 'lottie-react-native';
import { Icon } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import {
   getStarted,
   getAllArticles,
   getAllThematiques,
   getAllTypes,
} from '_utils/redux/actions/action_creators';
import { ArticleService } from '_utils';

export default function Welcome({ navigation }) {
   //all datas
   const langueActual = useSelector(
      (selector) => selector.fonctionnality.langue
   );
   const animation = useRef(null);
   const dispatch = useDispatch();

   //all fetch || functions
   const getArticles = async () => {
      let results = await ArticleService.getArticlesFromServ();
      dispatch(getAllArticles(results));
   };

   const getThematiques = async () => {
      let results = await ArticleService.getThematiqueFromServ();
      dispatch(getAllThematiques(results));
   };

   const getTypes = async () => {
      let results = await ArticleService.getTypeFromServ();
      dispatch(getAllTypes(results));
   };

   //all effects
   useEffect(() => {
      getArticles();
      getThematiques();
      getTypes();
   }, []);

   return (
      <View style={styles.view_container_welcome}>
         <Lottie
            autoPlay
            ref={animation}
            style={styles.images_welcome}
            source={require('_images/read.json')}
         />
         <View>
            <Text
               style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center' }}
            >
               {langueActual === 'fr'
                  ? 'Bienvenue sur loIT'
                  : "Tongasoa eto amin'ny loIT"}
            </Text>
            <Text style={{ textAlign: 'center', marginVertical: 10 }}>
               C'est une application mobile où vous trouvez tous les lois ici à
               Madagascar que vous pouvez consulter à tout moment. Avec ou sans
               internet, vous pouvez la consulter avec toute tranquilité. Alors
               vous êtes prêts ? On y va alors ....
            </Text>
         </View>
         <View style={styles.view_button_start}>
            <TouchableOpacity
               style={styles.boutton_start}
               activeOpacity={0.8}
               onPress={() => {
                  dispatch(getStarted());
               }}
            >
               <Icon name={'arrow-forward'} color={Colors.white} size={34} />
            </TouchableOpacity>
         </View>
      </View>
   );
}
