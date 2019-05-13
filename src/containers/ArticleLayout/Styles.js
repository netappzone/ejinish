import React, {StyleSheet, Platform, Dimensions, PixelRatio} from "react-native";

const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
  defaultAcitleContainerStyle: {
    width: width - 6,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  defaultAcitleThumbnailContainer: {

  },
  defaultAcitleThumbnail: {
    width: (width/3),
    height: (width/3) * 0.7
  },
  defaultAcitleTitleContainerStyle: {
    padding: 5,
    width: width - (width/3) - 10,
    
  },
  defaultAcitleTitle: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: 'left'
  },
  defaultAcitleSubTitle: {
    color: "#999",
    textAlign: 'left'
  },
  itemThree: {
    position: "relative",
    width: (width/3),
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 12
  },
  imageItemThree: {
    position: "relative",
    width: (width/3 - 10),
    height: (width/3 + 20),
    borderRadius: 3
  },
  nameItemThree: {
    fontSize: 13,
    width: (width/3 - 10),
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    textAlign: "center"
  },
  timeItemThree: {
    alignItems: "center",
    marginLeft: 4,
    marginRight: 8,
    color: "#999",
    fontSize: 10,
    marginTop: 4
  },
  itemTwo: {
    position: "relative",
    width: (width / 2),
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 12
  },
  imageItemTwo: {
    position: "relative",
    width: (width/2 - 10),
    height: (width/2 + 20),
    borderRadius: 3
  },
  nameItemTwo: {
    fontSize: 13,
    width: (width/2 - 10),
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    textAlign: "center"
  },
  timeItemTwo: {
    alignItems: "center",
    marginLeft: 4,
    marginRight: 8,
    color: "#999",
    fontSize: 10,
    marginTop: 4
  },
  itemCard: {
    marginBottom: 12,
    padding: 0,
    margin: 5,
    width: width - 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: '#ddd',
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  imageItemCard: {
    marginTop: 6,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 8,
    width: (width) - 24,
    height: (width/2)
  },
  nameItemCard: {
    fontSize: 16,
    width: (width)-24,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
    textAlign: "center",
  },
  timeItemCard: {
    marginBottom: 10,
    marginTop: 4,
    marginLeft: 12,
    marginRight: 12,
    color: "#999",
    fontSize: 12,
    textAlign: 'left'
  },
  itemPortfolioThumbnail: {
    width: width,
    height: 0.5 * width,
    position: "relative",
    marginBottom: 6
  },
  itemPortfolioTitleContainerStyle: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    paddingTop: 5
  },
  itemPortfolioTitle: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'left'
  },
  itemPortfolioSubTitle: {
    color: '#eee',
    textAlign: 'left'
  },
  itemPortfolioType2Thumbnail: {
    width: width,
    height: 0.5 * width,
    position: "relative"
  },
  itemPortfolioType2TitleContainerStyle: {
    padding: 10,
    paddingTop: 5
  },
  itemPortfolioType2Title: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
    textAlign: 'left'
  },
  itemPortfolioType2SubTitle: {
    textAlign: 'left'
  }
});
