'use strict';
import React, {Component} from "react";
import {Text, TouchableOpacity} from "react-native";
import FastImage from 'react-native-fast-image';
import styles from "./Styles";

export default class ThreeColumn extends Component {
  render() {

    const {imageURL, title, date, onPress} = this.props;

    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.itemThree} onPress={onPress}>
        <FastImage source={{uri: imageURL}} style={styles.imageItemThree} />
        <Text numberOfLines={2} style={styles.nameItemThree}>{title}</Text>
        <Text style={styles.timeItemThree}>{date}</Text>
      </TouchableOpacity>
    );
  }
}
