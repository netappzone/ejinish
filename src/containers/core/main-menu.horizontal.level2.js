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
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { Actions } from '@actions';
import { configs } from '@settings';

export default class MainMenuHorizontalLevel2 extends Component {
    static navigatorButtons = configs.RTL
    ?
    {
      leftButtons: [
        {
          icon: require('@images/search.png'), // for icon button, provide the local image asset name
          id: 'search' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        }
      ],
      rightButtons: [
        {
          id: 'back',
          icon: require('@images/md-arrow-forward.png'),
        }
      ]
    }
    :
    {
      leftButtons: [
        {
          id: 'back',
          icon: require('@images/md-arrow-back.png'),
        }
      ],
      rightButtons: [
        {
          icon: require('@images/search.png'), // for icon button, provide the local image asset name
          id: 'search' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        }
      ]
    }
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            sections: this.props.sections,
            sectionCurrent: null
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    state = {
       activeSection: false,
       collapsed: true
   };
   onNavigatorEvent(event) {
       if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
         if (event.id === 'cart') { // this is the same id field from the static navigatorButtons definition
           this.props.navigator.switchToTab({
             tabIndex: 1
           })
         }
         else if (event.id === 'search') {
            Actions.toSearchScreen({settings: this.props.settings }, this.props.navigator);
         }
         else if(event.id === 'back') {
           Actions.toPreviousScreen(this.props.navigator);
         }
       }
   }

    componentWillMount() {
        this.setState({
            loaded: false
        })
    }
    _toggleExpanded = () => {
     this.setState({ collapsed: !this.state.collapsed });
   }

   _setSection(section) {
     this.setState({ activeSection: section });
   }

   _renderHeader(section, i, isActive) {

    if (section.children.length > 0) {
      return (
        <Animatable.View duration={200}
        >
          <View style = {styles.headerView}>
            <Text style = {styles.headerText}>{section.name}</Text>
            <Text style = {styles.menuIcon}> {isActive ? "-" :  "+"} </Text>
          </View>
        </Animatable.View>
      );
    }
    else {
      return (
        <View>
          <TouchableOpacity onPress={ this.toSection.bind(this, section) }>
            <View style = {styles.headerView}>
              <Text style = {styles.headerText}>{section.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

  }
  _renderContent(section, i, isActive) {
    if (section.children.length > 0) {
      _children = section.children;

      return <Animatable.View duration={200} easing="ease-out">
        { _children.map((item) => this.renderSubMenu(item)) }
      </Animatable.View>
    }
    else {
      _children = "";
      return <View />
    }
  }

    renderSubMenu(item) {
        return (
            <View key={AppHelper.newGuid() } style={styles.subMenuContainer}>
                <TouchableOpacity onPress={ this.toSection.bind(this, item) }>
                    <View>
                        <Text style={styles.subMenuText}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <ScrollView
                style={{ backgroundColor: this.props.settings.themeConfigs.color.menuBackgroundColor }}>
                <Accordion
                    activeSection={this.state.activeSection}
                    sections={this.state.sections}
                    renderHeader={this._renderHeader.bind(this)}
                    renderContent={this._renderContent.bind(this)}
                    duration={200}
                    onChange={this._setSection.bind(this)}
                    underlayColor = "transparent"
                  />
            </ScrollView>
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
            sections: this.props.sections,
            sectionCurrent: null
        });
    }
}

const styles = StyleSheet.create({
    containerLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        height:112,
    },
    sidemenu: {
        flex: 1,
        marginTop: 12
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        marginLeft: 16,
        marginRight: 16,
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 15,
        fontWeight: '500'
    },
    menuIcon: {
        fontSize: 24,
        color: '#222'
    },
    menuTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '100',
        marginTop:12
    },
    subMenuContainer: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: 40,
      marginRight: 16,
      height: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    subMenuText: {
      fontSize: 15,
      fontWeight: '500'
    }

});
