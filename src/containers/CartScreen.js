import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TextInput,
  Alert
} from 'react-native';

import { AppHelper, ShopifyService } from '@services';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import { Body, Thumbnail, Card, CardItem } from 'native-base';
import Language from '@language';
var {height, width} = Dimensions.get('window');
var _ = require('lodash');
import { Actions } from '@actions';
import { configs } from '@settings';

export default class CartScreen extends Component {
  static navigatorStyle = {
    drawUnderTabBar: false
  };

  constructor(props) {
    super(props);
    this.props.navigator.setTitle({
      title: Language.t('yourCart')
    });
    const { settings } = this.props;
    this.state = {
      visible: false,
      dataSource: [],
      loaded: false,
      cartItems: [],
      variantIds: [],
      tabIndex: settings.STORES_LOCATOR && settings.STORES_LOCATOR.enable && settings.STORES_LOCATOR.data.length > 0 ? 2 : 1
    };
    this.imageWidth = (width / 2) - 14;
    this.productListThemeConfigs = this.props.settings.themeConfigs.product_list;
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.productImageNewSize = AppHelper.resizeImage(this.productListThemeConfigs.image_width, this.productListThemeConfigs.image_height, this.imageWidth);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.toCheckout=this.toCheckout.bind(this);
    this.goHomeScreen=this.goHomeScreen.bind(this)
  }
  onNavigatorEvent(event) {
    if (event.id == 'close') {
      Actions.toPreviousScreen(this.props.navigator);
    } else if (event.type == 'DeepLink') {
      const parts = event.link.split('/');
      if (parts[1] == 'refreshcart') {
        this.getCartItems();
      }
    }
  }

  componentWillMount() {
    this.getCartItems();
  }

  getCartItems() {
    this.setState({
      loaded: false
    })
    ShopifyService.getCart()
      .then((cartItems) => {
        if (!AppHelper.isNullOrEmpty(cartItems)) {
          if (_.isArray(cartItems)) {
            this.setState({
              loaded: true,
              dataSource: cartItems,
              cartItems: cartItems
            });

            this.props.navigator.setTabBadge({
              tabIndex: this.state.tabIndex,
              badge: this.quantityCart()
            });

          } else {
            this.setState({
              loaded: true,
              dataSource: []
            });

            this.props.navigator.setTabBadge({
              tabIndex: this.state.tabIndex,
              badge: null
            });
          }
        } else {
          this.setState({
            loaded: true,
            cartItems: [],
            dataSource: []
          });
          this.props.navigator.setTabBadge({
            tabIndex: this.state.tabIndex,
            badge: null
          });
        }
      }).done();
  }

  removeCartItem(item) {
    Alert.alert(
      this.props.settings.themeConfigs.language.removeCartItemTitle,
      this.props.settings.themeConfigs.language.removeCartItemText,
      [
        { text: Language.t('cancel'), onPress: () => { } },
        {
          text: Language.t('delete'), onPress: () => {
            this.setState({
              loaded: false
            });
            var cartItems = this.state.cartItems;
            cartItems = _.reject(cartItems, function (product) { return product.variantId == item.variantId; });

            this.setState({
              dataSource: cartItems,
              cartItems: cartItems,
              loaded: true
            });

            ShopifyService.removeCartItem(item.variantId);
            this.props.navigator.setTabBadge({
              tabIndex: this.state.tabIndex,
              badge: this.quantityCart() === 0 ? null : this.quantityCart()
            });
          }
        },
      ]
    )
  }

  //Tổng sản phẩm trong giỏ hàng
  quantityCart() {
    var quantity = 0;
    this.state.cartItems.forEach(function (p) {
      quantity += p.quantity;
    });

    return quantity;
  }

  quantityPlus(item) {
    this.setState({
      visible: true
    });
    var cartItems = this.state.cartItems;
    var product = _.find(cartItems, { 'variantId': item.variantId });
    if (product) {
        var index = _.indexOf(cartItems, product);
      product.quantity += 1;
      cartItems.splice(index, 1, product);
      ShopifyService.quantityPlus(item.variantId);
      this.setState({
        visible: false,
        dataSource: cartItems,
        cartItems: cartItems
      });

      this.props.navigator.setTabBadge({
        tabIndex: this.state.tabIndex,
        badge: this.quantityCart()
      });
    } else {
      this.setState({
        visible: false
      });
    }
  }

