import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  WebView
} from 'react-native';
import { ShopifyService, AppHelper, storage } from '@services';
import { configs } from '@settings';
import { Actions } from '@actions';

export default class ArticleDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boSavedThis: false,
      bookmarkIds: []
    }
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorStyle = {
    // tabBarHidden: true
  };

  static navigatorButtons = configs.RTL
  ?
  {
    rightButtons: [
      {
        id: 'back',
        icon: require('@images/md-arrow-forward.png'),
      },
      {
        icon: require('@images/md-share.png'),
        id: 'share'
      }
    ]
  }
  :
  {
    leftButtons: [
      {
        id: 'back',
        icon: require('@images/md-arrow-back.png')
      }
    ]
  }

  renderShareButton() {
    configs.RTL
    ?
    this.props.navigator.setButtons({
      leftButtons: [
        {
          icon: this.state.boSavedThis == false ? require('@images/heart.png') : require('@images/heart-filled.png'),
          id: 'save'
        }
      ]
    })
    :
    this.props.navigator.setButtons({
      rightButtons: [
        {
          icon: require('@images/md-share.png'),
          id: 'share'
        },
        {
          icon: this.state.boSavedThis == false ? require('@images/heart.png') : require('@images/heart-filled.png'),
          id: 'save'
        }
      ]
    })
  }

  onNavigatorEvent(event) {
    const article = {
      handle: this.props.article.handle,
      title: '',
      url: ShopifyService.getArticleURL(this.props.article.handle),
      author: '',
      featured_image: this.props.widgetProps.featured_image,
      content: ''
    }
    if(event.id === 'share') {
      AppHelper.displayShareScreen(article.title, article.url);
    }
    else if(event.id === 'save') {
      let boSavedThis = this.state.boSavedThis;
      if(boSavedThis === false) {
        ShopifyService.getArticleJson(this.props.article.handle)
          .then(result => {
            article.content = result.content,
            article.title = result.title,
            article.author = result.author,
            article.published_at = result.published_at;
            storage.save({
              key: 'localStorage',   // Note: Do not use underscore("_") in key!
              id: this.props.article.handle,
              data: {
                article
              }
            })
          })
      }
      else {
        storage.remove({
          key: 'localStorage',
          id: this.props.article.handle
        })
      }
      this.setState({
        boSavedThis: !boSavedThis
      })
      this.renderShareButton();
    }
    else if(event.id === 'back') {
      Actions.toPreviousScreen(this.props.navigator);
    }
  }

  componentWillMount() {
    let _this = this;

    storage.getIdsForKey('localStorage').then(ids => {
      _this.setState({
        bookmarkIds: ids
      }, () => {
        if(_this.state.bookmarkIds.indexOf(this.props.article.handle) > -1) {
          _this.setState({
            boSavedThis: true
          })
        }
      })
      _this.renderShareButton();
    })

    this.props.navigator.setTitle({
      title: this.props.widgetProps.title // the new title of the screen as appears in the nav bar
    });
  }

  render() {
    const articleURL = ShopifyService.getArticleURL(this.props.article.handle) + '?view=gikApp';
    let jsCode = AppHelper.scaleImage();

    return (
      (this.props.widgetProps && this.props.widgetProps.type === 'bookmark')
      ?
      <View style={styles.container}>
        <WebView
          source={{ html: this.props.widgetProps.content }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={jsCode}
          startInLoadingState={true}
        />
      </View>
      :
      <View style={styles.container}>
        <WebView
          source={{ uri: articleURL }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={jsCode}
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
