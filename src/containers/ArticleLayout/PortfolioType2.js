'use strict';
import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import FastImage from 'react-native-fast-image';
import styles from "./Styles";

export default class PortfolioType2Layout extends Component {
  render() {

    const {imageURL, title, date, onPress} = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
          <View style={styles.itemPortfolioType2ContainerStyle}>
              <FastImage source={{uri: imageURL}}
                  style={styles.itemPortfolioType2Thumbnail}
                  />
              <View style={styles.itemPortfolioType2TitleContainerStyle}>
                  <Text numberOfLines={1} style={styles.itemPortfolioType2Title}>{title}</Text>
                  <Text numberOfLines={1} style={styles.itemPortfolioType2SubTitle}>{date}</Text>
              </View>
          </View>
      </TouchableOpacity>
    );
  }
}