  quantityMinus(item) {
    this.setState({
      visible: true
    });
    var cartItems = this.state.cartItems;
    var product = _.find(cartItems, { 'variantId': item.variantId });
    if (product && product.quantity > 1) {
      var index = _.indexOf(cartItems, product);
      product.quantity -= 1;
      cartItems.splice(index, 1, product);
      ShopifyService.quantityMinus(item.variantId);
      this.setState({
        visible: false,
        dataSource: cartItems,
        cartItems: cartItems
      });
      this.props.navigator.setTabBadge({
        tabIndex: this.state.tabIndex,
        badge: this.quantityCart()
      });
    } else {
      this.setState({
        visible: false
      });
    }
  }

  updateQuantityCartItem(item, quantity) {
    if (quantity != "") {
      var quantityNew = AppHelper.convertToInt(quantity, 0);
      if (quantityNew > 0) {
        this.setState({
          visible: true
        });
        var cartItems = this.state.cartItems;
        var product = _.find(cartItems, { 'variantId': item.variantId });
        if (product) {
          var index = _.indexOf(cartItems, product);
          product.quantity = quantityNew;
          cartItems.splice(index, 1, product);
          ShopifyService.addToCart(cartItems);
          this.setState({
            visible: false,
            dataSource: cartItems,
            cartItems: cartItems
          });
          this.props.navigator.setTabBadge({
            tabIndex: this.state.tabIndex,
            badge: this.quantityCart()
          });
        } else {
          this.setState({
            visible: false,
            dataSource: cartItems,
            cartItems: cartItems
          });
        }
      } else {
        var cartItems = this.state.cartItems;
        this.setState({
          visible: false,
          dataSource: cartItems,
          cartItems: cartItems
        });
      }
    }
  }

  totalPrice() {
    var price = 0;
    this.state.cartItems.forEach(function (p) {
      price += p.quantity * (p.variant.price * 100);
    });
    return _.round(price, 2);
  }

