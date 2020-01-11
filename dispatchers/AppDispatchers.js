import * as SecureStore from "expo-secure-store";
import api from "../api";

export function mapStateToProps(state) {
    return {
        user: state.user,
        cart: state.cart
    }
}

export function mapDispatchToProps(dispatch) {
    return {
        updateUser: (newUser) => dispatch({type: 'UPDATE_USER', state: newUser}),
        updateCart: (newCart) => dispatch({type: 'UPDATE_CART', state: newCart}),
        reloadUser: (that) => {
            SecureStore.getItemAsync('email').then(email => {
                SecureStore.getItemAsync('password').then(password => {
                    api.signIn({
                        email: email,
                        password: password
                    })
                        .then(response => {
                            if (response.status === 200) {
                                api.getUserData(response.data.data.id)
                                    .then(response2 => {
                                        if (response2.status === 200) {

                                            // Save user to props
                                            that.props.updateUser({
                                                accessToken: response.headers['access-token'],
                                                client: response.headers['client'],
                                                uid: response.data.data.uid,
                                                ...response2.data
                                            });

                                            // Save users order to props
                                            let order = response2.data.orders.find(order => order.order_id === response2.data.checked_order_id);
                                            if (order) {
                                                that.props.updateCart(order);
                                            }
                                            order = {};
                                            Object.assign(order, that.props.cart);
                                            order.user_id = that.props.user.id;
                                            that.props.updateCart(order);
                                        }
                                    });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            });
        }
    }
}