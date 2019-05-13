import React, { Component } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
  Text
} from 'react-native';
import { AppHelper, ShopifyService } from '@services';
import { domainPublic } from '@settings';
import { Root, Toast, Button } from 'native-base';
import Swiper from 'react-native-swiper';
import ProductOptionPicker from './ProductOptionPicker';
import AlsoLikeProduct from './CollectionAlsoLike';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image'
const { height, width } = Dimensions.get('window');
const offset = 0;
import Language from '@language';
import { Actions } from '@actions';
import { configs } from '@settings';

export default class ProductDetailScreen extends Component {
  static navigatorStyle = {
      drawUnderNavBar: true,
      // tabBarHidden: true
  };
  constructor(props) {
      super(props);
      this.state = {
          loading: true,
          outOfStock: false
      };
      this.productListThemeConfigs = this.props.settings.themeConfigs.product_list || {};
      this.colorThemeConfigs = this.props.settings.themeConfigs.color;
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
      this.addToCart=this.addToCart.bind(this)
  }

  onNavigatorEvent(event) {
    if(event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if(event.id == 'search') {
        Actions.toSearchScreen({settings: this.props.settings }, this.props.navigator);
      }
      else if(event.id === 'back') {
        Actions.toPreviousScreen(this.props.navigator);
      }
    }
  }

  componentDidMount() {
    this.getProduct();
  }

  getProduct() {
    ShopifyService.getProductByHandle(this.props.product.handle).then((result) => {
      if (result && result.product) {
        let firstVariant = result.product.variants[0];
        let outOfStock = false;
        if (result.product.options.length == 1 && result.product.variants.length == 1) {
          if (firstVariant.inventory_management
              && firstVariant.inventory_quantity <= 0
              && firstVariant.inventory_policy == "deny") {
            outOfStock = true;
          }
        }
        this.setState({
          loading: false,
          product: result.product,
          variantSelected: firstVariant,
          outOfStock: outOfStock
        })
        this.props.navigator.setTitle({
          title: result.product.title // the new title of the screen as appears in the nav bar
        });
      }
      else {
        this.setState({ loading: false, product: null })
      }
    }).catch((error) => {
      console.log("error", error);
      this.setState({ loading: false, product: null })
    })
  }

  addToCart() {
      const { product, variantSelected } = this.state;
      if (variantSelected) {
          let cartItem = {
              variantId: variantSelected.id,
              productTitle: product.title || product.name,
              productHandle: product.handle,
              productImg: product.image.src,
              variant: variantSelected,
              quantity: 1
          }
          ShopifyService.addToCart(cartItem).then((data) => {
              Alert.alert(
                  this.props.settings.themeConfigs.language.addCartSuccess,
                  '',
                  [
                    {text: Language.t('ok'), onPress: () => console.log('OK Pressed')}
                  ],
                  { cancelable: false }
              )
              this.props.navigator.handleDeepLink({ link: "shoppingcart/refreshcart" });
          }).catch((error) => {
              Toast.show({
                  text: Language.t('errorTryAgain'),
                  position: 'center',
                  buttonText: '',
                  duration: 2000,
                  type: 'danger'
              })
          })
      }
  }

  toShoppingCartScreen = () => {
      this.props.navigator.switchToTab({
          tabIndex: 2
      });
  }

  onScroll(event) {
      var currentOffset = event.nativeEvent.contentOffset.y;
      var direction = currentOffset >= offset ?
          (this.props.navigator.toggleTabs({ to: 'hidden', animated: true }))
          : (this.props.navigator.toggleTabs({ to: 'shown', animated: true }));
      offset = currentOffset;
  }

  handleVariantSelect(data) {
      this.setState({
          outOfStock: data.outOfStock,
          variantSelected: data.variant
      })
  }

  onShareProduct = () => {
    const { product } = this.state;
    if (product) {
      let shareOptions = {
        title: product.title,
        message: product.title,
        url: `${domainPublic}/products/${product.handle}`,
        subject: product.title
      };
      Share.open(shareOptions).catch((err) => { err && console.log(err); })
    }
  }

