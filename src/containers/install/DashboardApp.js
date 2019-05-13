import { Navigation } from "react-native-navigation";
import Language from '@language';
import { configs } from '@settings';

export function DashboardApp(settings) {
  if(Object.keys(settings).length > 0) {
    // tab object
    let tabs = [],
        homeTab = {
          label: Language.t('home'),
          screen: 'gikApp.TheTechStoreThemeLayout',
          icon: require('@images/tab-home.png'),
          selectedIcon: require('@images/tab-home-selected.png'),
          title: Language.t('home'),
          navigatorStyle: {
            navBarHidden: true,
            animationType: 'fade',
          }
        },
        storesLocatorTab = {
          label: Language.t('stores'),
          screen: 'gikApp.StoresLocator',
          icon: require('@images/tab-pin.png'),
          selectedIcon: require('@images/tab-pin-selected.png'),
          title: Language.t('stores')
        },
        cartTab = {
          label: Language.t('cart'),
          screen: 'gikApp.ShoppingCartScreen',
          icon: require('@images/tab-cart.png'),
          selectedIcon: require('@images/tab-cart-selected.png'),
          title: Language.t('cart')
        },
        accountTab = {
          label: Language.t('account'),
          screen: 'gikApp.Account',
          icon: require('@images/tab-customer.png'),
          selectedIcon: require('@images/tab-customer-selected.png'),
          title: Language.t('account')
        },
        notificationTab = {
          label: Language.t('notification'),
          screen: 'gikApp.Notifications',
          icon: require('@images/tab-notification.png'),
          selectedIcon: require('@images/tab-notification-selected.png'),
          title: Language.t('notification')
        };
    
    tabs.push(homeTab);
    if(settings.STORES_LOCATOR && settings.STORES_LOCATOR.enable && settings.STORES_LOCATOR.data.length > 0) tabs.push(storesLocatorTab);
    tabs.push(cartTab, accountTab, notificationTab);
    
    let drawer = configs.RTL
        ? {
          right: {
            screen: 'gikApp.SideMenu',
            passProps: {
              settings
            }
          }
        }
        : {
          left: {
            screen: 'gikApp.SideMenu',
            passProps: {
              settings
            }
          }
        }

    Navigation.startTabBasedApp({
      tabs,
      appStyle: {
        navBarTextColor: settings.themeConfigs.color.navBarTextColor,
        navBarBackgroundColor: settings.themeConfigs.color.navBarBackgroundColor,
        navBarButtonColor: settings.themeConfigs.color.navBarTextColor,
        tabBarButtonColor: settings.themeConfigs.color.tabBarButtonColor,
        tabBarSelectedButtonColor: settings.themeConfigs.color.tabBarSelectedButtonColor,
        tabBarBackgroundColor: settings.themeConfigs.color.tabBarBackgroundColor,
      },
      tabsStyle: {
        tabBarButtonColor: settings.themeConfigs.color.tabBarButtonColor,
        tabBarSelectedButtonColor: settings.themeConfigs.color.tabBarSelectedButtonColor,
        tabBarBackgroundColor: settings.themeConfigs.color.tabBarBackgroundColor,
        animationType: 'fade',
      },
      drawer: {
        ...drawer,
        appStyle: {
          disableOpenGesture: true
        },
        disableOpenGesture: true
      },
      passProps: {
        settings
      },
      animationType: 'fade',
      portraitOnlyMode: true
    });
  }
  else {
    // setting error
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'gikApp.ErrorScreen',
        title: Language.t('error'),
        navigatorStyle: {
          navBarHidden: true,
          drawUnderNavBar: false,
          navBarTranslucent: true,
          borderBottomColor: 'transparent',
          borderBottomWidth: 0,
          navBarNoBorder: true
        },
      },
      animationType: 'fade',
      portraitOnlyMode: true,
    });
  }
}
