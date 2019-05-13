import React, {
  PropTypes,
} from 'react';
import {
  Text,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};

const TabIcon = (props) => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: -5,
  }}>
    <Icon style={{ color: props.selected ? '#ffffff' : '#ffffff' }} name={props.iconName || "circle"} size={25}/>
    <Text style={{ color: props.selected ? '#ffffff' : '#ffffff', fontSize: 10 }}>{props.title}</Text>
  </View>
);

TabIcon.propTypes = propTypes;

export default TabIcon;
