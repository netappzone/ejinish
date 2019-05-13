import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    FlatList,
    ActivityIndicator
} from 'react-native';

import { AppHelper, ShopifyService } from '@services';
const { height, width } = Dimensions.get('window');
import FastImage from 'react-native-fast-image';
import { Actions } from '@actions';
import Language from '@language';

export default class CollectionColumn4Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataSource: [],
            error: false
        }
        this.entries = [];
        this.imageWidth = (width / 2) - 14;
        this.productListThemeConfigs = this.props.settings.themeConfigs.product_list;
        this.productImageNewSize = AppHelper.resizeImage(this.productListThemeConfigs.image_width, this.productListThemeConfigs.image_height, this.imageWidth);
        this.toAction = this.toAction.bind(this);
    }
    componentDidMount() {
        if (this.props.widget) {
            this.getSimpleProducts();
        }
    }

    getSimpleProducts = () => {
        ShopifyService.getProducts(this.props.widget.id, 'manual').then((result) => {
            this.entries = this.entries.concat(result.products);
            this.setState({
                dataSource: this.entries,
                loading: false, error: false
            })
        }).catch((error) => {
            console.log("error", error);
            this.setState({ loading: false, error: true })
        })
    }

    renderRow = (data) => {
        let item = data.item;
        if (item){
        const soldOut = () => {
            if (!item.available) {
                return (
                    <View style={styles.soldOut}>
                        <Text style={styles.soldOutText}>{this.props.settings.themeConfigs.language.productOutOfStockTitle}</Text>
                    </View>
                )
            } else {
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
          } else {
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
                        style={{ alignItems: "center", width: this.productImageNewSize.width - 20, height: this.productImageNewSize.height}}
                        resizeMode={FastImage.resizeMode.contain} />
                </View>
                <View style = {styles.productDesc}>
                    <Text style={[
                        styles.title, { marginTop: 10, fontWeight:'500'}]} numberOfLines = {1}>
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
                    onPress={() => this.toShopifyProductDetail({
                                                    handle: item.handle,
                                                    title: item.title,
                                                    collectionHandle: this.props.widget.id})}>
                    {productCard()}
                    {soldOut()}
                    {onSale()}
                </TouchableOpacity>
            </View>
        )
      }
      else return null
    }



    render() {
        if (this.props.widget.id) {
            if (this.state.loading) {
                return this.renderLoadingView();
            } else {
                if (this.state.error) {
                    return this.renderError();
                } else {
                    return (
                        <View style={styles.container}>
                            <View style = {styles.header}>
                              <View>
                                  <Text style = {[styles.headerText, {fontWeight: 'bold', fontSize: 20}]}>
                                    {this.props.widget.title}
                                  </Text>
                              </View>
                              <View>
                                <TouchableOpacity key={AppHelper.newGuid() } onPress={this.toAction} >
                                  <Text style = {styles.headerText}>{ Language.t('viewAll') } > </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <FlatList
                                data={this.state.dataSource}
                                renderItem={(data) => this.renderRow(data)}
                                enableEmptySections={true}
                                numColumns={4}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.viewFlex}
                            />
                        </View>
                    )
                }
            }
        } else { return null; }
    }
    toAction() {
      if (!AppHelper.isNullOrEmpty(this.props.widget)) {
        let options = {
          collection: {
            handle: this.props.widget.id,
          },
          settings: this.props.settings
        }
        Actions.toCollectionScreen(options, this.props.navigator)
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

    renderError() {
        return (
            <View style={styles.loading}>
                <Text style={{ color: '#7f7f7f', fontSize: 13 }}>{this.props.settings.themeConfigs.language.dataEmptyText}</Text>
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
  wrapper: {
    flex: 1
  },
  container: {
    width: width,
    backgroundColor: "#fff",
    marginBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    padding: 10
  },
  viewFlex: {
    width: width - 4,
    marginLeft: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
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
    marginBottom: 5,
    color: '#222',
    textAlign: 'left'
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100
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
    top: 10,
    backgroundColor: '#8f45ff',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5
  },
  onSale: {
    position: 'absolute',
    right: 5,
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
  horizontalScrollViewWrap: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#ffffff',
  },
  horizontalScrollViewTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  productItem: {
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10
  },
  productImages: {
    padding: 15
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
