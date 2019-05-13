import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import Language from '@language';
import { configs } from '@settings';

var _ = require('lodash');

var _dataSort = [
  {
    title: Language.t('orderTitleASC'),
    orderPost: "asc",
    orderBy:'title'
  },
  {
    title: Language.t('orderTitleDESC'),
    orderPost: "desc",
    orderBy:'title'
  }
]

export default class ArticleSortModal extends Component {
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

    onNavigatorEvent(event) {
        if (event.id == 'closeProductSortModal') {
            this.props.navigator.dismissModal({
                animationType: 'slide-down'
            });
        }
    }

    componentDidMount() {

    }

    onSort(orderPost, orderBy) {

        this.props.sortProps.callback(orderPost, orderBy);
        this.props.navigator.dismissModal({
            animationType: 'slide-down'
        });
    }

    renderRow(data) {
        let dataItem = data.item;
        return (
            <TouchableOpacity style={styles.sortRow} onPress={ this.onSort.bind(this,dataItem.orderPost, dataItem.orderBy) }>
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
        paddingLeft: 15,
        textAlign: 'left'
    }
});
