import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl
} from 'react-native';
import Spinner from 'react-native-spinkit';
import { ShopifyService, AppHelper, storage } from '@services';
import Styles from './Styles';
import ArticleLayout from '@containers/ArticleLayout';
import { Actions } from '@actions';
import Language from '@language';
import { configs } from '@settings';
var _ = require('lodash');

export default class ArticleListScreen extends Component {
  static navigatorStyle = {
    // tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
      loaded: false,
      refreshing: false,
      hasData: false,
      displayModeSwitching: false,
      layout: 'FeaturePost',
      dataSource: [],
      isSpinnerVisible: false,
      showSortBar: true,
      blogHandle: {},
    }
    this.pageCurrent = 1;
    this.articles = [];
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'layout') {
        let layoutProps = {
          layout: this.state.layout,
          callback: this.handleDisplayModeChanged
        };
        this.props.navigator.showModal({
          backButtonHidden: configs.RTL,
          screen: "gikApp.ArticleLayoutModal", // unique ID registered with Navigation.registerScreen
          title: Language.t('chooseLayout'), // title of the screen as appears in the nav bar (optional)
          passProps: {
            settings: this.props.settings,
            layoutProps
          }, // simple serializable object that will pass as props to the modal (optional)
          navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          animationType: 'fade', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        });
      }
      else if(event.id === 'back') {
        Actions.toPreviousScreen(this.props.navigator);
      }
    }
  }
  componentWillMount() {
      if(this.props.type === 'bookmark') {
        this.getBookmark();
      }
      else {
        this.getArticles();
      }
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    else {
      if (this.state.notFound) {
        return this.renderNotfound();
      }
      else {
        let numColumns = 1;
        switch(this.state.layout) {
          case 'TwoColumn':
            numColumns = 2;
            break;
          case 'ThreeColumn':
            numColumns = 3;
            break;
          default:
            numColumns = 1;
        }
          return (
            <View style = {Styles.container}>
            {
              this.state.isSpinnerVisible ?
              <View style = {Styles.spinnerContainer}>
                  <Spinner style={Styles.spinner} isVisible={this.state.isSpinnerVisible} size={60} type={'ThreeBounce'}/>
              </View>
              : null
            }
              <FlatList
                  refreshControl={
                      <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this.onRefresh.bind(this)}
                      />
                  }
                numColumns={numColumns}
                contentContainerStyle={Styles.flatlist}
                data={this.state.dataSource}
                renderItem={(data) =>
                            this.state.layout == "FeaturePost"
                            ? this._renderFeaturePostItem(data)
                            : this._renderDefaultItem(data)
                        }
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={0.5}
                enableEmptySections={true}
                keyExtractor={(item, index) => index.toString()}
                bounces = {false}
              />
            </View>
          );
      }
    }
  }

  onRefresh = () => {
    this.articles = [];
    this.pageCurrent = 1;
    this.setState({ refreshing: true });
    if(this.props.type === 'bookmark') {
      this.getBookmark();
    }
    else {
      this.getArticles();
    }
  }

  onEndReached = () => {
    if(this.props.type === 'bookmark') {
      this.pageCurrent += 1;
      this.getBookmark();
    }
    else {
      if(this.state.nextPage) {
        this.pageCurrent += 1;
        this.getArticles();
      }
    }
  }

  renderNotfound() {
    return (
      <View key={AppHelper.newGuid() } >
        <View>
          <Text style={{ padding: 20, textAlign: 'center'}}>
            {Language.t('noArticleFound')}
          </Text>
        </View>
      </View>
)
  }

  renderLoadingView() {
    return (
      <View style = {Styles.spinnerContainer}>
        <Spinner style={Styles.spinner} isVisible={true} size={60} type={'ThreeBounce'}/>
      </View>
    );
  }

  _renderFeaturePostItem(data) {
    var article;
    if(this.props.type === 'bookmark') {
      article = data.item.article;
    }
    else {
      article = data.item;
    }

    const articleProps = {
      imageURL: article.featured_image,
      title: article.title,
      onPress: this.toDetailScreen.bind(this, article),
      date: article.author,
    }
    if (data.index == 0) {
      return (
        <ArticleLayout  {...articleProps}
                        key={AppHelper.newGuid() }
                        layout = 'Portfolio'
        />
      );
    }
    else {
      return (
        <ArticleLayout   {...articleProps}
                        key={AppHelper.newGuid() }
                        layout = 'List'
        />
      );
    }
  }

  _renderDefaultItem(data, index) {
    var article;
    if(this.props.type === 'bookmark') {
      article = data.item.article;
    }
    else {
      article = data.item;
    }
    const articleProps = {
      imageURL: article.featured_image,
      title: article.title,
      onPress: this.toDetailScreen.bind(this, article),
      date: article.author,
    }
    return (
      <ArticleLayout {...articleProps}
                      key={AppHelper.newGuid() }
                      layout = { this.state.layout }
      />
    );
  }

  getArticles() {
    ShopifyService.getArticles(this.props.blog.handle, this.pageCurrent).then((result) => {
      if (result.paginate && result.paginate.items > 0) {
        this.articles = this.articles.concat(result.articles);
        this.setState({
          dataSource: this.articles,
          loaded: true,
          refreshing: false,
          error: false,
          isSpinnerVisible: false,
          nextPage: result.paginate.hasNext
        })
        this.props.navigator.setTitle({
          title: result.title // the new title of the screen as appears in the nav bar
        });
      }
      else {
        this.setState({
          loaded: true,
          notFound: true
        })
      }
    }).catch((error) => {
      console.log("error", error);
      this.setState({
        loaded: true,
        notFound: true
      })
    })
  }

  getBookmark() {
    storage.getAllDataForKey('localStorage').then(ret => {
      if(ret.length > 0) {
        this.setState({
          dataSource: ret,
          loaded: true,
          refreshing: false,
          error: false,
          isSpinnerVisible: false,
        })
      }
      else {
        this.setState({
          notFound: true,
          loaded: true,
        })
      }
    }).catch(err => {
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          this.setState({
            loaded: true,
            notFound: true
          })
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          this.setState({
            loaded: true,
            notFound: true
          })
          break;
      }
    })
  }

  handleDisplayModeChanged = (layout) => {
    this.setState({
      isSpinnerVisible: true
    }, function() {
      this.setState({
        loaded: false
      }, () => {
        let newEntries = _.clone(this.state.dataSource);
        this.setState({
          loaded: true,
          layout,
          displayModeSwitching: !this.state.displayModeSwitching,
          dataSource: newEntries
        })
      });
    });

    setTimeout(() => {
      this.setState({
        isSpinnerVisible: false
      })
    }, 1500);
  }

  toDetailScreen(article) {
    let options = {
      settings: this.props.settings,
      article: {
        handle: article.handle
      },
      widgetProps: {
        type: this.props.type === 'bookmark' ? 'bookmark' : '',
        author: article.author,
        title: article.title,
        featured_image: article.featured_image,
        content: this.props.type === 'bookmark' ? article.content : ''
      }
    }
    Actions.toArticleScreen(options, this.props.navigator);
  }
}
