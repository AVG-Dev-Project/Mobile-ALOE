import Axios from 'axios';

const uRI = 'https://aloe.iteam-s.mg/api';

const RouteAxios = Axios.create({
   baseURL: uRI,
});

export { RouteAxios, uRI };