  render() {
      let { loading, product, outOfStock } = this.state;
      if (this.state.loading) {
          return this.renderLoadingView();
      } else {
          if (!this.state.product) {
              return this.renderEmptyView();
          } else {
            let imageSize = {};
            if(this.state.product.image) {
              imageSize.width = width;
              imageSize.height = width * this.state.product.image.height / this.state.product.image.width
            }
            else {
              imageSize.width = width;
              imageSize.height = width;
            }

            const imageSwiper = (
                <Swiper style={styles.slideWrapper}
                      height={imageSize.height}
                    onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                    dot={<View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 10, height: 10, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: -160, borderWidth: 0.8, borderColor: '#f6f6f6' }} />}
                    activeDot={<View style={{ backgroundColor: '#444', borderColor: '#f6f6f6', borderWidth: 1.35, width: 16, height: 16, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: -160 }} />}
                    paginationStyle={{
                        bottom: -30, left: 10, right: 10
                    }} loop>
                    {this.state.product.images.map((item) => {
                        return (
                            <View key={item.id} style={styles.slide}>
                                <FastImage
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={{ height: imageSize.height, width }}
                                    source={{ uri: item.src }} />
                            </View>
                        )
                    })}
                </Swiper>
            )

            const productDetailWidget = () => {
                const { product } = this.state;
                let productDescription = product.body_html || product.content;
                let productShortDescription = productDescription ? productDescription.replace(/<\/?[^>]+>/gi, '').substring(0, 120) : '';
                return (
                    <View style = {styles.shortDescriptionWrap}>
                      <Text style = {styles.shortDescriptionTitle}>
                        {Language.t('description')}
                      </Text>
                      <Text style={{textAlign: 'left'}}>
                        {productShortDescription}{"..."}
                      </Text>
                      <TouchableOpacity onPress={this.toShopifyProductDescriptionModal.bind(this, productDescription, this.props.navigator)} >
                        <Text style = {styles.shortDescriptionReadmore}>
                            { Language.t('readMore') }
                        </Text>
                      </TouchableOpacity>
                    </View>
                )
            }

            const productOptionPicker = () => {
                if (product.options.length == 1 && product.variants.length == 1) {
                    return null;
                } else {
                    return (
                        <ProductOptionPicker
                            settings={this.props.settings}
                            updateVariant={this.handleVariantSelect.bind(this)}
                            options={this.state.product.options}
                            variants={this.state.product.variants} />
                    )
                }
            }

            const addToCartButton = () => {
                const addToCartText = outOfStock ? this.props.settings.themeConfigs.language.productOutOfStockTitle : this.props.settings.themeConfigs.language.addToCartText;
                let cartButtonBackgroundColor = this.colorThemeConfigs.cartButtonBackgroundColor ? this.colorThemeConfigs.cartButtonBackgroundColor : '#34a853';
                let cartButtonTextColor = this.colorThemeConfigs.cartButtonTextColor ? this.colorThemeConfigs.cartButtonTextColor : '#ffffff';
                return (
                    <Button full
                        disabled={outOfStock}
                        onPress={this.addToCart}
                        style={{ backgroundColor: outOfStock ? 'gray' : cartButtonBackgroundColor, marginTop: 20, borderRadius: 5 }}>
                        <Text
                            style={{ color: outOfStock ? '#ffffff' : cartButtonTextColor, fontSize: 16, fontWeight: '500' }}>
                            {addToCartText}</Text>
                    </Button>
                )
            }
            const CollectionAlsoLikeProduct  = () => {
              if (this.props.widgetProps && this.props.widgetProps.collectionHandle) {
                return (
                  <AlsoLikeProduct settings={this.props.settings}
                      navigator={this.props.navigator}
                      collectionHandle={this.props.widgetProps.collectionHandle} />
                )
              }
              else return null
            }
            return (
                <Root>
                    <ScrollView style={styles.container}
                            contentContainerStyle={{ paddingBottom: Platform.OS == 'android' ? 80 : 10 }}>
                        {imageSwiper}
                        <View style={styles.productDescriptionWrap}>
                            <View style = {{alignItems: 'center'}}>
                              <Text style={[styles.productShortDesc, { color: this.productListThemeConfigs.titleTextColor || '#565656' }]}>
                                  {this.state.product.title || this.state.product.name}
                              </Text>
                            </View>
                            <View style={styles.productDescPriceWrap}>
                                {AppHelper.convertToInt(product.variants[0].compare_at_price) > 0 ? <Text style={[styles.productPriceDel, { color: this.productListThemeConfigs.priceCompareTextColor || '#959595' }]}>
                                    { AppHelper.formatMoney(product.variants[0].compare_at_price * 100, this.props.settings.siteConfigs.currency) }</Text> : null}
                                <Text
                                    style={[styles.productPriceIns, { color: this.productListThemeConfigs.priceTextColor || '#c40808' }]}>
                                    { AppHelper.formatMoney(this.state.product.variants[0].price * 100, this.props.settings.siteConfigs.currency) }
                                </Text>
                            </View>

                            <View style={styles.productOptionsWrap}>
                                {productOptionPicker()}
                                {addToCartButton()}
                            </View>
                            {productDetailWidget()}
                        </View>
                        <View style={styles.hrLine} />
                        { CollectionAlsoLikeProduct() }
                    </ScrollView>
                </Root>
            );
          }
      }
  }

  renderLoadingView() {
      return (
          <View style={styles.loading}>
              <ActivityIndicator
                  size='small' />
          </View>
      );
  }

  renderEmptyView() {
      return (
          <View style={styles.loading}>
              <Text style={{ color: '#7f7f7f' }}>{ Language.t('noResult') }</Text>
          </View>
      );
  }
  toShopifyProductDescriptionModal(description) {
    this.props.navigator.showModal({
      backButtonHidden: configs.RTL,
      screen: "gikApp.ShopifyProductDescriptionScreen", // unique ID registered with Navigation.registerScreen
      title: Language.t('detail'), // title of the screen as appears in the nav bar (optional)
      passProps: {
        settings: this.props.settings,
        description}, // simple serializable object that will pass as props to the modal (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    });
  }
}



var widthItem = (width / 2);
var heightItem = 1.8 * widthItem;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: width,
      backgroundColor: "#ffffff",
      paddingTop: Platform.OS == 'android' ? 70 : 10
  },
  hrLine: {
      height: 8,
      backgroundColor: '#efefef'
  },
  slide: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent'
  },
  productDescriptionWrap: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 25
  },
  socialGroupWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 30,
      paddingBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: '#efefef'
  },
  socialButtonViewOne: {
      flex: 1,
      alignItems: 'center',
  },
  socialButtonIcon: {
      textAlign: 'center',
      alignItems: 'center',
      marginBottom: 15
  },
  socialButtonTitle: {
      fontWeight: 'bold',
      textAlign: 'center',
      alignItems: 'center',
  },
  productDescPriceWrap: {
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
  },
  productPriceIns: {
      fontSize: 24,
      lineHeight: 24,
      color: '#ab0c00',
  },
  productPriceDel: {
      fontSize: 16,
      marginRight: 10,
      textDecorationLine: 'line-through'
  },
  productShortDesc: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 20,
      fontWeight: '500'
  },
  buttonCart: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      lineHeight: 45,
      backgroundColor: '#34a853',
      color: '#ffffff'
  },
  productInfoWrap: {
      paddingLeft: 15,
      paddingRight: 15
  },
  itemListViewStyle: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#efefef'
  },
  itemListViewTitle: {
      color: '#000',
      fontSize: 16,
      lineHeight: 55,
  },
  productOptionsWrap: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  horizontalScrollViewWrap: {
      paddingTop: 25,
      paddingBottom: 25,
      paddingLeft: 15,
      paddingRight: 15
  },
  horizontalScrollViewTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 25
  },
  viewFlex: {
      flex: 1,
      marginTop: 3,
      marginBottom: 3,
      flexDirection: 'row',
      alignItems: 'center',
      height: heightItem,
  },
  viewOne: {
      width: (width / 2) - 5,
      height: heightItem,
      backgroundColor: "#ffffff"
  },
  productPriceWrap: {
      marginTop: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  productPrice: {
      fontWeight: '500',
      fontSize: 16
  },
  productName: {
      fontSize: 16,
      fontWeight: '300',
      color: '#999'
  },
  productIconFavourite: {
      marginRight: 15,
      fontWeight: 'bold'
  },
  loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
  },
  shortDescriptionWrap: {
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  shortDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
    textAlign: 'left'
  },
  shortDescriptionReadmore: {
    fontWeight: 'bold',
    color: "#2196F3",
    marginTop: 10,
    textAlign: 'left'
  }
});
