import axios from 'axios';

const domain ="192.168.1.8:3000";

export default {
    domain: domain,
    forgotPasswordUrl: () => 'http://' + domain + '/users/password/new',
    signUpUrl: () => 'http://' + domain + '/users/sign_up',
    signIn: data => axios.post('http://' + domain + '/api/auth/sign_in', data),
    logout: headers => axios.delete('http://' + domain + '/api/auth/sign_out', {headers: headers}),
    getUserData: userId => axios.get('http://' + domain + '/users/' + userId),
    getProducts: () => axios.get('http://' + domain + '/api/products'),
    changeUser: (data, headers) => axios.put('http://' + domain + '/api/auth', data, {headers: headers}),
    saveCart: (data) => axios.post('http://' + domain + '/api/orders/', data),
    confirmOrder: (order_id) => axios.get('http://' + domain + '/api/orders/confirm_order/' + order_id)
}