import React, {Component } from 'react';
import {
    View,
    WebView,
    StyleSheet
} from 'react-native';
import { domainPublic } from '@settings';
import { ShopifyService } from '@services';

export default class Addresses extends Component {
    constructor(props) {
        super(props);
        this.linkUrl = `${domainPublic}/account/addresses?view=gikApp`;
        this.state = {
            linkUrl: this.linkUrl
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    _onNavigationStateChange(webViewState) {
        let webViewStateUrl = webViewState.url;
        let accountUrl = domainPublic + '/account',
            loginUrl = domainPublic + '/account/login',
            registerUrl = domainPublic + '/account/register',
            addressesUrl = domainPublic + '/account/addresses';
        let _this = this;

        if(webViewStateUrl === addressesUrl) {
            this.setState({
                linkUrl: addressesUrl + '?view=gikApp'
            })
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

    render() {
        return(
            <View style={styles.container}>
                <WebView source={{ uri: this.state.linkUrl }}
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