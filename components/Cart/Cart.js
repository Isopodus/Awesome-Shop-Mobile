import React, {Component} from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AppHeader from "../AppHeader/AppHeader";
import Styles from "../Styles/Styles";
import api from "../../api";
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from "../../dispatchers/AppDispatchers";
import SimpleToast from "react-native-simple-toast";
import CartItem from "./CartItem";
import * as SecureStore from "expo-secure-store";

const styles = StyleSheet.create({
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
    wrapperHeaderText: {
        color: "white",
        fontSize: 22,
        textAlign: "center",
        marginTop: 5
    },
    headerText: {
        color: "white",
        fontSize: 22,
        textAlign: "center",
        margin: 7
    },
    blackText: {
        color: "black",
        textAlign: "center",
        fontSize: 20,
        marginTop: "55%"
    },
    textInput: {
        backgroundColor: "white",
        color: "black",
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
        padding: 5,
        fontSize: 20,
        borderRadius: 10,
        width: 250
    },
    wrapper: {
        backgroundColor: "black",
        borderRadius: 20,
        width: 300,
        padding: 20,
        marginTop: "45%",
        alignSelf: 'center',
        alignItems: 'center'
    },
    bottomButtonsBlock: {
        height: 100,
        backgroundColor: "black",
        flexDirection: "column",
        justifyContent: "center"
    }
});

class Cart extends Component {

    constructor(props) {
        super(props);

        this.handleSave = this.handleSave.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleSave(confirmCallback) {
        if (this.props.cart.products.length > 0) {
            api.saveCart({order: this.props.cart})
                .then((response) => {
                    if (response.status === 200) {

                        // Change user on back
                        api.changeUser({
                            checked_order_id: response.data.order_id
                        }, {
                            'access-token': this.props.user.accessToken,
                            'uid': this.props.user.uid,
                            'client': this.props.user.client,
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    if (!confirmCallback) {
                                        SimpleToast.show("Cart saved successfully");
                                        this.props.reloadUser(this);
                                    } else {
                                        confirmCallback();
                                    }
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                SimpleToast.show("Unexpected error occurred");
                            });
                    } else {
                        SimpleToast.show("Unexpected error occurred");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    SimpleToast.show("Unexpected error occurred");
                });

        } else if (!confirmCallback) {
            SimpleToast.show("You cant save an empty cart!");
        } else if (confirmCallback) {
            SimpleToast.show("You cant confirm an empty order!");
        }
    }

    handleConfirm() {
        api.confirmOrder(this.props.cart.order_id)
            .then((response) => {
                if (response.status === 200) {
                    this.props.updateCart({
                        order_id: null,
                        user_id: this.props.user.id,
                        status: 0,
                        products: []
                    });

                    api.changeUser({
                        checked_order_id: null
                    }, {
                        'access-token': this.props.user.accessToken,
                        'uid': this.props.user.uid,
                        'client': this.props.user.client,
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                SimpleToast.show("Order confirmed successfully");
                                this.props.reloadUser(this);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            SimpleToast.show("Unexpected error occurred");
                            return false;
                        });
                } else {
                    SimpleToast.show("Unexpected error occurred");
                }
            })
            .catch((error) => {
                console.log(error);
                SimpleToast.show("Unexpected error occurred");
            });
    }

    render() {
        if (this.props.user) {
            let renderedItems = this.props.cart.products.map((item) => {
                return <CartItem item={item} key={item.product.id}/>
            });
            if (renderedItems.length === 0) {
                renderedItems = <Text style={styles.blackText}>Your cart is empty</Text>
            }
            let total = 0;
            this.props.cart.products.forEach((item) => {
                total += item.quantity * item.product.price;
            });
            return (
                <View style={{flex: 1}}>
                    <AppHeader navigation={this.props.navigation} header={this.props.user.checked_order_id ?
                        "Order #" + this.props.user.checked_order_id : "My cart"}/>
                    <View style={{flex: 1}}>
                        <ScrollView>
                            {renderedItems}
                        </ScrollView>
                        <View style={styles.bottomButtonsBlock}>
                            <Text style={styles.headerText}>Total: {total}$</Text>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "center"
                            }}>
                                <TouchableOpacity style={[Styles.button, {
                                    marginRight: 10
                                }]} onPress={() => this.handleSave(null)}>
                                    <Text style={[Styles.buttonText, {fontSize: 20}]}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[Styles.button, {
                                    marginLeft: 10
                                }]} onPress={() => this.handleSave(this.handleConfirm)}>
                                    <Text style={[Styles.buttonText, {fontSize: 20}]}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <AppHeader navigation={this.props.navigation}/>
                    <View style={styles.wrapper}>
                        <Text style={styles.wrapperHeaderText}>You need to be logged in to view your cart</Text>
                        <TouchableOpacity style={[Styles.button, {
                            marginTop: 15
                        }]} onPress={() => this.props.navigation.navigate('Account')}>
                            <Text style={Styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);