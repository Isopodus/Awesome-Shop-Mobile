import React, {Component} from 'react';
import {
    StyleSheet,
    Text, TextInput,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from "../../dispatchers/AppDispatchers";
import {Icon} from "react-native-elements";
import Modal, {ModalButton, ModalFooter, ModalTitle} from 'react-native-modals';

const styles = StyleSheet.create({
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
    textInput: {
        backgroundColor: "white",
        color: "black",
        textAlign: "center",
        margin: 10,
        padding: 5,
        fontSize: 20,
        borderRadius: 10,
        width: 35
    },
    cartItem: {
        backgroundColor: "black",
        borderRadius: 20,
        width: 340,
        padding: 20,
        margin: 7,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-around"
    },
    modalButtonText: {
        color: "black"
    }
});

class CartItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
        this.handleModal = this.handleModal.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
    }

    handleModal() {
        this.setState({
            modalVisible: true
        });
    }

    removeItem() {
        let tempCart = this.props.cart;
        tempCart.products = tempCart.products.filter(item => item.product.id !== this.props.item.product.id);
        this.props.updateCart(tempCart);
        this.setState({modalVisible: false});
    }

    handleQuantityChange(value) {
        let tempCart = this.props.cart;
        let itemIndex = tempCart.products.findIndex(item => item.product.id === this.props.item.product.id);
        let quantity = Number(value);
        if (quantity < 1) {
            quantity = 1;
        }
        if (itemIndex >= 0) {
            tempCart.products[itemIndex].quantity = quantity;
        }
        this.props.updateCart(tempCart);
        this.forceUpdate()
    }

    render() {
        return (
            <View style={styles.cartItem}>
                <Text style={styles.text}>{this.props.item.product.name}</Text>
                <TextInput style={styles.textInput}
                           keyboardType={'numeric'}
                           defaultValue={String(this.props.item.quantity)}
                           onChangeText={this.handleQuantityChange}/>
                <Text style={styles.text}>{this.props.item.product.price * this.props.item.quantity}$</Text>
                <Icon
                    onPress={this.handleModal}
                    style={styles.icon}
                    size={35}
                    name='close'
                    type='Feather'
                    color='white'/>
                <Modal
                    visible={this.state.modalVisible}
                    onTouchOutside={() => {
                        this.setState({modalVisible: false});
                    }}
                    modalTitle={<ModalTitle title="Are you sure?"/>}
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="No"
                                onPress={() => {
                                    this.setState({modalVisible: false});
                                }}
                                textStyle={styles.modalButtonText}
                            />
                            <ModalButton
                                text="Yes"
                                onPress={this.removeItem}
                                textStyle={styles.modalButtonText}
                            />
                        </ModalFooter>
                    }
                    children={null}/>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);