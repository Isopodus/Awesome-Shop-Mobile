import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar, View,
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {connect} from "react-redux";
import {mapStateToProps} from '../../dispatchers/AppDispatchers';

const styles = StyleSheet.create({
    header: {
        justifyContent: "center",
        textAlign: "center",
    },
    icon: {
        backgroundColor: "white",
    },
    text: {
        fontSize: 20,
        color: "white",
        marginTop: 15
    },
    iconWrapper: {
        marginTop: 15
    },
});

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.handleDrawer = this.handleDrawer.bind(this);
        this.handleCart = this.handleCart.bind(this);
    }

    handleDrawer() {
        this.props.navigation.openDrawer();
    }

    handleCart() {
        this.props.navigation.navigate('Cart');
    }

    render() {
        return (
            <View>
                <StatusBar backgroundColor="rgba(0,0,0,0.8)"/>
                <Header
                    style={styles.header}
                    containerStyle={{
                        backgroundColor: 'black',
                        paddingBottom: 25
                    }}
                    statusBarProps={{
                        translucent: true
                    }}
                >
                    <View style={styles.iconWrapper}>
                        <Icon
                            onPress={this.handleDrawer}
                            style={styles.icon}
                            size={35}
                            name='menu'
                            type='Feather'
                            color='white'/>
                    </View>
                    <Text style={styles.text}>{this.props.header ? this.props.header : "Awesome shop"}</Text>
                    <View style={styles.iconWrapper}>
                        <Icon
                            onPress={this.handleCart}
                            style={styles.icon}
                            size={35}
                            name='shopping-basket'
                            type='MaterialIcons'
                            color='white'/>
                    </View>
                </Header>
            </View>
        )
    }
}

export default connect(mapStateToProps)(AppHeader);