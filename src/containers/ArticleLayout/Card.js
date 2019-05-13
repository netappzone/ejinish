'use strict';
import React, {Component} from "react";
import {Text, TouchableOpacity} from "react-native";
import FastImage from 'react-native-fast-image';
import styles from "./Styles";

export default class CardLayout extends Component {
  render() {

    const {imageURL, title, date, onPress} = this.props;

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.itemCard} onPress={onPress}>
            <FastImage source={{uri: imageURL}} style={styles.imageItemCard} />
            <Text numberOfLines={2} style={styles.nameItemCard}>{title}</Text>
            <Text style={styles.timeItemCard}>{date}</Text>
        </TouchableOpacity>
    );
  }
}
