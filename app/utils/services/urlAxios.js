import Axios from 'axios';
import { Platform } from 'react-native';

// const url = 'http://10.0.2.2:3000/api/v1';
//https://fakoy.e-commerce-mg.com/api/article
//const uRI = 'https://fakoy.e-commerce-mg.com/api';
const uRI = 'https://avg.e-commerce-mg.com/api';

const RouteAxios = Axios.create({
   baseURL: uRI,
});

export { RouteAxios, uRI };