  _renderRow(data) {
    product = data.item;
    return (
      <Card style = {{marginBottom: 0, paddingTop: 0}}>
        <CardItem
            style={{ backgroundColor: this.productListThemeConfigs.productBackgroundColor || '#ffffff', marginLeft: 0, marginBottom: 0 }}>
          <Thumbnail
              large square
              source={{ uri: product.productImg }}
              resizeMode={'contain'} />
          <Body style={{
                marginLeft: 10,
                height: 120, justifyContent: "center",
                alignItems: 'flex-start',
                borderBottomWidth: 0
                }}>
            <View>
            <TouchableOpacity key={AppHelper.newGuid() }  onPress={this.toDetailScreen.bind(this, product) }>
              <Text numberOfLines={1}
                    style={{
                      color:  '#565656',
                      fontSize: 16,
                      textAlign: 'left',
                      fontWeight: 'bold',
                      marginBottom: 5
                  }}>
                {product.productTitle}
              </Text>

            </TouchableOpacity>
              {
                product.variant.title.toLowerCase() !== 'default title'
                ?
                <Text numberOfLines={1}
                      style={{
                          color: this.productListThemeConfigs.vendorTextColor || '#565656',
                          fontSize: 14,
                          textAlign: 'left',
                          marginBottom: 5
                      }}>
                  {product.variant.title}
                </Text>
                :
                false
              }
              <View style = {styles.productPriceWraperStyle}>
                <Text style={[styles.productPriceIns,{
                        color: this.productListThemeConfigs.priceTextColor || '#c40808',
                        fontSize: 16,
                        fontWeight: '600',
                        textAlign: 'left',
                      }]}>
                  {
                    AppHelper.formatMoney(product.variant.price * 100, this.props.settings.siteConfigs.currency)
                  }
                </Text>
                </View>
            </View>
            <View style={styles.bottomBar}>
              <TouchableOpacity key={AppHelper.newGuid() } onPress={this.quantityMinus.bind(this, product) }>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.quantity}>
                <TextInput
                    underlineColorAndroid = 'transparent'
                    keyboardType ="numeric"
                    defaultValue={_.toString(product.quantity) }
                    onChangeText={(quantity) => this.updateQuantityCartItem(product, quantity) }
                    style={styles.quantityText}/>
              </View>
              <TouchableOpacity key={AppHelper.newGuid() } onPress={this.quantityPlus.bind(this, product) }>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>+</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.action} key={AppHelper.newGuid() } onPress={this.removeCartItem.bind(this, product) }>
                <View>
                  <Icon name="ios-trash" size={25} />
                </View>
              </TouchableOpacity>
            </View>
          </Body>
        </CardItem>
      </Card>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    else {
      if (this.state.cartItems.length > 0) {
          return (
              <View key={AppHelper.newGuid() } style={{ flex: 1 }}>
                  <FlatList
                      data={this.state.dataSource}
                      renderItem={this._renderRow.bind(this) }
                      contentContainerStyle={styles.container}
                      keyExtractor={(item, index) => index.toString()}
                      />
                  <View key={AppHelper.newGuid() } style={[styles.checkoutBar, { backgroundColor: '#ffffff' }]}>
                      <View style={[styles.priceBar, { backgroundColor: '#ffffff' }]}>
                          <Text style={styles.totalPriceLabel}>{Language.t('estimatedTotal') + ': ' }</Text>
                          <Text style={styles.totalPrice}>{
                              AppHelper.formatMoney(this.totalPrice(), this.props.settings.siteConfigs.currency)
                          }</Text>
                      </View>
                      <TouchableOpacity key={AppHelper.newGuid() } onPress={this.toCheckout }>
                          <View key={AppHelper.newGuid() } style={[styles.checkoutButton, { backgroundColor: this.props.settings.themeConfigs.color.cartButtonBackgroundColor }]}>
                              <Text style={{ fontSize: 17, color: this.props.settings.themeConfigs.color.buttonTextColor }}>
                                  {this.props.settings.themeConfigs.language.checkoutText}
                              </Text>
                          </View>
                      </TouchableOpacity>
                  </View>
                  <Spinner visible={this.state.visible} />
              </View>
          );
      } else {
        return (
          <View key={AppHelper.newGuid() } style={{ flex: 1 }}>
            <View style={styles.emptyCart}>
              <Icon color="#f1f1f1" name="ios-outlet" size={100} />
              <Text style={styles.emptyText}>{this.props.settings.themeConfigs.language.cartEmptyText}</Text>
            </View>
            <TouchableOpacity key={AppHelper.newGuid() } onPress={this.goHomeScreen }>
              <View key={AppHelper.newGuid() } style={[styles.checkoutButton, { backgroundColor: this.props.settings.themeConfigs.color.cartButtonBackgroundColor }]}>
                <Text style={{ fontSize: 17, color: this.props.settings.themeConfigs.color.buttonTextColor }}>{this.props.settings.themeConfigs.language.continueShoppingText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    }
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large'/>
      </View>
    );
  }

  toDetailScreen(product) {
    let options = {
      settings: this.props.settings,
      product: {
        handle: product.productHandle
      }
    }
    Actions.toProductScreen(options, this.props.navigator);
  }

  toCheckout() {
    ShopifyService.getCart()
        .then((cartItems) => {
            if (!AppHelper.isNullOrEmpty(cartItems)) {
              var _strUrl = "";
              if (_.isArray(cartItems)) {
                _.forEach(cartItems, function(cartItem) {
                  _strUrl += cartItem.variantId + ":" + cartItem.quantity + ","
                });
                var strUrl = _.trimEnd(_strUrl, ',') + "/"
                var cartUrl = ShopifyService.getCheckoutUrl(strUrl);
              }
              else {

              }

              this.props.navigator.showModal({
                backButtonHidden: configs.RTL,
                screen: "gikApp.ShopifyCheckoutScreen",
                title: 'CHECKOUT',
                passProps: {
                  cartUrl: cartUrl,
                  settings: this.props.settings
                }
              })
            }
        }).done();
  }

  goHomeScreen() {
    this.props.navigator.switchToTab({
      tabIndex: 0
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6'
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    color: '#7b7b7b'
  },
  cell: {
    backgroundColor: '#ffffff',
    width: width - 6,
    margin: 3,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    height: 130,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 100,
    height: 120,
    marginRight: 5
  },
  productTitle: {
    color: '#7b7b7b',
    height: 35
  },
  productPrice: {
    color: '#d21f30'
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FF9500',
    padding: 0,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 1,
    shadowOpacity: 0.7
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    shadowColor: '#ccc'
  },
  quantity: {
    justifyContent: "center",
    alignItems: "center"
  },
  quantityText: {
    fontSize: 16,
    width: 35,
    height: 30,
    paddingTop: 2,
    paddingBottom: 2,
    justifyContent: "center",
    textAlign: "center",
    color: "#555555"
  },
  action: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
    marginLeft: 20
  },
  checkoutBar: {
    width: width,
    height: 91,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgb(241,241,241)"
  },
  priceBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkoutButton: {
    width: width,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  totalPriceLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10
  },
  totalPrice: {
    fontSize: 22,
    color: '#d21f30',
    fontWeight: '400',
  }
});
