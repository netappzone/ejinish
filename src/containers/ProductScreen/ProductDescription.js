import React, { Component } from 'react';
import {
    Platform,
    View,
    StyleSheet,
    Dimensions,
    WebView
} from 'react-native';
import { AppHelper } from '@services';
const { height, width } = Dimensions.get('window');
import { configs } from '@settings';

export default class ProductDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorButtons = configs.RTL
    ?
    {
      rightButtons: [{
        id: "close",
        icon: require('@images/cross.png')
      }]
    }
    :
    {
      leftButtons: [{
        id: "close",
        icon: require('@images/cross.png')
      }]
    }

    onNavigatorEvent(event) {
        if (event.id == 'close') {
            this.props.navigator.dismissModal({
                animationType: 'slide-down'
            });
        }
    }

    render() {
        let { description } = this.props;

        if (!AppHelper.isNullOrUndefined(description)) {
            //Replace al <em>
            description = description.replace(/<em>/g, '');
            description = description.replace(/font-family/g, "rmfont");
            description = `<!DOCTYPE html>
            <html>
            <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
            ${description}
            </body></html>`;
        }

        let jsCode = `
            try{
                var imgs = document.querySelectorAll("img");
                for( var i = 0; i < imgs.length; i++ ) {
                    imgs[i].style.maxWidth = '300px';
                    imgs[i].style.height = 'auto';
                    var imgSrc = imgs[i].getAttribute("src");
                    if (imgSrc.substring(0, 4) != "http") {
                        imgSrc = "https:" + imgSrc;
                        imgs[i].src = imgSrc;
                    }
                }
                var iframes = document.querySelectorAll("iframe");
                for( var j = 0; j < iframes.length; j++ ) {
                    iframes[j].style.width = '300px';
                    iframes[j].style.height = '250px';
                    var iSrc = iframes[j].getAttribute("src");
                    if (iSrc.substring(0, 4) != "http") {
                        iSrc = "https:" + iSrc;
                        iframes[j].src = iSrc;
                    }
                }

                var tables = document.querySelectorAll("table");
                for( var j = 0; j < tables.length; j++ ) {
                    tables[j].style.maxWidth = '310px';
                }
            }catch(e){}
        `;

        return (
            <View style={styles.container}>
                <WebView
                    source={{ html: description }}
                    style={{ width: width }}
                    injectedJavaScript={jsCode}
                    javaScriptEnabledAndroid={true}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    addressBarRow: {
        flexDirection: 'row',
        padding: 8,
    },
});
