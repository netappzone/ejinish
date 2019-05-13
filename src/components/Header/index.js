import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Actions } from '@actions';
import FastImage from 'react-native-fast-image';
import { configs } from '@settings';
import Language from '@language';
const { height, width } = Dimensions.get('window');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: ""
    }
  }
  _onPressButton() {
    this.props.navigator.toggleDrawer({
      side: configs.RTL ? 'right' : 'left',
      animated: true,
    });
  }

  render() {
    return (
      <View style={[styles.container, {
            backgroundColor: this.props.settings.themeConfigs.color.navBarBackgroundColor,
            borderBottomColor: this.props.settings.themeConfigs.color.navBarButtonColor }]}>
        <View style={styles.row}>
          <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 20 }}
                       onPress={this._onPressButton.bind(this) }>
              <Ionicons name="ios-menu" size={32}
                    color={this.props.settings.themeConfigs.color.navBarButtonColor}/>
          </TouchableOpacity>
          <View style={{ paddingLeft: 0 }}>
          {
            this.props.settings.themeConfigs.header.use_header_logo
            ?
            <FastImage  source={{uri: this.props.settings.themeConfigs.header.header_logo}}
                        style = {{ width: this.props.settings.themeConfigs.header.header_logo_width,
                                    height: this.props.settings.themeConfigs.header.header_logo_height }}
                        resizeMode={FastImage.resizeMode.contain}/>
            :
            <Text style = {[styles.navBarText,
                  {color: this.props.settings.themeConfigs.color.navBarTextColor }]}>
            {this.props.title}
            </Text>
          }
          </View>
          <TouchableOpacity style={{ paddingRight: 15, paddingLeft: 20 }}
                    onPress={Actions.toSearchScreen.bind(this, { settings: this.props.settings }, this.props.navigator) }>
            <Ionicons name="ios-search" size={30}
                  color={this.props.settings.themeConfigs.color.navBarButtonColor}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
};

Header.propTypes = {
  title: PropTypes.string
}

Header.defaultProps = {
  title: Language.t('home')
}

var styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'android' ? 54 : 74,
    borderBottomWidth: 1
  },
  row: {
    flex: 1,
    marginTop: (Platform.OS == 'ios' && (height === 812 || width === 812)) ? 20 : 0,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  searchRow: {
    marginRight: 10,
    flex: 1,
    flexDirection: 'row',
    marginRight: 10
  },
  textInput: {
    fontSize: 15,
    paddingLeft: 5,
    paddingRight: 5,
    height: 30
  },
  logo: {
    width: 30, height: 30,
    borderRadius: 17
	},
  navBarText: {
    fontSize: 16
  },
  navBarTextColor: {}
});
