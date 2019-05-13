import React, {Component } from 'react';
import {
    View,
    WebView,
    StyleSheet
} from 'react-native';
import { domainPublic } from '@settings';
import { ShopifyService } from '@services';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.linkUrl =  `${domainPublic}/account/login?view=gikApp`;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this.state = {
            linkUrl: this.linkUrl,
            submitted: false
        }

    }

    onNavigatorEvent(event) {
        if (event.id == 'closeModal') {
            ShopifyService.checkLogin().then((responseJson) => {
                this.props.handleAfterLogin(responseJson);
            })

            this.props.navigator.dismissModal({
              animated: true
            });
        }
    }

    _onNavigationStateChange(webViewState) {
        let webViewStateUrl = webViewState.url;
        let accountUrl = domainPublic + '/account',
            loginUrl = domainPublic + '/account/login',
            registerUrl = domainPublic + '/account/register';

        if(webViewStateUrl == accountUrl
                || webViewStateUrl == (accountUrl + '?view=gikApp')) {
            if(webViewStateUrl === accountUrl) {
                ShopifyService.checkLogin().then((responseJson) => {
                    this.props.handleAfterLogin(responseJson);
                })
                this.props.navigator.dismissModal({
                    animated: true
                });
            }
        }
    }
    
    render() {
        return(
            <View style={styles.container}>
                <WebView  source={{ uri: this.state.linkUrl }}
                          ref = {"webview"}
                          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
})
