import React, {StyleSheet, Platform, Dimensions, PixelRatio} from "react-native";

const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: height,
    width: width,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 9
  },
  spinner: {
    color: '#ddd',
    marginBottom: 120
  },
  widgetTitle: {
    padding: 5
  },
  widgetTitle_Text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444'
  },
  flatlist: {
    paddingTop: 8,
    paddingBottom: 20,
    // alignItems: 'center'
  },
  layoutModalContainer: {
     flexDirection: 'column',
  },
  layoutModalItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 3,
    height: width /3,
    borderColor: '#ddd',
    borderWidth: 0.5
  },
  layoutItemImage: {
    width: 36,
    height: 36,
    marginBottom: 16,
  },
  layoutItemText: {
    fontWeight: '300'
  },
  toolbar: {
      backgroundColor: '#eee',
      height: 45,
      width: width
  },
  toolBarButtonStyle: {
    backgroundColor: 'transparent'
  },
  toolBarTextStyle: {
    color: '#151515'
  }
});
