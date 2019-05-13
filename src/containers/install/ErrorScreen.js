import React from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import Language from '@language';

  const ErrorScreen = (props) => (
    <View style={styles.container}>
      <Text style={styles.warningIcon}>!</Text>
      <Text style={styles.heading}>
        { Language.t('settingsErrorTitle') }
      </Text>
      <Text style={styles.content}>
        { Language.t('settingsErrorContent') }
      </Text>
    </View>
  )


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 150,
    paddingHorizontal: 25
  },
  warningIcon: {
    marginBottom: 20,
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 25,
    lineHeight: 50,
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  heading: {
    color: '#666',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20
  },
  content: {
    textAlign: 'center',
    fontSize: 16
  }
})

export default ErrorScreen;
