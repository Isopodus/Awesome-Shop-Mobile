import React, {Component} from 'react';
import {
    Button, ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppHeader from "../AppHeader/AppHeader";
import Product from "../Product/Product";
import api from '../../api';
import {connect} from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from '../../dispatchers/AppDispatchers';

const styles = StyleSheet.create({
    main: {
        flex: 1
    }
});

class Main extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        api.getProducts()
            .then(response => {
                if (response.status === 200 && this._isMounted) {
                    this.setState({
                        products: response.data
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const renderedProducts = this.state.products.map((product) => {
            return <Product productData={product} key={product.id}/>
        });

        return (
            <View style={{flex: 1}}>
                <AppHeader navigation={this.props.navigation}/>
                <View style={styles.main}>
                    <ScrollView style={{flex: 1}}>
                        {renderedProducts}
                    </ScrollView>
                </View>
            </View>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);