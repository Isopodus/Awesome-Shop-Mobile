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

const styles = StyleSheet.create({
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
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
    scrollBlock: {},
    bottomButtonsBlock: {
        height: 80,
        backgroundColor: "black",
        flexDirection: "column",
        justifyContent: "center"
    }
});

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            cart: this.props.cart
        };
        this.handleSave = this.handleSave.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount() {
        this.setState({cart: this.props.cart});
    }

    handleRefresh() {
        this.forceUpdate();
    }

    handleSave() {

    }

    render() {
        const renderedItems = this.state.cart.products.map((item) => {
            return <CartItem item={item} key={item.product.id}/>
        });
        return (
            <View style={{flex: 1}}>
                <AppHeader navigation={this.props.navigation}/>
                <View style={{flex: 1}}>
                    <ScrollView style={styles.scrollBlock} refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh}/>
                    }>
                        {renderedItems}
                    </ScrollView>
                    <View style={styles.bottomButtonsBlock}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center"
                        }}>
                            <TouchableOpacity style={[Styles.button, {
                                marginRight: 10
                            }]} onPress={this.handleSave}>
                                <Text style={[Styles.buttonText, {fontSize: 20}]}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[Styles.button, {
                                marginLeft: 10
                            }]} onPress={this.handleSave}>
                                <Text style={[Styles.buttonText, {fontSize: 20}]}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);