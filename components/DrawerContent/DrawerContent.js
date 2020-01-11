import React from "react";
import SafeAreaView, {SafeAreaProvider} from 'react-native-safe-area-view';
import {DrawerItems} from 'react-navigation-drawer';
import {
    StyleSheet,
    ScrollView, Text, View
} from 'react-native';
import {connect} from "react-redux";
import {mapStateToProps} from '../../dispatchers/AppDispatchers';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: "black",
        height: 80,
    },
    text: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginTop: 25
    }
});

class DrawerContent extends React.Component {
    render() {
        return (
            <ScrollView>
                <SafeAreaProvider>
                    <SafeAreaView
                        style={styles.container}
                        forceInset={{top: 'always', horizontal: 'never'}}
                    >
                        <View style={styles.drawerHeader}>
                            {this.props.user ? (
                                <Text style={styles.text}>{this.props.user.username}</Text>
                            ) : (
                                <Text style={styles.text}>Guest</Text>
                            )}
                        </View>
                        <DrawerItems {...this.props}/>
                    </SafeAreaView>
                </SafeAreaProvider>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(DrawerContent);