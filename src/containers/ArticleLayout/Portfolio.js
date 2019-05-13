'use strict';
import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import FastImage from 'react-native-fast-image';
import styles from "./Styles";

export default class PortfolioLayout extends Component {
  render() {

    const {imageURL, title, date, onPress} = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
          <View style={styles.itemPortfolioContainerStyle}>
              <FastImage source={{uri: imageURL}}
                  style={styles.itemPortfolioThumbnail}
                  />
              <View style={styles.itemPortfolioTitleContainerStyle}>
                  <Text numberOfLines={2} style={styles.itemPortfolioTitle}>{title}</Text>
                  <Text numberOfLines={1} style={styles.itemPortfolioSubTitle}>{date}</Text>
              </View>
          </View>
      </TouchableOpacity>
    );
  }
}
