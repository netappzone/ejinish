'use strict';
import React, {Component} from "react";
import {Text, TouchableOpacity} from "react-native";
import FastImage from 'react-native-fast-image'
import styles from "./Styles";

export default class TwoColumn extends Component {
  render() {

    const {imageURL, title, date, onPress} = this.props;

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.itemTwo} onPress={onPress}>
            <FastImage source={{uri: imageURL}} style={styles.imageItemTwo} />
            <Text numberOfLines={2} style={styles.nameItemTwo}>{title}</Text>
            <Text style={styles.timeItemTwo}>{date}</Text>
        </TouchableOpacity>
    );
  }
}
