import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import TabPage from '../components/TabPage';
var { height, width } = Dimensions.get('window');
import MainMenuHorizontal from '@containers/core/main-menu.horizontal';
import { Header } from '@components';
var _ = require('lodash');
import { AppHelper } from '@services';
import { Actions } from '@actions';

export default class TheTechStoreThemeLayout extends Component {
    static navigatorStyle = {
        drawUnderTabBar: false
    };

    static navigatorButtons = {
      leftButtons: [
        {
          icon: require('@images/menu.png'), // for icon button, provide the local image asset name
          id: 'sideMenu'
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
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            Setting_Menu: this.props.settings.SECTIONS_MENU_SHOPIFY,
            pageList: [],
            loaded: false
        }
    }
    onNavigatorEvent(event) {
        // handle a deep link section
        if (event.type == 'DeepLink') {
            const parts = event.link.split('/');
            if (parts[0] == 'section') {
                let options = {
                    source: parts[1],           // source (shopify || wordpress)
                    linkType: parts[2],         // linkType (collection || article)
                    id: parts[3],               // handle (handle || id)
                    settings: this.props.settings
                }
                Actions.redirectScreen(options, this.props.navigator);
            } 
            else if (parts[0] == "homeredirect") {
                this.props.navigator.switchToTab({
                    tabIndex: 0
                });
                this.props.navigator.popToRoot({
                    animated: false
                });
            }
            else if (parts[0] == 'searchpage') {
                let options = {
                    objNavigator: this.props.navigator,
                    source: 'wordpress',
                    linkType: 'page_search',
                    id: parts[1],
                    title: 'Search: ' + parts[1],
                    settings: options.settings
                }
                
                Actions.redirectScreen(options);

            }
        }
      else if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
        if (event.id == 'cart') { // this is the same id field from the static navigatorButtons definition
          this.props.navigator.switchToTab({
            tabIndex: 1
          })
        }
        else if (event.id == 'sideMenu') {
          this.props.navigator.toggleDrawer({
              side: 'left',
              animated: true,
              //to: 'open'
          });
        }
        else if (event.id == 'search') {
            Actions.toSearchScreen({settings: this.props.settings }, this.props.navigator);
        }
      }
    }

    componentWillMount() {
        this.setState({
            pageList: this.props.settings.HOMEPAGES_SHOPIFY,
            loaded: true
        });
    }

    componentDidMount() {
    }

    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    size='small'/>
            </View>
        );
    }

    render() {
        return (
            !this.state.loaded
            ?
            this.renderLoadingView()
            :
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <Header settings={this.props.settings} navigator={this.props.navigator} />
                <MainMenuHorizontal settings={this.props.settings}
                                    navigator={this.props.navigator}/>
                {
                    this.state.pageList.map(page =>
                        <TabPage navigator={this.props.navigator}
                            widgets={page.widgets} settings={this.props.settings}
                            key={AppHelper.newGuid() } />
                    ) 
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginTop: 10,
        color: 'blue'
    },
    container: {
        flex: 1,
        width
    },
    homeEmpty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    homeEmptyText: {
        color: "#7b7b7b"
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
