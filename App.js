import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Main from "./components/Main/Main";
import DrawerContent from "./components/DrawerContent/DrawerContent";
import * as SecureStore from 'expo-secure-store';
import Account from "./components/Account/Account";
import api from "./api";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";
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
        Orders: {
            screen: (props) => <Orders {...props}/>
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
        this.props.reloadUser(this);
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