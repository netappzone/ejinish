import { Navigation } from 'react-native-navigation';
// screen related book keeping
import { registerScreens } from './containers';
import Language from '@language';
import { I18nManager } from 'react-native';
import { configs } from '@settings';
I18nManager.forceRTL(configs.RTL);

registerScreens();

console.disableYellowBox = true;

Navigation.startSingleScreenApp({
    screen: {
        screen: 'gikApp.StartAppScreen',
        title: Language.t('home'),
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
    portraitOnlyMode: true
});
