import React, {Component} from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import SimpleToast from "react-native-simple-toast";
import Styles from "../Styles/Styles";
import api from '../../api'
import * as SecureStore from 'expo-secure-store';
import {Linking} from "expo";
import {connect} from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from '../../dispatchers/AppDispatchers';

const styles = StyleSheet.create({
    login: {
        height: "100%",
        paddingTop: 50,
        paddingLeft: 40,
        paddingRight: 40
    },
    wrapper: {
        backgroundColor: "black",
        borderRadius: 20,
        height: 330,
        alignItems: 'center'
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
    },
    textInput: {
        backgroundColor: "white",
        color: "black",
        margin: 15,
        marginLeft: 20,
        marginRight: 20,
        padding: 5,
        fontSize: 20,
        borderRadius: 10,
        width: 250
    },
    wrapperHeaderText: {
        color: "white",
        fontSize: 30,
        textAlign: "center"
    },
    linkText: {
        textDecorationLine: "underline",
        fontSize: 16,
        color: "white"
    }
});

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            notice: null
        };
        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordForgot = this.handlePasswordForgot.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    passwordChange(value) {
        this.setState({
            password: value
        })
    }

    emailChange(value) {
        this.setState({
            email: value
        })
    }

    handleSubmit() {
        api.signIn({
            email: this.state.email,
            password: this.state.password
        })
            .then(response => {
                if (response.status === 200) {
                    SecureStore.setItemAsync('email', this.state.email).then();
                    SecureStore.setItemAsync('password', this.state.password).then();
                    api.getUserData(response.data.data.id)
                        .then(response2 => {
                            if (response2.status === 200) {

                                // Save user to props
                                this.props.updateUser({
                                    accessToken: response.headers['access-token'],
                                    uid: response.data.data.uid,
                                    client: response.headers['client'],
                                    ...response2.data
                                });

                                // Save users order to props
                                let order = response2.data.orders.find(order => order.order_id === response2.data.checked_order_id);
                                if (order) {
                                    this.props.updateCart(order);
                                }

                                SimpleToast.show("Signed in successfully", SimpleToast.LONG);
                                this.props.navigation.navigate('Main');
                            }
                        });
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    this.setState({
                        notice: "Invalid credentials"
                    });
                } else {
                    this.setState({
                        notice: "Unexpected error occurred"
                    });
                }
            });
    }

    handlePasswordForgot() {
        Linking.canOpenURL(api.forgotPasswordUrl()).then(supported => {
            if (supported) {
                Linking.openURL(api.forgotPasswordUrl());
            }
        });
    }

    handleSignUp() {
        Linking.canOpenURL(api.signUpUrl()).then(supported => {
            if (supported) {
                Linking.openURL(api.signUpUrl());
            }
        });
    }

    render() {
        return (
            <View style={styles.login}>
                <View style={styles.wrapper}>
                    <Text style={styles.wrapperHeaderText}>Login</Text>
                    <TextInput style={styles.textInput}
                               placeholder="Email"
                               placeholderTextColor="rgba(0, 0, 0, 0.4)"
                               autoCapitalize="none"
                               onChangeText={this.emailChange}/>
                    <TextInput style={styles.textInput}
                               placeholder="Password"
                               placeholderTextColor="rgba(0, 0, 0, 0.4)"
                               secureTextEntry={true}
                               onChangeText={this.passwordChange}/>
                    <Text style={styles.text}>{this.state.notice}</Text>
                    <TouchableOpacity onPress={this.handlePasswordForgot}>
                        <Text style={styles.linkText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleSignUp}>
                        <Text style={styles.linkText}>Sign up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Styles.button, {
                        marginTop: 15
                    }]} onPress={this.handleSubmit}>
                        <Text style={Styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);