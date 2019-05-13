import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Styles from './Styles'
import { AppHelper } from '@services';
import FastImage from 'react-native-fast-image';
import Language from '@language';
import { configs } from '@settings';

var _ = require('lodash');
var _dataLayout = [
  {
    title: Language.t('cardLayout'),
    iconLink: require("@images/layout_card.png"),
    value: "Card"
  },
  {
    title: Language.t('twoColumn'),
    iconLink: require("@images/layout_2columns.png"),
    value: "TwoColumn"
  },
  {
    title: Language.t('threeColumn'),
    iconLink: require("@images/layout_3columns.png"),
    value: "ThreeColumn"
  },
  {
    title: Language.t('portfolio'),
    iconLink: require("@images/layout_portfolio.png"),
    value: "Portfolio"
  },
  {
    title: Language.t('portfolio2'),
    iconLink: require("@images/layout_portfolio.png"),
    value: "PortfolioType2"
  },
  {
    title: Language.t('listLayout'),
    iconLink: require("@images/layout_list.png"),
    value: "List"
  },
  {
    title: Language.t('featurePost'),
    iconLink: require("@images/layout_featured.png"),
    value: "FeaturePost"
  },
  {
    title: " ",
    iconLink: " ",
    value: " "
  },
  {
    title: " ",
    iconLink: " ",
    value: " "
  },
  {
    title: " ",
    iconLink: " ",
    value: " "
  },
  {
    title: " ",
    iconLink: " ",
    value: " "
  },
  {
    title: " ",
    iconLink: " ",
    value: " "
  }
]

export default class ArticleLayoutModal extends Component {
    static navigatorButtons = configs.RTL
    ?
    {
      rightButtons: [
        {
          id: "closeProductSortModal",
          icon: require('@images/cross.png')
        }
      ]
    }
    :
    {
      leftButtons: [
        {
          id: "closeProductSortModal",
          icon: require('@images/cross.png')
        }
      ]
    }

    constructor(props) {
        super(props);
        const dataSource = _dataLayout
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.id == 'closeProductSortModal') {
            this.props.navigator.dismissModal({
                animationType: 'fade'
            });
        }
    }

    onLayout(layout) {
      this.props.layoutProps.callback(layout);
      this.props.navigator.dismissModal({
        animationType: 'fade'
      });
    }

    _renderItem(item) {
      if (item.value != ' ' && !AppHelper.isNullOrEmpty(item.value) )  {
        return (
          <TouchableOpacity onPress={ this.onLayout.bind(this, item.value) }>
              <View style = {Styles.layoutModalItem}>
                <FastImage 
                      source={ item.iconLink }
                      style={Styles.layoutItemImage} />
                <Text style={Styles.layoutItemText}>{item.title}</Text>
              </View>
          </TouchableOpacity>
        )
      }
      else {
        return (
          <View style = {Styles.layoutModalItem} />
        )
      }
    }

    render() {
        return (
            <View style={Styles.container}>
              <FlatList
                  numColumns={3}
                  keyExtractor={(item, index) => (index.toString())}
                  contentContainerStyle={Styles.layoutModalContainer}
                  data= {_dataLayout}
                  renderItem={ ({item}) => this._renderItem(item) }
                  enableEmptySections = {true}
                  />
            </View>
        );
    }
}
