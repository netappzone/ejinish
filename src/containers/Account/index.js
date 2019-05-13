import React, {Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { domainPublic } from '@settings';
import { AppHelper, ShopifyService } from '@services';
import Icon from 'react-native-vector-icons/Ionicons';
var { height, width } = Dimensions.get('window');
import Language from '@language';
import { configs } from '@settings';

const pageList = [
  {
    name: Language.t('login'),
    screen: 'gikApp.Login',
    icon: 'ios-person',
    isLogged: false,
  },
  {
    name: Language.t('register'),
    screen: 'gikApp.Register',
    icon: 'ios-person-add',
    isLogged: false,
  },
  {
    name: Language.t('account'),
    screen: 'gikApp.AccountDetail',
    icon: 'ios-contact',
    isLogged: true,
  },
  {
    name: Language.t('address'),
    screen: 'gikApp.Addresses',
    icon: 'ios-pin',
    isLogged: true,
  },
  {
    name: Language.t('logout'),
    screen: 'logout',
    icon: 'ios-log-out',
    isLogged: true,
  }
]

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageList,
            isLogged: false,
            account: {},
            isLoading: false
        }
        this.handleAfterLogin = this.handleAfterLogin.bind(this)
    }
    // static navigatorStyle = {
    //     navBarTextColor: '#fff',
    //     navBarNoBorder: true,
    // };

    handleAfterLogin(boo) {
        this.setState({
            isLogged: boo.logged,
            account: {
                name: boo.name
            }
        })
    }

    toPage(item) {
      let _this = this;
        if(item.screen !== '') {
            if(item.screen !== 'logout') {
                this.props.navigator.showModal({
                    screen: item.screen,
                    title: item.name,
                    backButtonHidden: configs.RTL,
                    navigatorStyle: {
                        navBarTextColor: _this.props.settings.themeConfigs.color.navBarTextColor,
                        navBarNoBorder: true,
                        navBarBackgroundColor: _this.props.settings.themeConfigs.color.navBarBackgroundColor
                    },
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: require('@images/cross.png'),
                                disableIconTint: true,
                                id: 'closeModal'
                            }
                        ]
                    },
                    passProps: {
                        handleAfterLogin: this.handleAfterLogin,
                        isLogged: this.state.isLogged
                    }
                })
            }
            else {
                this.setState({
                    isLoading: true
                })
                fetch(domainPublic + '/account/logout')
                    .then(() => {
                        this.setState({
                            isLogged: false,
                            isLoading: false
                        })
                        Alert.alert(
                            Language.t('notification'),
                            Language.t('youHaveLoggedOut'),
                            [
                                {text: Language.t('ok'), onPress: () => console.log('OK Pressed')},
                            ],
                            { cancelable: true }
                        )
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    renderRow(item) {
      if(this.state.isLogged === item.isLogged) {
        return(
          <View key={AppHelper.newGuid() } style={styles.row}>
            <TouchableOpacity style={styles.sectionName} onPress={ this.toPage.bind(this, item) }>
              {
                item.icon && item.icon !== ''
                ?
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={28} style={{lineHeight:44}}/>
                </View>
                :
                null
              }
              <View style={styles.titleContainer}>
                <Text style={[styles.menuTitle, { color: this.props.settings.themeConfigs.color.menuTextColor }]}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
      else {
          return null
      }
    }

    checkLogin() {
        ShopifyService.checkLogin().then((responseJson) => {
            this.setState({
                isLogged: responseJson.logged,
                account: {
                    name: responseJson.name
                }
            })
        })
    }

    componentWillMount() {
        this.checkLogin()
    }
    render() {
        let _this = this;
        if(this.state.isLoading) {
            return (<View style={{ backgroundColor: '#fff', width, height, }}>
                <ActivityIndicator size="small" style={{height: height - 100}}/>
                </View>)
        }
        else {
          return (
            <ScrollView style={styles.container}>
              {
                this.state.isLogged
                ?
                <View key={AppHelper.newGuid() } style={styles.row}>
                  <View style={styles.sectionName} >
                    <View style={styles.iconContainer}>
                      <Icon name='ios-happy' size={28} style={{lineHeight:44}}/>
                    </View>
                    <View style={styles.titleContainer}>
                      <Text style={[styles.menuTitle,
                              { color: this.props.settings.themeConfigs.color.menuTextColor }]}>
                        { Language.t('hi') }, {this.state.account.name}
                      </Text>
                    </View>
                  </View>
                </View>
                :
                null
              }
              { _this.state.pageList.map(item => this.renderRow(item)) }
            </ScrollView>
          )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        width: width
    },
    row: {
        width: width,
        height: 48,
        borderBottomColor: '#fafafa',
        borderBottomWidth: 1
    },
    sectionName: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    },
    iconContainer: {
        alignItems: 'center',
        width: 48
    },
    titleContainer: {
        width: width - 48,
        paddingTop: 15
    },
    menuTitle: {
        color: '#999',
        textAlign: 'left'
    }
})

export default Account;
