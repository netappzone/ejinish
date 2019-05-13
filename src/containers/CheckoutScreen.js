import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  WebView
} from 'react-native';
import { ShopifyService } from '@services';
import { configs } from '@settings';

let jsCode = ``
export default class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      urlState: ''
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorButtons = configs.RTL
  ?
  {
    rightButtons: [
      {
        icon: require('@images/cross.png'),
        id: "close",
      }
    ]
  }
  :
  {
    leftButtons: [
      {
        icon: require('@images/cross.png'),
        id: "close",
      }
    ]
  }

  onNavigatorEvent(event) {
    if (event.id == 'close') {
      console.log('close')
      this.props.navigator.dismissModal({
        animated: true
      });
    }
  }

  componentWillMount() {
  }
  _onNavigationStateChange(webViewState) {
    var webViewUrl = webViewState.url;
    console.log('webViewUrl: ', webViewUrl)
    if (webViewUrl.indexOf("thank_you") > -1) {
      this.setState({
        urlState: "checkout_complete"
      })
      console.log('complete')
      ShopifyService.clearCart();
      this.props.navigator.setOnNavigatorEvent((event) => {
        if (event.id == 'close') {
            this.props.navigator.resetTo({
              screen: 'gikApp.StartAppScreen',
              navigatorStyle: {
                navBarHidden: true
              }
            });
        }
      });
    }
    else {
      this.setState({
        urlState: "checkout_proccess"
      })
    }
  }

  render() {
    let _state = this.state.urlState;
    if (_state === "checkout_proccess" ){
      jsCode = `try {
        document.querySelector('.step__footer__previous-link').style.visibility = 'hidden';
      } catch(e){}`
    }
    else {
      jsCode = `try{
        document.querySelector('.step__footer__continue-btn').style.visibility = "hidden";
        }catch(e){}
      `
    }
    return (
      <View style={styles.container}>
        <WebView
              source={{ uri: this.props.cartUrl }}
              onNavigationStateChange={this._onNavigationStateChange.bind(this)}
              javaScriptEnabled = {true}
              domStorageEnabled = {true}
              injectedJavaScript = {jsCode}
              startInLoadingState={true}
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
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
  }
});
