import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { AppHelper } from '@services';
var _ = require('lodash');
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import { configs, settingDefault } from '@settings';
import { Actions } from '@actions';
import Language from '@language';

export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    let hasMenu = (this.props.settings.SECTIONS_MENU_SHOPIFY && this.props.settings.SECTIONS_MENU_SHOPIFY.length > 0)
                  ? true
                  : false;
    let SECTIONS_MENU_SHOPIFY = (this.props.settings.SECTIONS_MENU_SHOPIFY && this.props.settings.SECTIONS_MENU_SHOPIFY.length > 0)
                                    ? this.props.settings.SECTIONS_MENU_SHOPIFY
                                    : settingDefault.SECTIONS_MENU_SHOPIFY;
    this.state = {
      hasMenu,
      loaded: false,
      settingMenu: SECTIONS_MENU_SHOPIFY,
      sections: SECTIONS_MENU_SHOPIFY,
      sectionCurrent: null,
    }
    this.redirectHome = this.redirectHome.bind(this);
    this.backHistory = this.backHistory.bind(this);
  }

  renderRow(item) {
    return (
      <View key={AppHelper.newGuid() } style={[styles.row, { borderBottomColor: this.props.settings.themeConfigs.color.menuBorderColor }]}>
        {
          item.icon
            ?
            <View style={styles.menuIcon}>
                <FastImage
                    style={{ width: item.iconWidth, height: item.iconHeight }} resizeMode={FastImage.resizeMode.contain}
                    source={this.state.hasMenu ? { uri: item.icon } : item.icon}
                    />
            </View>
            : false
        }
        <TouchableOpacity style={styles.sectionName}
                            onPress={ this.toSection.bind(this, item) }>
          <View>
            <Text style={[styles.menuTitle, { color: this.props.settings.themeConfigs.color.menuTextColor }]}>{item.name}</Text>
          </View>
        </TouchableOpacity>
        {
          item.children.length > 0
          ?
          <TouchableOpacity style={styles.arrowChild} onPress={ this.toChildren.bind(this, item) }>
            <View>
              {
                configs.RTL
                ?
                <Icon style={styles.arrow} name="ios-arrow-back" size={25}
                        color={this.props.settings.themeConfigs.color.menuTextColor} />
                :
                <Icon style={styles.arrow} name="ios-arrow-forward" size={25}
                        color={this.props.settings.themeConfigs.color.menuTextColor} />
              }
            </View>
          </TouchableOpacity>
          :
          null
        }
        
      </View>
    );
  }

  render() {
    return (
      <ScrollView animation="bounceInUp" duration={800} delay={1400}
          style={{ backgroundColor: this.props.settings.themeConfigs.color.menuBackgroundColor || '#fff',
                minWidth: 280 }}>
        { this.props.settings.themeConfigs.side_menu.use_menu_logo &&
          <View style={[styles.containerLogo,
                      { backgroundColor: this.props.settings.themeConfigs.side_menu.logo_background_color }]} >
            <FastImage style={{
                    width: this.props.settings.themeConfigs.side_menu.logo_width,
                    height: this.props.settings.themeConfigs.side_menu.logo_height}}
                    source={{uri: this.props.settings.themeConfigs.side_menu.logo_image}}
                    resizeMode={FastImage.resizeMode.contain}/>
          </View>
        }
        <View style={[styles.sidemenu, { backgroundColor: this.props.settings.themeConfigs.color.menuBackgroundColor }]}>
          <Animatable.View ref="view">
            {
              this.state.sectionCurrent != null
              ?
              <View key={AppHelper.newGuid() } style={[styles.row, { borderBottomColor: this.props.settings.themeConfigs.color.menuBorderColor }]}>
                  <TouchableOpacity style={styles.sectionName} onPress={ this.backHistory }>
                      <View>
                          <Text style={[styles.menuTitle, { color: this.props.settings.themeConfigs.color.menuTextColor }]}>
                              {Language.t('goBack')}
                          </Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.arrowChild} onPress={ this.backHistory }>
                      <View>
                          <Icon style={styles.arrow} name="ios-arrow-back" size={25} color={this.props.settings.themeConfigs.color.menuTextColor} />
                      </View>
                  </TouchableOpacity>
              </View>
              :
              null
            }
            {
              this.state.sections.map(item => this.renderRow(item))
            }
          </Animatable.View>
        </View>
      </ScrollView>
    );
  }

  redirectHome() {
    Actions.toHomeScreen(this.props.navigator, true);
  }

  toSection(item) {
    this.props.navigator.toggleDrawer({
      side: configs.RTL ? 'right' : 'left',
      animated: true
    });

    this.props.navigator.handleDeepLink({
      link: "section/" + item.source + '/' + item.linkType + '/' + item.id
    });
  }

  toChildren(item) {
    if (item.children.length > 0) {
      var current = _.clone(item);
      current.children = [];
      var children = _.clone(item.children);
      children.unshift(current);
      this.refs.view.lightSpeedIn(300);
      this.setState({
        sections: children,
        sectionCurrent: item
      });
    }
  }
  backHistory() {
    this.refs.view.fadeInLeft(300);
    this.setState({
      sections: this.state.settingMenu,
      sectionCurrent: null
    });
  }
}

const styles = StyleSheet.create({
  containerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 112,
    paddingTop: 10
  },
  sidemenu: {
    flex: 1,
    marginTop: 12
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    marginLeft: 16,
    height: 48,
  },
  menuIcon: {
    marginBottom: 12,
    marginTop: 10,
    marginRight: 12
  },
  menuTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '100',
    marginTop:12
  },
  arrow: {
    marginTop: 12,
  },
  sectionName: {
    flex: 8,
    alignItems: 'flex-start'
  },
  arrowChild: {
    flex: 2,
    alignItems: 'flex-end',
    paddingRight: 15
  }
});
