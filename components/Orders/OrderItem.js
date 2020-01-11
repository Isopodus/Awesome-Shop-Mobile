import React, {Component} from 'react';
import {
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {mapDispatchToProps, mapStateToProps} from "../../dispatchers/AppDispatchers";
import Moment from 'moment';
import Modal, {ModalButton, ModalFooter, ModalTitle} from 'react-native-modals';
import Styles from "../Styles/Styles";
import {ModalContent} from "react-native-modals/src";

const styles = StyleSheet.create({
    text: {
        color: "white",
        textAlign: "left",
        fontSize: 18,
    },
    blackText: {
        color: "black",
        textAlign: "left",
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
        alignItems: 'flex-start',
        // flexDirection: "row",
        //justifyContent: "space-around"
    },
    modalButtonText: {
        color: "black"
    }
});

class OrderItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };
        this.handleModal = this.handleModal.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
        this.setActive = this.setActive.bind(this);
        this.confirmOrder = this.confirmOrder.bind(this);
    }

    handleModal() {
        this.setState({
            modalVisible: true
        });
    }

    deleteOrder() {
        let tempCart = {};
        Object.assign(tempCart, this.props.cart);
        tempCart.products = tempCart.products.filter(item => item.product.id !== this.props.item.product.id);
        this.props.updateCart(tempCart);
    }

    setActive() {
        // let tempCart = {};
        // Object.assign(tempCart, this.props.cart);
        // let itemIndex = tempCart.products.findIndex(item => item.product.id === this.props.item.product.id);
        // let quantity = Number(value);
        // if (quantity < 1) {
        //     quantity = 1;
        // }
        // if (itemIndex >= 0) {
        //     tempCart.products[itemIndex].quantity = quantity;
        // }
        // this.props.updateCart(tempCart);
    }

    confirmOrder() {

    }

    render() {
        let total = 0;
        this.props.order.products.forEach((item) => {
            total += item.quantity * item.product.price;
        });
        let status;
        if (this.props.order.status === 0) {
            status = 'Incomplete';
        } else if (this.props.order.status === 1) {
            status = 'Processing';
        } else if (this.props.order.status === 2) {
            status = 'Complete';
        }
        Moment.locale('en');

        let modalButtons = [];
        if (this.props.order.status === 0) {
            modalButtons.push(<ModalButton
                text="Set active"
                onPress={() => {
                    this.setState({modalVisible: false});
                }}
                textStyle={styles.modalButtonText}
                key={1}
            />);
            modalButtons.push(<ModalButton
                text="Delete"
                onPress={() => {
                    this.setState({modalVisible: false}, () => {
                        function sleep(time) {
                            return new Promise((resolve) => setTimeout(resolve, time));
                        }

                        sleep(100).then(this.removeItem);
                    });
                }}
                textStyle={styles.modalButtonText}
                key={2}
            />);
        }
        modalButtons.push(<ModalButton
            text="Close"
            onPress={() => {
                this.setState({modalVisible: false});
            }}
            textStyle={styles.modalButtonText}
            key={3}
        />);

        let orderItems = this.props.order.products.map((item) => {
            return (
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around"
                }} key={item.product.id}>
                    <Text style={styles.blackText}>{item.product.name}</Text>
                    <Text style={styles.blackText}>{item.quantity}x</Text>
                    <Text style={styles.blackText}>{item.product.price * item.quantity}$</Text>
                </View>
            )
        });

        return (
            <View style={styles.cartItem}>
                <TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <View style={{
                            flexDirection: "column",
                            marginRight: 20
                        }}>
                            <Text style={styles.text}>ID: {this.props.order.order_id}</Text>
                            <Text style={styles.text}>Items count: {this.props.order.products.length}</Text>
                        </View>
                        <View style={{
                            flexDirection: "column",
                            marginLeft: 20
                        }}>
                            <Text style={styles.text}>Status: {status}</Text>
                            <Text style={styles.text}>Total: {total}$</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Modal
                    visible={this.state.modalVisible}
                    width={0.9}
                    onTouchOutside={() => {
                        this.setState({modalVisible: false});
                    }}
                    modalTitle={<ModalTitle title={"Order #" + this.props.order.order_id}/>}
                    footer={<ModalFooter style={{
                        flexDirection: "row",
                        height: 50
                    }}>
                        {modalButtons}
                    </ModalFooter>}>
                    <ModalContent>
                        {orderItems}
                    </ModalContent>
                </Modal>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);