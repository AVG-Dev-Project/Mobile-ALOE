import Axios from 'axios';

const uRI = 'https://avg.e-commerce-mg.com/api';

const RouteAxios = Axios.create({
   baseURL: uRI,
});

export { RouteAxios, uRI };
