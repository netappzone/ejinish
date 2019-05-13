'use strict';
import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import FastImage from 'react-native-fast-image';
import styles from "./Styles";

export default class ArticleDefaultLayout extends Component {
    render() {

        const {imageURL, title, date, onPress} = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.defaultAcitleContainerStyle}>
                    <View   style={styles.defaultAcitleThumbnailContainer}>
                        <FastImage source={{uri: imageURL}}
                            style={styles.defaultAcitleThumbnail}
                        />
                        </View>
                    <View style={styles.defaultAcitleTitleContainerStyle}>
                        <Text numberOfLines={2} style={styles.defaultAcitleTitle}>{title}</Text>
                        <Text numberOfLines={1} style={styles.defaultAcitleSubTitle}>{date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
