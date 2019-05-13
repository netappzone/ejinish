import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
const { height, width } = Dimensions.get('window');
import { AppHelper } from '@services';
import HTML from 'react-native-render-html';

const SPACE = 0.01;
const ASPECT_RATIO = width / 200;
const LATITUDE_DELTA = 0.0422;
const LONGITUDE_DELTA =  0.0422; // LATITUDE_DELTA * ASPECT_RATIO;

export default class StoresLocator extends Component {
  constructor(props) {
    super(props);
    const itemWidth = width - 140,
          imgWidth = 500,
          imgHeight = 300;
    let imgNewWidth = itemWidth;
        imgNewHeight = imgHeight * imgNewWidth / imgWidth;

    let storesLocator = this.props.settings.STORES_LOCATOR.data;

    this.state = {
      itemWidth,
      imgNewWidth,
      imgNewHeight,
      entries: storesLocator,
      slideBottom: new Animated.Value(15),
      slideOpacity: new Animated.Value(1),

      currentLocator: storesLocator[0]
    }

    this.hideSlide = this.hideSlide.bind(this);
    this.showSlide = this.showSlide.bind(this);
    this.changeCoordinate = this.changeCoordinate.bind(this);
  }

  hideSlide() {
    Animated.parallel([
      Animated.timing(                  // Animate over time
        this.state.slideBottom,            // The animated value to drive
        {
          toValue: -this.state.imgNewHeight,                   // Animate to opacity: 1 (opaque)
          duration: 300,              // Make it take a while
        }
      ),
      Animated.timing(                  // Animate over time
        this.state.slideOpacity,            // The animated value to drive
        {
          toValue: .2,                   // Animate to opacity: 1 (opaque)
          duration: 300,              // Make it take a while
        }
      )
    ]).start();                        // Starts the animation
  }

  showSlide() {
    Animated.parallel([
      Animated.timing(                  // Animate over time
        this.state.slideBottom,            // The animated value to drive
        {
          toValue: 15,                   // Animate to opacity: 1 (opaque)
          duration: 300,              // Make it take a while
        }
      ),
      Animated.timing(                  // Animate over time
        this.state.slideOpacity,            // The animated value to drive
        {
          toValue: 1,                   // Animate to opacity: 1 (opaque)
          duration: 300,              // Make it take a while
        }
      )
    ]).start();
  }

  changeCoordinate(index) {
    this.setState({
      currentLocator: this.state.entries[index]
    })
  }

  _renderItem({item, index}) {
    return (
      <TouchableOpacity style={styles.slide} onPress={this.showSlide} activeOpacity={1}>
        <FastImage source={{ uri: item.image }}
          resizeMode={FastImage.resizeMode.contain}
          style={[{ width: this.state.imgNewWidth, height: this.state.imgNewHeight}]}
          />
        <View style={styles.slideContent}>
          <HTML baseFontStyle={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold'
                }}
                html={item.title} />
          <HTML baseFontStyle={{
                  color: '#fff',
                  fontSize: 10,
                  marginTop: 3
                }}
                html={item.description} imagesMaxWidth={Dimensions.get('window').width} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('settings: ', this.props.settings)
    return (
      <View style={styles.container}>
        <MapView provider={PROVIDER_GOOGLE}
          style={styles.map}
          onPress={this.hideSlide}
          region={{
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            ...this.state.currentLocator.coordinate
          }}>
            <MapView.Marker
                key={AppHelper.newGuid() }
                coordinate={this.state.currentLocator.coordinate}
                title={this.state.currentLocator.title}
                description={this.state.currentLocator.description}
            />
        </MapView>
        <Animated.View style={[styles.carouselContainer, {bottom: this.state.slideBottom, opacity: this.state.slideOpacity}]}
          >
          <Carousel
            data={this.state.entries}
            renderItem={this._renderItem.bind(this)}
            sliderWidth={width}
            itemWidth={this.state.itemWidth}
            onSnapToItem={this.changeCoordinate}
            />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  carouselContainer: {
    position: 'absolute'
  },
  slide: {
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 3
  },
  slideContent: {
    backgroundColor: 'rgba(0, 0, 0, .9)',
    paddingVertical: 10,
    paddingHorizontal: 15
  }
})
