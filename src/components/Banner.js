import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Placeholder from 'rn-placeholder';
import { AppHelper, Device } from '@services';
import { Actions } from '@actions';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
import * as Progress from 'react-native-progress';
import ResponsiveImage from 'react-native-responsive-image';

export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      widgetHeight: AppHelper.convertToInt((this.props.widget.height / this.props.widget.width) * 414, 120),
      widgetHeightScale: Math.ceil(AppHelper.convertToInt((this.props.widget.height / this.props.widget.width) * 414, 120) * Device.scale)
    }
    this.toAction = this.toAction.bind(this);
  }
  componentWillMount() {
    if (this.props.widget && !AppHelper.stringIsEmpty(this.props.widget.imgUrl)) {
      this.setState({
        widget: this.props.widget,
        hasData: true
      });
    }
  }

  render() {
    if (!this.state.hasData) {
      return (
        <Placeholder.Box
                animate="fade"
                height={this.state.widgetHeightScale}
                width={'100%'}
                color={'#ddd'}
            />
      )
    }
    return (
      <TouchableOpacity key={AppHelper.newGuid() } onPress={this.toAction}>
        <View key={AppHelper.newGuid() } style={[styles.viewSingle, { height: this.state.widgetHeightScale }]} >
          <ResponsiveImage source={{ uri: this.state.widget.imgUrl }} initWidth="414" initHeight={this.state.widgetHeight}/>
        </View>
      </TouchableOpacity>
    );
  }

  toAction() {
    if (!AppHelper.isNullOrEmpty(this.props.widget)) {
      let options = {
        source: this.props.widget.linkType === 'external' ? 'external' : '',
        linkType: this.props.widget.linkType, 
        id: this.props.widget.id,
        settings: this.props.settings
      }
      Actions.redirectScreen(options, this.props.navigator)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  empty: {
    backgroundColor: "#F5FCFF",
    height: 120,
    marginTop: 3,
    marginBottom: 3
  },
  viewSingle: {
    width: width,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: "#f1f1f1"
  },
  imgSingle: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  }
});
