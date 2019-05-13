import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    FlatList,
    ActivityIndicator,
    TextInput,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHelper, ShopifyService } from '@services';
const { height, width } = Dimensions.get('window');
import { Body, Thumbnail, Card, CardItem } from 'native-base';
import { Actions } from '@actions';
import Language from '@language';
import { configs } from '@settings';

export default class PageSearchScreen extends Component {
    static navigatorStyle = {
      drawUnderTabBar: false,
      navBarHidden: true,
      // tabBarHidden: true
    };
    constructor(props) {
      super(props);
      this.state = {
        keyword: "",
        dataSource: [],
        loaded: true,
        notFound: false,
        widgetHeight: 100,
        numOfResult: 0,
        currentPage: 1,
        hasNext: false
      };

      // if you want to listen on navigator events, set this up
      this.entries = [];
      this.imageWidth = (width / 2) - 14;
      this.productListThemeConfigs = this.props.settings.themeConfigs.product_list;
      this.productImageNewSize = AppHelper.resizeImage(this.productListThemeConfigs.image_width, this.productListThemeConfigs.image_height, this.imageWidth);
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if(event.id === 'back') {
            Actions.toPreviousScreen(this.props.navigator);
        }
    }

    _handleKeyPress(e) {
      let _this = this;
      if (!AppHelper.isNullOrEmpty(this.state.keyword)) {
          this.entries = [];
          this.setState({
            loaded: false,
            currentPage: 1,
            hasNext: false
          }, () => _this.searchProductsByKeyword())
      }
    }

    componentDidMount() {
      setTimeout(() => {
        this.refs.searchInput && this.refs.searchInput.focus()
      }, 500)
    }

    searchProductsByKeyword = () => {
        ShopifyService.searchProductsByKeyword(this.state.keyword, this.state.currentPage).then((result) => {
            this.entries = this.entries.concat(result.products);
            if (this.entries.length > 0) {
              this.setState({
                  dataSource: this.entries,
                  loaded: true,
                  notFound: false,
                  numOfResult: this.entries.length,
                  hasNext: result.paginate.hasNext
              })
            }
            else {
              this.setState({
                  loaded: true,
                  notFound: true
              })
            }
        }).catch((error) => {
            console.log("error", error);
            this.setState({ loading: false, error: true })
        })
    }

