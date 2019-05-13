import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

import { AppHelper, ShopifyService } from '@services';
import { Button } from 'native-base';
import FastImage from 'react-native-fast-image';
import { Col, Grid } from 'react-native-easy-grid';
import { Body, Thumbnail, CardItem } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { height, width } = Dimensions.get('window');
import Language from '@language';
import { configs } from '@settings';
import { Actions } from '@actions';
var _ = require('lodash');

export default class CollectionScreen extends Component {
  static navigatorStyle = {
    drawUnderNavBar: true,
    // tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      isLoadMore: false,
      error: false,
      showSortBar: true,
      displayMode: "grid",
      displayModeSwitching: false,
      dataSource: [],
      collectionHandle: {},
      sortBy: 'manual'
    }
    this.entries = [];
    this.pageCurrent = 1;
    this.imageWidth = (width / 2) - 14;
    this.productListThemeConfigs = this.props.settings.themeConfigs.product_list;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.productImageNewSize = AppHelper.resizeImage(this.productListThemeConfigs.image_width, this.productListThemeConfigs.image_height, this.imageWidth);
    this.showSortModal=this.showSortModal.bind(this);
    this.handleDisplayModeChanged=this.handleDisplayModeChanged.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'cart') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.switchToTab({
          tabIndex: 1
        })
      }
      else if (event.id == 'search') {
        Actions.toSearchScreen({settings: this.props.settings }, this.props.navigator);
      }
      else if(event.id == 'back') {
        Actions.toPreviousScreen(this.props.navigator);
      }
    }
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts(){
    let collectionHandle = _.cloneDeep(this.state.collectionHandle);
    if (this.props.collection.handle) {
      collectionHandle = this.props.collection.handle;
    }
    ShopifyService.getProducts(collectionHandle,this.state.sortBy,this.pageCurrent).then((result) => {
      if (result.paginate && result.paginate.items > 0) {
        this.entries = this.entries.concat(result.products);
        this.setState({
          dataSource: this.entries,
          loading: false, refreshing: false, error: false,
          nextPage: result.paginate.hasNext
        })
        this.props.navigator.setTitle({
          title: result.title // the new title of the screen as appears in the nav bar
        });
      }
      else {
        this.setState({ loading: false, error: true })
      }
    }).catch((error) => {
      console.log("error", error);
      this.setState({ loading: false, error: true })
    })
  }

  onRefresh = () => {
    this.entries = [];
    this.pageCurrent = 1;
    this.setState({ refreshing: true });
    this.getProducts();
  }

  onEndReached = () => {
    if(this.state.nextPage) {
      this.pageCurrent += 1;
      this.getProducts();
    }
  }

  handleDisplayModeChanged = () => {
    if (!this.state.displayModeSwitching) {
      this.setState({
        loading: true,
        displayModeSwitching: true
        }, () => {
          let displayMode = this.state.displayMode == "grid" ? "list" : "grid";
          let newEntries = _.clone(this.entries);

          this.setState({
            displayMode: displayMode,
            dataSource: newEntries,
            loading: false,
            displayModeSwitching: false
          })
      });
    }
  }

  /**
   * Bắt sự kiện áp dụng lọc sản phẩm từ modal filter
   */

  handleUpdateDataFilter = (filterData) => {
    this.entries = [];
    this.pageCurrent = 1;
    this.setState({ filterData: filterData, loading: true }, () => {
      this.getProducts();
    });
  }

  /**
   * Hiển thị modal sắp xếp sản phẩm
   */
  showSortModal = () => {
    let sortProps = {
      sortBy: this.state.sortBy,
      callback: this.handleUpdateDataSort
    };

    this.props.navigator.showModal({
      screen: "gikApp.ProductSortModal", // unique ID registered with Navigation.registerScreen
      title: Language.t('sortBy'), // title of the screen as appears in the nav bar (optional)
      backButtonHidden: configs.RTL,
      passProps: {
          sortProps,
          settings: this.props.settings
      }, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }

  handleUpdateDataSort = (sortBy) => {
    this.entries = [];
    this.pageCurrent = 1;
    this.setState({ sortBy: sortBy, loading: true }, () => {
      this.getProducts();
    });
  }
  toShopifyProductDetail(item) {
    let options = {
      settings: this.props.settings,
      product: {
        handle: item.handle
      },
      widgetProps: {
        collectionHandle: item.collectionHandle || ''
      }
    }
    Actions.toProductScreen(options, this.props.navigator);
  }
  renderGridItem = (data) => {
    let item = data.item;
    const soldOut = () => {
      if (!item.available) {
        return (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>{this.props.settings.themeConfigs.language.productOutOfStockTitle}</Text>
          </View>
        )
      }
      else {
        return null;
      }
    }

    const onSale = () => {
      if (item.available && item.on_sale) {
        return (
          <View style={styles.onSale}>
            <Text style={styles.onSaleText}>
              {item.sale}
            </Text>
          </View>
        )
      }
      else {
        return null;
      }
    }
    const productCard = () => {
      return (
        <View style = {{width: (width / 2) - 2, marginBottom: 0, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#eee"}}>
          <View style = {styles.productItem}>
            <View style = {styles.productImages}>
              <FastImage
                  source={{ uri: `https:${item.featured_image}` }}
                  style={{ alignItems: "center", width: this.productImageNewSize.width, height: this.productImageNewSize.height}}
                  resizeMode={FastImage.resizeMode.contain} />
            </View>
            <View style = {styles.productDesc}>
              <Text style={[
                  styles.title, {marginTop: 10, fontWeight:'500'}]} numberOfLines = {1}>
                {item.title}
              </Text>
              <Text style={[
                  styles.title, {fontSize: 13}]} numberOfLines = {1}>
                {item.vendor}
              </Text>
              <View style = {styles.productPriceWraperStyle}>
                <Text style={[styles.productPriceIns, { color: this.productListThemeConfigs.priceTextColor || '#c40808' }]}>{item.price_format}</Text>
                {item.compare_at_price != 0.0000 ? <Text style={[styles.productPriceDel, { color: this.productListThemeConfigs.priceCompareTextColor || '#959595' }]}>{item.compare_at_price_format}</Text> : null}
              </View>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View key={AppHelper.newGuid()}>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.toShopifyProductDetail.bind(this, {
                            handle: item.handle,
                            title: item.title,
                            collectionHandle: this.props.collection.handle})} >
          { productCard() }
          { soldOut() }
          { onSale() }
        </TouchableOpacity>
      </View>
    )
  }

  renderListItem = (data) => {
    let item = data.item;
    const soldOut = () => {
      if (!item.available) {
        return (
          <View style={{
            position: 'absolute',
            right: 10,
            top: 15,
            backgroundColor: '#8f45ff',
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 5,
            paddingRight: 5,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 12, marginRight: 0 }}>{this.props.settings.themeConfigs.language.productOutOfStockTitle}</Text>
          </View>
        )
      }
      else {
        return null;
      }
    }
    const onSale = () => {
      if (item.available && item.compare_at_price > item.price) {
        return (
          <View style={{
              position: 'absolute',
              left: 5,
              top: 10,
              backgroundColor: '#df0029',
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 5,
              paddingRight: 5
          }}>
            <Text style={{ color: '#ffffff', fontSize: 12, marginRight: 0 }}>
              {item.sale}
            </Text>
          </View>
        )
      }
      else {
        return null;
      }
    }
    return (
      <TouchableOpacity onPress={this.toShopifyProductDetail.bind(this, {
                                handle: item.handle,
                                title: item.title,
                                collectionHandle: this.props.collection.handle})}>
          <View style = {{marginBottom: 0, padding: 0}}>
            <CardItem
                style={{ backgroundColor: this.productListThemeConfigs.productBackgroundColor || '#ffffff', marginLeft: 0, marginBottom: 4 }}>
                <Thumbnail large square
                    source={{ uri: `https:${item.featured_image}` }}
                    resizeMode={'contain'} />
                <Body
                    style={{
                        marginLeft: 10,
                        height: 120, justifyContent: "center",
                        alignItems: 'flex-start',
                        borderBottomWidth: 0
                    }}>
                  <View>
                    <Text
                        numberOfLines={1}
                        style={[ styles.title, {fontWeight: '500'}]}>
                        {item.title}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[ styles.title, {
                            fontSize: 14
                        }]}>
                        {item.vendor}
                    </Text>
                    <Text numberOfLines={2}
                          style = {{
                            color: '#565656',
                            fontSize: 13,
                            textAlign: 'left',
                            marginBottom: 10
                          }}>
                          {item.short_description}
                    </Text>
                    <View style = {styles.productPriceWraperStyle}>
                      <Text
                          style={[styles.productPriceIns,{
                              color: this.productListThemeConfigs.priceTextColor || '#c40808',
                              fontSize: 14,
                              fontWeight: '600',
                              textAlign: 'left',
                          }]}>
                        {item.price_format}
                      </Text>
                      {
                        item.compare_at_price != 0.0000
                        ?
                        <Text
                            style={[styles.productPriceDel,{
                                fontSize: 13,
                                textDecorationLine: 'line-through',
                                color: this.productListThemeConfigs.priceCompareTextColor || '#959595',
                                textAlign: 'left',
                                marginTop: 2
                            }]}>
                            {item.compare_at_price_format}
                        </Text>
                        : null
                      }
                    </View>
                  </View>
                </Body>
                {soldOut()}
                {onSale()}
            </CardItem>
          </View>
      </TouchableOpacity>
    )
  }

  renderSortFilter = () => {
    const { link } = this.props;
    if (this.state.showSortBar) {
      return (
        <View style={styles.toolbar}>
          <Grid>
            <Col style={{ height: 45, alignItems: 'center' }}>
              <Button light full icon onPress={this.showSortModal}>
                <FontAwesome color='#959595' size={16} name='sort-amount-desc' />
              </Button>
            </Col>
            <Col style={{ height: 45 }}>
              <Button light full icon
                  onPress={this.handleDisplayModeChanged}>
                <FontAwesome size={18} color='#959595'
                      name={this.state.displayMode == 'grid' ? 'th-large' : 'list-ul'} />
              </Button>
            </Col>
          </Grid>
        </View>
      )
    }
    else {
      return null;
    }
  }

  onScroll(event) {
    let currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset >= offset) {
      this.setState({ showSortBar: true })
    } else {
      this.setState({ showSortBar: false })
    }
    offset = currentOffset;
  }

  render() {
    if (this.state.loading) {
      return this.renderLoadingView();
    }
    else {
      if (this.state.error) {
        return this.renderError();
      }
      else {
        return (
          <View style={[styles.wrapper, { backgroundColor: this.productListThemeConfigs.screenBackgroundColor || '#f1f1f1' }]}>
            <FlatList refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
                data={this.state.dataSource}
                renderItem={(data) => this.state.displayMode == 'grid'
                            ? this.renderGridItem(data)
                            : this.renderListItem(data)}
                onEndReached={this.onEndReached.bind(this)}
                numColumns={this.state.displayMode == 'grid' ? 2 : 1 }
                enableEmptySections={true}
                renderFooter={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.5}
                contentContainerStyle={this.state.displayMode == 'grid' ? styles.viewFlex : styles.viewList}
                keyExtractor={(item, index) => index.toString() }
                bounces={false}
            />
            {this.renderSortFilter()}
          </View>
        )
      }
    }
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='small' />
      </View>
    );
  }

  renderFooter() {
    const { nextPage, displayMode } = this.state;
    if (nextPage) {
      return (
        <View style={[styles.loadmore, style = { marginLeft: displayMode == "grid" ? (width / 2) - 15 : 0 }]}>
            <ActivityIndicator size='small' />
        </View>
      )
    }
    return null;
  }

  renderError() {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#7f7f7f', fontSize: 13 }}>{this.props.settings.themeConfigs.language.dataEmptyText}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 54
  },
  viewFlex: {
    width: width - 4,
    marginLeft: 2,
    backgroundColor: 'transparent'
  },
  heading: {
    marginBottom: 15,
    color: "#666666",
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  title: {
    color: '#222',
    marginBottom: 5,
    textAlign: 'left'
  },
  subtitle: {
    width: (width / 2) - 8,
    padding: 5,
    fontSize: 14,
    textAlign: 'left',
    fontWeight: '400',
    marginBottom: 10
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadmore: {
    height: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  toolbar: {
    backgroundColor: '#f1f1f1',
    height: 45,
    width
  },
  soldOut: {
    position: 'absolute',
    right: 5,
    top: 10,
    backgroundColor: '#8f45ff',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5
  },
  onSale: {
    position: 'absolute',
    left: 5,
    top: 10,
    backgroundColor: '#df0029',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5
  },
  onSaleText: {
      color: '#ffffff'
  },
  productItem: {
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10
  },
  productPriceWraperStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  productPriceIns: {
    color: '#000',
    fontWeight: 'bold',
    marginRight: 15
  },
  productPriceDel: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    color: '#aaa'
  }
});
