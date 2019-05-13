import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
var _ = require('lodash');
import Language from '@language';
import { configs } from '@settings';

var _dataSort = [
  {
    title: Language.t('featured'),
    value: "manual"
  },
  {
    title: Language.t('bestSelling'),
    value: "best-selling"
  },
  {
    title: Language.t('alphabetAZ'),
    value: "title-ascending"
  },
  {
    title: Language.t('alphabetZA'),
    value: "title-descending"
  },
  {
    title: Language.t('priceLowToHigh'),
    value: "price-ascending"
  },
  {
    title: Language.t('priceHighToLow'),
    value: "price-descending"
  },
  {
    title: Language.t('dateNewToOld'),
    value: "created-descending"
  },
  {
    title: Language.t('dateOldToNew'),
    value: "created-ascending"
  }
]

export default class ProductSortModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: _dataSort
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  static navigatorButtons = configs.RTL
  ?
  {
    backButtonHidden: configs.RTL,
    rightButtons: [
      {
        icon: require('@images/cross.png'),
        id: "close",
      }
    ]
  }
  :
  {
    leftButtons: [
      {
        icon: require('@images/cross.png'),
        id: "close",
      }
    ]
  }

  onNavigatorEvent(event) {
    if (event.id == 'close') {
      this.props.navigator.dismissModal({
        animationType: 'slide-down'
      });
    }
  }

  onSort(sortby) {
    this.props.sortProps.callback(sortby);
    this.props.navigator.dismissModal({
      animationType: 'slide-down'
    });
  }

  renderRow(data) {
    let dataItem = data.item;
    return (
      <TouchableOpacity style={styles.sortRow} onPress={ this.onSort.bind(this,dataItem.value) }>
          <View>
              <Text style={styles.sortText}>{dataItem.title}</Text>
          </View>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList contentContainerStyle = {styles.gridContainer}
                style={styles.itemListViewWrap}
                data={this.state.dataSource}
                renderItem={this.renderRow.bind(this)}
                enableEmptySections={true}
                keyExtractor={(item, index) => index.toString()}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  sortRow: {
    marginBottom: 1,
    justifyContent: "center",
    backgroundColor: '#ffffff',
    height: 50
  },
  sortText: {
        color: '#7b7b7b',
        paddingHorizontal: 15
  }
});
