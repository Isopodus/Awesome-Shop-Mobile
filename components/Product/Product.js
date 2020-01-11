import React, {Component} from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
    Image, TouchableOpacity
} from 'react-native';
import Styles from "../Styles/Styles";
import api from "../../api";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../dispatchers/AppDispatchers";

const styles = StyleSheet.create({
    product: {
        backgroundColor: "black",
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        width: 300,
        margin: 10,
        padding: 20,
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        marginTop: 5
    },
    descriptionText: {
        color: "#b2b2b2",
        textAlign: "center",
        fontSize: 18,
    }
});

class Product extends Component {

    constructor(props) {
        super(props);

        this.addToCart = this.addToCart.bind(this);
    }

    addToCart() {
        let newItem = {
            quantity: 1,
            product: {
                id: this.props.productData.id,
                name: this.props.productData.name,
                description: this.props.productData.description,
                price: this.props.productData.price
            }
        };
        let newCart = {};
        Object.assign(newCart, this.props.cart);
        let oldItem = newCart.products.find(currItem => currItem.product.id === newItem.product.id);
        if (oldItem) {
            newCart.products[newCart.products.findIndex(obj => obj === oldItem)].quantity += newItem.quantity;
        } else {
            newCart.products.push(newItem);
        }

        this.props.updateCart(newCart);
    }

    render() {
        return (
            <View style={styles.product}>
                <Image
                    style={{width: 250, height: 250, borderRadius: 10}}
                    source={{uri: 'http://' + api.domain + this.props.productData.image_url}}
                />
                <Text style={styles.text}>{this.props.productData.name}</Text>
                <Text style={styles.text}>{this.props.productData.price}$</Text>
                <Text style={styles.descriptionText}>{this.props.productData.description}</Text>
                {this.props.user && (
                    <TouchableOpacity style={[Styles.button, {
                        marginTop: 15
                    }]} onPress={this.addToCart}>
                        <Text style={[Styles.buttonText, {fontSize: 20}]}>Add to cart</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);