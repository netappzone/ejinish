import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  WebView
} from 'react-native';
import { ShopifyService, AppHelper } from '@services';
import { Actions } from '@actions';

let jsCode = ``
export default class PageDetailScreen extends Component {
  static navigatorStyle = {
    // tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    const page = {
      title: this.props.page.title,
      url: ShopifyService.getPageURL(this.props.page.handle)
    }
    if (event.id === 'share') {
      AppHelper.displayShareScreen(page.title, page.url);
    }
    else if(event.id === 'back') {
    Actions.toPreviousScreen(this.props.navigator);
    }
  }

  render() {
    jsCode = `try{
        var all_links = document.querySelectorAll("a");
        for( var j = 0; j < all_links.length; j++ ) {
          all_links[j].removeAttribute("href")
        }
      }catch(e){}
    `
    const pageURL =  ShopifyService.getPageURL(this.props.page.handle)
    return (
      <View style={styles.container}>
        <WebView
              source={{ uri: pageURL }}
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
