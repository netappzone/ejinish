import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { oneSignalConfigs } from '@settings';

export default class NotificationSetup extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    OneSignal.init(
      oneSignalConfigs.id,
      {
        kOSSettingsKeyAutoPrompt: true,
        kOSSettingsKeyInFocusDisplayOption: 2
      }
    );
    //params configs: https://documentation.onesignal.com/v5.0/docs/react-native-sdk#section-ios-initialization-parameters

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure();
    OneSignal.inFocusDisplaying(2);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  //App in foreground
  //When a notification is received, but not displayed
  onReceived = (notification) => {
    console.log('recieve: ', notification);
    this.props.handleNewNotify();
  }

  //App in background
  //When a notification is opened, the listener is invoked with the notification
  //and the action that was invoked when it was clicked on
  onOpened = (openResult) => {
    //console.log('Message: ', openResult.notification.payload.body);
    //console.log('Data: ', openResult.notification.payload.additionalData);
    //console.log('isActive: ', openResult.notification.isAppInFocus);
    //console.log('openResult: ', openResult);
    const notifyData = {
      // ...openResult.notification.payload.additionalData,
      // body: openResult.notification.payload.body
      data: {
        ...openResult.notification.payload.additionalData
      }
    };
    console.log('open: ', openResult, notifyData)
    this.props.handleOpenNotify(notifyData)
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render() {
    return null;
  }
}