    renderRow = (data) => {
        let item = data.item;
        const soldOut = () => {
            if (!item.available) {
                return (
                    <View style={{
                        position: 'absolute',
                        right: 5,
                        top: 15,
                        backgroundColor: '#8f45ff',
                        paddingTop: 3,
                        paddingBottom: 3,
                        paddingLeft: 5,
                        paddingRight: 5,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{ fontSize: 12, marginRight: 0 }}>
                            {this.props.settings.themeConfigs.language.productOutOfStockTitle}
                        </Text>
                    </View>
                )
            } else {
                return null;
            }
        }

        const onSale = () => {
            if (item.available && item.compare_at_price > item.price) {
                return (
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
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
            } else {
                return null;
            }
        }
        return (
            <TouchableOpacity onPress={this.toShopifyProductDetail.bind(this, {
                                    handle: item.handle,
                                    title: item.title}, this.props.navigator)}>
                <Card style = {{marginBottom: 0, padding: 0}}>
                <CardItem
                    style={{ backgroundColor: this.productListThemeConfigs.productBackgroundColor || '#ffffff', marginLeft: 0, marginBottom: 4 }}>
                    <Thumbnail
                        large square
                        source={{ uri: `https:${item.featured_image}` }}
                        resizeMode={'contain'} />
                    <Body
                        style={{
                            marginLeft: 10,
                            justifyContent: "center",
                            alignItems: 'flex-start',
                            borderBottomWidth: 0
                        }}>
                        <View>
                            <Text
                                numberOfLines={2}
                                style={{
                                    color: this.productListThemeConfigs.titleTextColor || '#565656',
                                    fontSize: 16,
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    marginBottom: 5
                                }}>
                                {item.title}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: this.productListThemeConfigs.vendorTextColor || '#565656',
                                    fontSize: 14,
                                    textAlign: 'left',
                                    marginBottom: 10
                                }}>
                                {item.vendor}
                            </Text>
                            <Text numberOfLines={2}
                                    style = {{
                                    color: this.productListThemeConfigs.descTextColor || '#565656',
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
                            {item.compare_at_price != 0.0000 ?
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
                </Card>
            </TouchableOpacity>
        )
    }

    onEndReached = () => {
      let _this = this;
      console.log('next page:', this.state.hasNext)
      if(this.state.hasNext) {
        let currentPage = this.state.currentPage + 1;
        this.setState({
          currentPage
        }, () => _this.searchProductsByKeyword())
      }
    }

    render() {
      const searchHeader = () => {
        return (
          <View style={[styles.searchContainer, { backgroundColor: this.props.settings.themeConfigs.color.navBarBackgroundColor }]}>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => Actions.toPreviousScreen(this.props.navigator)}
                            style={{ justifyContent: 'center', marginLeft: 20 }}>
                  <Ionicons name={configs.RTL ? 'md-arrow-forward' : 'md-arrow-back'} size={28}
                            color={this.props.settings.themeConfigs.color.navBarButtonColor} />
                </TouchableOpacity>
              <View style={styles.searchRow}>
                <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 3}}>
                  <TextInput
                      ref='searchInput'
                      underlineColorAndroid='transparent'
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      placeholder={Language.t('searchProduct')}
                      placeholderTextColor= "#9e9e9e"
                      returnKeyType='done'
                      onSubmitEditing={this._handleKeyPress.bind(this) }
                      onChangeText={(text) => this.setState({ keyword: text }) }
                      style={styles.textInput}
                      />
                  </View>
                </View>
            </View>
          </View>
        )
      }
      renderResult = () => {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        } else {
            if (this.state.notFound) {
                return this.renderError();
            } else {
                return (
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={(data) => this.renderRow(data)}
                        enableEmptySections={true}
                        contentContainerStyle={styles.viewList}
                        numColumns={1}
                        onEndReached={this.onEndReached.bind(this)}
                        onEndReachedThreshold={0.5}
                        bounces={false}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )
            }
        }
      }
      return (
          <View style={styles.container}>
              {searchHeader()}
              {renderResult()}
          </View>
      )
    }

    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    size='small' />
            </View>
        );
    }

    renderError() {
        console.log("Error")
        return (
            <View style={styles.loading}>
                <Text style={{ color: '#7f7f7f', fontSize: 15 }}>{ Language.t('productNotFound') }</Text>
            </View>
        )
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
}
const styles = StyleSheet.create({
    container: {
        width,
    },
    viewList: {
      paddingBottom: 80
    },
    viewOne: {
      width: (width / 2) - 8,
      marginRight: 1,
      marginLeft: 1,
      marginBottom: 5
    },
    heading: {
      marginBottom: 15,
      color: "#666666",
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '500',
    },
    title: {
      marginTop: 11,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'left',
    },
    subtitle: {
      width: (width / 2) - 8,
      padding: 5,
      lineHeight: 20,
      fontSize: 14,
      textAlign: 'left',
      fontWeight: '400',
      height: 50
    },
    loading: {
      width: width,
      height: height - 100,
      justifyContent: "center",
      alignItems: "center"
    },
    loadmore: {
      height: 60,
      justifyContent: "center",
      alignItems: "center"
    },
    toolbar: {
      borderBottomWidth: 3,
      borderBottomColor: '#f1f1f1',
      height: 40
    },
    productPriceDel: {
      fontSize: 13,
      textDecorationLine: 'line-through',
      marginTop: 12,
      marginRight: 5
    },
    soldOut: {
      position: 'absolute',
      right: 5,
      top: 5,
      backgroundColor: '#8f45ff',
      paddingVertical: 3,
      paddingHorizontal: 5
    },
    onSale: {
      position: 'absolute',
      right: 5,
      top: 5,
      backgroundColor: '#df0029',
      paddingVertical: 3,
      paddingHorizontal: 5
    },
    onSaleText: {
        color: '#ffffff'
    },
    horizontalScrollViewWrap: {
      paddingVertical: 20,
      paddingHorizontal: 15,
      backgroundColor: '#ffffff',
    },
    horizontalScrollViewTitle: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    productItem: {
      marginBottom: 10,
      paddingLeft: 5,
      paddingRight: 5
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
    },
    searchContainer: {
      height: Platform.OS == 'android' ? 74 : 94,
      paddingTop: 20
    },
    row: {
      flex: 1,
      marginTop: 0,
      flexDirection: 'row',
      alignItems: 'center'
    },
    searchRow: {
        marginLeft: 20,
        flex: 1,
        flexDirection: 'row',
        marginRight: 20
    },
    textInput: {
      height: 35,
      fontSize: 15,
      paddingHorizontal: 10,
      paddingTop: 2,
      paddingBottom: 2,
      textAlign: configs.RTL ? 'right' : 'left'
    }
});
