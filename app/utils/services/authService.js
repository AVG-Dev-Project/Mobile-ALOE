// import { RouteAxios } from '_utils/services/urlAxios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// function login(numero_telephone, mot_de_passe) {
//    return RouteAxios.post('/user/login', {
//       numero_telephone,
//       mot_de_passe,
//    })
//       .then((response) => {
//          if (response.data.token) {
//             AsyncStorage.setItem('compte', JSON.stringify(response.data));
//          }
//          return response.data;
//       })
//       .catch((error) => {
//          return error.message;
//       });
// }

// function logout() {
//    return AsyncStorage.removeItem('compte');
// }

// function register(
//    nom,
//    prenom,
//    facebook,
//    adresse,
//    numero_telephone,
//    mot_de_passe
// ) {
//    return RouteAxios.post('/user/register', {
//       nom,
//       prenom,
//       facebook,
//       adresse,
//       numero_telephone,
//       mot_de_passe,
//    });
// }

// export const AuthService = {
//    login,
//    logout,
//    register,
// };
