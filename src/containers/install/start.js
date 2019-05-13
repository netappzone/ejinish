import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import { SettingData } from '@settings';
import FastImage from 'react-native-fast-image';
import { DashboardApp } from './DashboardApp';

var { height, width } = Dimensions.get('window');
var _ = require('lodash');

export default class StartAppScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
    }
    componentWillMount() {
        SettingData.getData().then(response => {
            DashboardApp(response);
        })
    }

    render() {
        return this.renderLoadingView()
    }

    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <FastImage style={{
                    position: 'absolute', left: 0,
                    top: 0, width, height
                }}
                    source={require('@images/splash.png')} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        position: 'absolute',
        width: width,
        height: height,
        zIndex: 9,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "center"
    },
});
