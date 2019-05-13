import React, {Component } from 'react';
import {
    View,
    WebView,
    StyleSheet
} from 'react-native';
import { domainPublic } from '@settings';
import { ShopifyService } from '@services';

export default class AccountDetail extends Component {
    constructor(props) {
        super(props);
        this.linkUrl = `${domainPublic}/account?view=gikApp`;
        this.state = {
            linkUrl: this.linkUrl
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
        if(webViewStateUrl === accountUrl
            || webViewStateUrl === loginUrl
            || webViewStateUrl === registerUrl) {
            this.setState({
                linkUrl: webViewStateUrl + '?view=gikApp'
            })
            if( webViewState.navigationType == "formsubmit") {
              this.setState({
                submitted: true
              })
            }
        }
    }
    reload() {
      if (this.state.submitted == true && this.state.linkUrl !=  SettingData.appConfigs.domain_public + "/account?view=gikApp") {
        this.refs.webview.reload()
        this.refs.webview.goBack()
        this.setState({
            submitted: false
        })
      }
    }

    render() {
        return(
            <View style={styles.container}>
                <WebView source={{ uri: this.state.linkUrl }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    ref = {"webview"}
                    onLoadEnd = {this.reload.bind(this)}
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