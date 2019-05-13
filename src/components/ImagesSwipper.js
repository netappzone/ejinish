import React, { Component } from 'react';
import {
  Platform,
  TouchableOpacity,
  Dimensions,
  View
} from 'react-native';

const loading = {uri: "https://simpletexting.com/wp-content/themes/new_simpletexting/images/gif/loading-ttcredesign.gif"}
import Swiper from 'react-native-swiper';
import { AppHelper, Device } from '@services';
var {height, width} = Dimensions.get('window');
import FastImage from 'react-native-fast-image';
import Placeholder from 'rn-placeholder';
import { Actions } from '@actions';

const Slide = props => {
  return (
      <TouchableOpacity style={styles.slide} onPress = {props.onPress}>
        <FastImage onLoad={props.loadHandle.bind(null, props.i)}
            style={styles.image} source={{uri: props.uri}} />
        {
            !props.loaded && <View style={styles.loadingView}>
            <FastImage style={styles.loadingImage} source={loading} />
            </View>
        }
      </TouchableOpacity>
    )
}
const heightImageSlide = (Platform.OS === 'ios'? height - 150 - 70 - 40 : height - 150);

export default class ImagesSwipper extends Component  {
  constructor(props) {
    super(props);
    this.state = {
        loaded: false,
        hasData: false,
        widgetHeightScale: Math.ceil(AppHelper.convertToInt((this.props.widget.height / this.props.widget.width) * 414, 120) * Device.scale),
        imgList: [],
        loadQueue: [0, 0, 0, 0]
    }
    this.loadHandle = this.loadHandle.bind(this)
  }
  loadHandle (i) {
        let loadQueue = this.state.loadQueue
        loadQueue[i] = 1
        this.setState({
            loadQueue
        })
  }
  componentWillMount() {
    if (this.props.widget && this.props.widget.data) {
        this.setState({
            imgList: this.props.widget.data,
            hasData: true,
            loaded: true
        })
    }
  }
  render() {
    return (
      this.state.imgList.length <= 0
      ?
      <Placeholder.Box
                      animate="fade"
                      height={this.state.widgetHeightScale}
                      width={'100%'}
                      color={'#ddd'}
                  />
      :
      <View>
        <Swiper loadMinimal loadMinimalSize={3}
                  style={styles.wrapper}
                  loop={true}
                  width={width}
                  height= {this.state.widgetHeightScale}
                  contentContainerStyle={styles.wrapper}
                  showsPagination={true} 
                  showsButtons={false}
                  activeDotColor={'#ffffff'}
          >
          {
              this.state.imgList.map((item, i) =>
                  <Slide
                          loadHandle={this.loadHandle}
                          loaded={!!this.state.loadQueue[i]}
                          uri={item.imgUrl}
                          i={i}
                          key={i}
                          onPress={this.toAction.bind(this, item)}
                  />
              )
          }
        </Swiper>
      </View>
    )
  }
  toAction(item) {
    console.log('item', item);
    if(item.linkType && item.id) {
      let options = {
        source: item.linkType === 'external' ? 'external' : 'shopiy', 
        linkType: item.linkType, 
        id: item.id,
        settings: this.props.settings
      }
      Actions.redirectScreen(options, this.props.navigator);
    }
  }
}

const styles = {
  wrapper: {
    marginTop: 3,
    marginBottom: 3
  },
  imgSingle: {
    width: width,
    justifyContent: "center",
    alignItems: "center"
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  image: {
    width,
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff'
  },
  loadingImage: {
    width: 60,
    height: 60
  },
}
