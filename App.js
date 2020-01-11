import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Main from "./components/Main/Main";
import DrawerContent from "./components/DrawerContent/DrawerContent";
import * as SecureStore from 'expo-secure-store';
import Account from "./components/Account/Account";
import api from "./api";
import Cart from "./components/Cart/Cart";
import {Provider, connect} from 'react-redux';
import {createStore} from 'redux';
import AppReducer from './reducers/AppReducer';
import {mapStateToProps, mapDispatchToProps} from './dispatchers/AppDispatchers';

const DrawerStack = createDrawerNavigator({
        Main: {
            screen: (props) => <Main {...props} />
        },
        Cart: {
            screen: (props) => <Cart {...props}/>
        },
        Account: {
            screen: (props) => <Account {...props}/>
        }
    },
    {
        contentComponent: (props) => <DrawerContent {...props}/>,
        contentOptions: {
            activeTintColor: '#e91e63',
            itemsContainerStyle: {
                marginVertical: 0,
            },
            iconContainerStyle: {
                opacity: 1
            },
            labelStyle: {
                fontSize: 17
            }
        }
    });

const store = createStore(AppReducer);

const AppContainer = createAppContainer(DrawerStack);

class App extends React.Component {

    componentDidMount() {
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
                                        this.props.updateUser({
                                            accessToken: response.headers['access-token'],
                                            client: response.headers['client'],
                                            uid: response.data.data.uid,
                                            ...response2.data
                                        });

                                        // Save users order to props
                                        let order = response2.data.orders.find(order => order.order_id === response2.data.checked_order_id);
                                        if (order) {
                                            this.props.updateCart(order);
                                        }
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

    render() {
        return (
            <Provider store={store}>
                <AppContainer/>
            </Provider>
        );
    }
}

const Connected = connect(mapStateToProps, mapDispatchToProps)(App);
export default (props) =>
    <Provider store={store}>
        <Connected {...props}/>
    </Provider>