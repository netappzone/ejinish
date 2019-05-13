import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  ScrollView
} from 'react-native';

import { AppHelper, Device } from '@services';
const { height, width } = Dimensions.get('window');
import FastImage from 'react-native-fast-image';
import Language from '@language';
import Swiper from 'react-native-swiper';
import { settingDefault } from '@settings';

export default class TabPageDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageList: settingDefault.HOMEPAGES_SHOPIFY
    }
  }

  Slide = () => {
    let slideData = this.state.pageList[0],
        data = slideData.data,
        widgetHeightScale = Math.ceil(AppHelper.convertToInt((slideData.height / slideData.width) * 414, 120) * Device.scale);
    return (
      <View style={{ height: widgetHeightScale }}>
        <Swiper loadMinimal loadMinimalSize={3} style={styles.swiperWrapper}
              loop={true}
              width={width}
              height={widgetHeightScale}
              contentContainerStyle={styles.swiperWrapper}
              showsPagination={true} 
              showsButtons={false}
        >
          {
            data.map((item, i) => {
              return (
                <TouchableOpacity style={styles.slide} i={i} key={i} >
                  <FastImage style={[styles.swiperImage, {height: widgetHeightScale}]} 
                              source={item.imgUrl} />
                </TouchableOpacity>
              )
            })
          }
        </Swiper>
      </View>
    )
  }

  CollectionModule = () => {
    let collectionData = this.state.pageList[1],
        data = collectionData.data,
        imageWidth = (width / 2) - 14,
        productListThemeConfigs = settingDefault.themeConfigs.product_list,
        productImageNewSize = AppHelper.resizeImage(productListThemeConfigs.image_width, productListThemeConfigs.image_height, imageWidth);

    renderRow = result => {
      console.log('product: ', result.item);
      let product = result.item;
      return (
        <View style = {{width: (width / 2) - 2, marginBottom: 0, backgroundColor: "#fff", 
                        borderWidth: 0.5, borderColor: "#eee"}}>
          <View style = {styles.collectionProductItem}>
            <View style = {styles.collectionProductImages}>
              <FastImage
                  source={product.featured_image }
                  style={{ alignItems: "center", width: productImageNewSize.width - 20, height: productImageNewSize.height - 20}}
                  resizeMode={FastImage.resizeMode.contain} />
            </View>
            <View>
              <Text style={[styles.collectionProductTitle, { marginTop: 10, fontWeight:'500'}]} numberOfLines = {1}>
                {product.title}
              </Text>
              <Text style={[styles.collectionProductTitle, { fontSize: 13}]} numberOfLines = {1}>
                {product.vendor}
              </Text>
              <View style = {styles.collectionProductPriceWraper}>
                <Text style={[styles.collectionProductPriceIns, { color: productListThemeConfigs.priceTextColor || '#c40808' }]}>
                  {product.price_format}
                </Text>
                {
                  product.compare_at_price != 0.0000 
                  ? <Text style={[styles.collectionProductPriceDel, { color: productListThemeConfigs.priceCompareTextColor || '#959595' }]}>
                    {product.compare_at_price_format}
                  </Text>
                  : null
                }
              </View>
            </View>
          </View>
        </View>
      )
    }
    
    return (
      <View style={styles.collectionContainer}>
        <View style = {styles.collectionHeader}>
          <View>
            <Text style = {[styles.collectionHeaderText, {fontWeight: 'bold', fontSize: 20}]}>
              { collectionData.title }
            </Text>
          </View>
          <View>
            <TouchableOpacity key={AppHelper.newGuid() } >
              <Text style = {styles.collectionHeaderText}>{ Language.t('viewAll') } > </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={(data) => renderRow(data)}
            enableEmptySections={true}
            horizontal = {true}
            keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.Slide()}
        {this.CollectionModule()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  swiperWrapper: {
    marginTop: 3,
    marginBottom: 3
  },
  swiperImage: {
    width,
    backgroundColor: '#fff'
  },
  collectionContainer: {
    width,
    backgroundColor: "#fff",
    marginBottom: 10
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  collectionHeaderText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    padding: 10
  },
  collectionProductItem: {
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10
  },
  collectionProductImages: {
    padding: 15
  },
  collectionProductTitle: {
    marginBottom: 5,
    color: '#222',
    textAlign: 'left'
  },
  collectionProductPriceWraper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  collectionProductPriceIns: {
    color: '#000',
    fontWeight: 'bold',
    marginRight: 15
  },
  collectionProductPriceDel: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    color: '#aaa'
  }
})