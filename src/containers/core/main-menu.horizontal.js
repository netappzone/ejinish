import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { AppHelper } from '@services';
import FastImage from 'react-native-fast-image';
import { Actions } from '@actions';
var _ = require('lodash');

export default class MainMenuHorizontal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            sections: [],
            sectionCurrent: null,
            Setting_Menu : this.props.settings.SECTIONS_MENU_HORIZONTAL_SHOPIFY
        }
    }

    componentWillMount() {

		this.setState({
			sections: this.state.Setting_Menu
		}) ;


        this.setState({
            loaded: false
        })
    }

    renderItem(item) {
        return (
        <TouchableOpacity key={AppHelper.newGuid() }
                    onPress={ item.children.length > 0 
                            ? this.toChildren.bind(this, item)
                            : this.toSection.bind(this, item) }
                    style={item.children.length > 0  ? '' : styles.sectionName}>
            <View key={AppHelper.newGuid() } style={styles.rowItem}>
                <FastImage
                    style={{ width: item.iconWidth, height: item.iconHeight}} resizeMode={FastImage.resizeMode.contain}
                    source={{ uri: item.icon }}
                    />
                <View>
                    <Text style={[styles.menuTitle, { color: this.props.settings.themeConfigs.color.menuHorizontalTextColor }]}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
        )
    }

    render() {
        return (
          <View style = {styles.container} >
            <ScrollView horizontal = {true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: this.props.settings.themeConfigs.color.menuHorizontalBackgroundColor }}>
                { this.state.sections.map((item) => this.renderItem(item)) }
            </ScrollView>
            </View>
        );
    }
 
    redirectHome() {
		Actions.toHomeScreen(this.props.navigator, true);
    }

    toSection(item) {
        this.props.navigator.handleDeepLink({
            link: "section/" + item.source + '/' + item.linkType + '/' + item.id + '/' + item.name
        });
    }
    toChildren(item) {
        if (item.children.length > 0) {
            var current = _.clone(item);
            current.children = [];
            var children = _.clone(item.children);
            this.props.navigator.push({
              screen: 'gikApp.MainMenuHorizontalLevel2',
              title: item.name,
              passProps: {
                sections: children,
                sectionCurrent: item,
                settings: this.props.settings
              }
            })
        }
    }
}

const styles = StyleSheet.create({
  container: {

  },
  rowItem: {
      padding: 10,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  menuTitle: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '100',
      marginTop:5
  }
});
