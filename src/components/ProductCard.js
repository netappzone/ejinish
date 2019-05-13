import React, { Component } from 'react';
import {
    Dimensions,
    View, 
    Text,
    TouchableOpacity
} from 'react-native';
var {height, width} = Dimensions.get('window');
import { AppHelper } from '@services';
import FastImage from 'react-native-fast-image';

var itemWidth = width / 2;

export default class ProductCard extends Component  {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <TouchableOpacity containerStyle = {this.props.itemStyle}>
            <TouchableOpacity key = {AppHelper.newGuid()} onPress = {this.props.onPress}>
            <View style = {styles.productItem}>
                <View style = {styles.productImages}>
                    <FastImage source={{uri: this.props.productImages}} 
                        style={{width: itemWidth, height: itemWidth}} 
                        resizeMode={FastImage.resizeMode.contain}/>
                </View>
                <View style = {styles.productDesc}>
                <Text style={{marginBottom: 5, marginTop: 10, color: '#222', fontSize: 16, fontWeight:'bold'}} numberOfLines = {1}>
                    {this.props.productVendor}
                </Text>
                <Text style={{marginBottom: 5, color: '#222', fontSize: 14}} numberOfLines = {1}>
                    {this.props.productName}
                </Text>

                <View style = {styles.productPriceWraperStyle}>
                    <Text style = {styles.productPriceIns}>{this.props.productPriceIns}</Text>
                    <Text style = {styles.productPriceDel}>{this.props.productPriceDel}</Text>
                </View>
                </View>
            </View>
            </TouchableOpacity>
        </TouchableOpacity>
        )
    }
}

const styles = {
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
    reviewStarsGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 10
    }
}
