import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import NotificationSetup from './components/setup';
const { width } = Dimensions.get('window');
import { NotificationService } from '@services';
import { Actions } from '@actions';
import { domainPublic } from '@settings';
import Language from '@language';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    const { settings } = this.props;
    this.state = {
      refreshing: false,
      notifications: [],
      totalCount: 0,
      limit: 10,
      page: 0,
      tabIndex: settings.STORES_LOCATOR && settings.STORES_LOCATOR.enable && settings.STORES_LOCATOR.data.length > 0 ? 4 : 3
    }

    this.productListThemeConfigs = this.props.settings.themeConfigs.product_list;
    this.handleOpenNotify = this.handleOpenNotify.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if(event.id === 'bottomTabSelected' || event.id === 'bottomTabReselected') {
      this.props.navigator.setTabBadge({ tabIndex: this.state.tabIndex, badge: null });
    }
  }

  componentDidMount() {
    this.getNotifications();
  }

  getNotifications = () => {
    const { page, limit, notifications } = this.state;
    const offset = page === 0 ? 0 : (page * limit) + 1;

    NotificationService.fetchNotifications(limit, offset)
      .then(response => {
        this.setState({
          refreshing: false,
          totalCount: response.total_count,
          notifications: page === 0 ? response.notifications : [...notifications, ...response.notifications],
        })
      }).catch((error) => {
        this.setState({ refreshing: false })
      })
  }

  handleOpenNotify = (notify) => {
    this.props.navigator.setTabBadge({ tabIndex: this.state.tabIndex, badge: null });
    let data = notify.data;

    if (data && data.openURL) {
      let openURL = data.openURL,
        linkType = '',
        options = {},
        settings = this.props.settings,
        handle = '';

      if (openURL.indexOf(domainPublic) > -1) {
        if (openURL.search(/\/collections\/[\w\d.-]+\/products\//) > -1 || openURL.indexOf(domainPublic + '/products/') > -1) {
          // product
          linkType = 'product';
          handle = openURL.split('/products/')[1];
        }
        else if (openURL.indexOf(domainPublic + '/collections/') > -1) {
          // collection
          linkType = 'collection';
          handle = openURL.replace(domainPublic + '/collections/', '');
        }
        else if (openURL.search(/\/blogs\/[\w\d.-]+\/[\w\d.-]+/) > -1) {
          // article
          linkType = 'article';
          handle = openURL.replace(domainPublic + '/blogs/', '');
        }
        else if (openURL.indexOf(domainPublic + '/blogs/') > -1) {
          // blog
          linkType = 'blog';
          handle = openURL.replace(domainPublic + '/blogs/', '');
        }
        else if (openURL.indexOf(domainPublic + '/pages/') > -1) {
          // page
          linkType = 'page';
          handle = openURL.replace(domainPublic + '/pages/', '');
        }
        else {
          // external link
          linkType = 'external';
          handle = openURL;
        }
      }
      else {
        // external link
        linkType = 'external';
        handle = openURL;
      }

      switch (linkType) {
        case 'collection':
          // navigation to collection screen
          console.log('collection', handle);
          options = {
            collection: {
              handle
            },
            settings
          }
          Actions.toCollectionScreen(options, this.props.navigator)
          break;
        case 'product':
          // navigation to product detail screen
          console.log('product')
          options = {
            settings,
            product: {
              handle
            },
            widgetProps: {
              collectionHandle: data.collectionHandle || ''
            }
          }
          Actions.toProductScreen(options, this.props.navigator);
          break;
        case 'blog':
          // navigation to blog screen
          console.log('blog')
          options = {
            settings,
            blog: {
              handle
            }
          };
          Actions.toBlogScreen(options, this.props.navigator);
          break;
        case 'article':
          console.log('article')
          options = {
            settings,
            article: {
              handle
            },
            widgetProps: {
              type: '',
              author: '',
              featured_image: '',
              content: ''
            }
          }
          Actions.toArticleScreen(options, this.props.navigator);
          break;
        case 'page':
          console.log('page')
          options = {
            settings,
            page: {
              handle
            }
          };
          Actions.toPageDetail(options, this.props.navigator);
          break;
        case 'external':
          Actions.toExternalLink(handle);
          break;
        default:
          //navigation to default screen or alert message
          break;
      }

      this.props.navigator.switchToTab({
        tabIndex: this.state.tabIndex // (optional) if missing, this screen's tab will become selected
      });
    }
  }

  handleRefresh = () => {
    this.setState({ refreshing: true, page: 0 }, () => { this.getNotifications() })
  }

  handleNewNotify = () => {
    this.props.navigator.setTabBadge({ tabIndex: this.state.tabIndex, badge: '!' });
    this.handleRefresh()
  }

  onEndReached = () => {
    const { page, limit, totalCount } = this.state;
    if (page * limit < totalCount) {
      this.setState({ page: page + 1 }, () => {
        this.getNotifications()
      })
    }
  }

  renderItem = ({ item }) => {
    let notification = item;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.item}
        onPress={() => this.handleOpenNotify(notification)}>
        <View>
          <Text style={styles.heading}>
            {notification.headings[Object.keys(notification.headings)[0]]}
          </Text>
        </View>
        <View>
          <Text style={styles.content}>
            {notification.contents[Object.keys(notification.contents)[0]]}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { refreshing, notifications } = this.state;
    return (
      <View style={[styles.wrapper, { backgroundColor: this.productListThemeConfigs.screenBackgroundColor || '#f1f1f1' }]}>
        <FlatList
          data={notifications}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text style={styles.emptyList}>{Language.t('noMessage')}</Text>}
        />
        <NotificationSetup
          handleOpenNotify={this.handleOpenNotify}
          handleNewNotify={this.handleNewNotify} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width
  },
  item: {
    marginBottom: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10
  },
  emptyList: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    width,
    textAlign: 'center'
  }
})
