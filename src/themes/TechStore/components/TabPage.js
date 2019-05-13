import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { AppHelper } from '@services';

// phong.nguyen 20161013: wordpress integration...
import { Banner, CollectionScrollHorizontal, CollectionColumn3Items,
          CollectionColumn4Items, ImagesSwipper, TabPageDemo } from '@components';

export default class TabPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      widgets: []
    };
  }
  componentWillMount() {
    this.setState({
      widgets: this.props.widgets,
      loaded: true
    });
  }

  renderWidgets(widget) {
    let settings = this.props.settings;
    switch(widget.type) {
      case "collection_image":
        return (
          <Banner settings={settings} navigator={this.props.navigator} widgetWitdh={widget.width}
              widgetHeight={widget.height} widget={widget} key={AppHelper.newGuid() } />
        );
      case "collectionScrollHorizontal":
        return (
          <CollectionScrollHorizontal settings={settings} navigator={this.props.navigator}
              widgetWitdh={widget.width} widgetHeight = {widget.height} widget={widget} key={AppHelper.newGuid() } />
        );
      case "imagesSwipper":
        return (
          <ImagesSwipper settings={settings} navigator={this.props.navigator}
              widgetWitdh={widget.width} widgetHeight={widget.height}
              widget={widget} key={AppHelper.newGuid() } />
        );
      case "CollectionColumn3Items":
        return (
          <CollectionColumn3Items settings={settings} navigator={this.props.navigator}
              widgetWitdh={widget.width} widgetHeight={widget.height}
              widget={widget} key={AppHelper.newGuid() } />
        );
      case "collection_column_4_items":
        return (
          <CollectionColumn4Items settings={settings} navigator={this.props.navigator}
              widgetWitdh={widget.width}
              widgetHeight={widget.height}
              widget={widget} key={AppHelper.newGuid() } />
        );
      default:
        break;
    }
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      this.state.widgets.length > 1
      ?
      <ScrollView style={styles.container}>
        {this.state.widgets.map(widget => this.renderWidgets(widget)) }
      </ScrollView>
      :
      <TabPageDemo />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='small'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});
