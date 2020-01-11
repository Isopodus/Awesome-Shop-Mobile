import React, {Component} from 'react';
import {
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
//import SimpleToast from "react-native-simple-toast";
import * as SecureStore from 'expo-secure-store';
import AppHeader from "../AppHeader/AppHeader";
import Login from "../Login/Login";
import Styles from "../Styles/Styles";
import api from "../../api";
import {connect} from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from '../../dispatchers/AppDispatchers';

const styles = StyleSheet.create({
    account: {
        height: "100%",
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    wrapper: {
        backgroundColor: "black",
        borderRadius: 20,
        width: 300,
        padding: 20,
        alignSelf: 'center',
        alignItems: 'center'
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
    textInput: {
        backgroundColor: "white",
        color: "black",
        margin: 5,
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
        textAlign: "center",
        marginTop: 10
    },
});

class Account extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: this.props.user ? this.props.user.username : null,
            password: "",
            newPassword: "",
            newPasswordConfirmation: "",
            notice: null
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleLogout() {
        // Delete user from storage and state
        if (this.props.user) {
            //console.log(this.props.user);
            api.logout({
                uid: this.props.user.uid,
                client: this.props.user.client,
                'access-token': this.props.user.accessToken
            })
                .then(response => {
                    if (response.status === 200) {
                        //SimpleToast.show("Signed out successfully", SimpleToast.LONG);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            SecureStore.deleteItemAsync('email').then();
            SecureStore.deleteItemAsync('password').then();
            this.props.updateUser(null);
        }
    }

    handleSave() {
        // Change password and username
        let payload = {};

        // Add new username to payload
        if (this.state.username !== "" && this.state.username !== this.props.user.username) {
            payload = {
                username: this.state.username
            }
        } else if (this.state.username === "") {
            this.setState({
                notice: "Username can't be blank"
            });
            return;
        }

        // Add password to payload
        if (this.state.newPassword === this.state.newPasswordConfirmation && this.state.newPassword !== "") {
            payload = {
                ...payload,
                current_password: this.state.password,
                password: this.state.newPassword,
                password_confirmation: this.state.newPasswordConfirmation
            };
        } else if (this.state.newPassword !== this.state.newPasswordConfirmation) {
            this.setState({
                notice: "Passwords are not equal"
            });
            return;
        }

        api.changeUser(payload, {
            'access-token': this.props.user.accessToken,
            'uid': this.props.user.uid,
            'client': this.props.user.client,
        })
            .then(response => {
                if (response.status === 200) {
                    if (payload.hasOwnProperty("current_password")) {
                        SecureStore.setItemAsync('password', this.state.newPassword).then();
                    }
                    this.setState({
                        password: "",
                        newPassword: "",
                        newPasswordConfirmation: "",
                        notice: "Changes applied"
                    });
                    if (response.headers['access-token']) {
                        this.props.updateUser({
                            ...this.props.user,
                            username: this.state.username,
                            accessToken: response.headers['access-token']
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error.response.data);
                if (error.response.headers['access-token']) {
                    this.props.updateUser({
                        ...this.props.user,
                        accessToken: error.response.headers['access-token']
                    })
                }
            })
    }

    render() {
        return (
            <View>
                <AppHeader navigation={this.props.navigation} user={this.props.user}/>
                <View>
                    {this.props.user ? (
                        <View style={styles.account}>
                            <View style={styles.wrapper}>
                                <Text style={styles.wrapperHeaderText}>Account</Text>
                                <Text
                                    style={[styles.text, {marginBottom: 10}]}>Email: {this.props.user.email}</Text>
                                <Text style={styles.text}>Change username</Text>
                                <TextInput style={styles.textInput}
                                           placeholder="New username"
                                           placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                           autoCapitalize="none"
                                           defaultValue={this.props.user.username}
                                           value={this.state.username}
                                           onChangeText={(value) => this.setState({username: value})}/>
                                <Text style={styles.text}>Change password</Text>
                                <TextInput style={styles.textInput}
                                           placeholder="Old password"
                                           placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                           autoCapitalize="none"
                                           value={this.state.password}
                                           secureTextEntry={true}
                                           onChangeText={(value) => this.setState({password: value})}/>
                                <TextInput style={styles.textInput}
                                           placeholder="New password"
                                           placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                           autoCapitalize="none"
                                           value={this.state.newPassword}
                                           secureTextEntry={true}
                                           onChangeText={(value) => this.setState({newPassword: value})}/>
                                <TextInput style={styles.textInput}
                                           placeholder="Repeat new password"
                                           placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                           autoCapitalize="none"
                                           value={this.state.newPasswordConfirmation}
                                           secureTextEntry={true}
                                           onChangeText={(value) => this.setState({newPasswordConfirmation: value})}/>
                                <Text style={styles.text}>{this.state.notice}</Text>
                                <TouchableOpacity style={[Styles.button, {
                                    marginTop: 5
                                }]} onPress={this.handleSave}>
                                    <Text style={Styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[Styles.button, {
                                    marginTop: 15
                                }]} onPress={this.handleLogout}>
                                    <Text style={Styles.buttonText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Login navigation={this.props.navigation}/>
                    )}
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);