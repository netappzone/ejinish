import React, { Component } from 'react';
import {
    View,
    Dimensions
} from 'react-native';
import Placeholder from 'rn-placeholder';
const { height, width } = Dimensions.get('window');

export default class Placeholder3Cards extends Component {
    render() {
        let color = '#ddd';
        let loadingHeight = this.props.height || 260;
        let loadingNum = this.props.loadingNum || 1;
        let loadingArr = [];
        for(let i = 0; i < loadingNum; i++) {
            loadingArr.push(
                <View key={i} style={{height: loadingHeight, flex: 1, flexDirection: 'row', marginVertical: 10}}>
                    <View style={{width: '65%', paddingRight: 5, height: loadingHeight}}>
                        <Placeholder.Box
                            animate="fade"
                            height={200}
                            width={'100%'}
                            color={color}
                            />
                        <View style={{marginTop: 10}}>
                            <Placeholder.Paragraph
                                animate="fade"
                                lineNumber={2}
                                textSize={12}
                                width="100%"
                                lastLineWidth="70%"
                                color={color}
                                />
                        </View>
                    </View>
                    <View style={{width: '35%', paddingLeft: 5, height: loadingHeight}}>
                        <Placeholder.Box
                            animate="fade"
                            height={70}
                            width={'100%'}
                            color={color}
                            />
                        <View style={{marginTop: 10, marginBottom: 20}}>
                            <Placeholder.Paragraph
                                animate="fade"
                                lineNumber={2}
                                textSize={10}
                                width="100%"
                                lastLineWidth="70%"
                                color={color}
                                />
                        </View>
                        <Placeholder.Box
                            animate="fade"
                            height={70}
                            width={'100%'}
                            color={color}
                            />
                        <View style={{marginTop: 10}}>
                            <Placeholder.Paragraph
                                animate="fade"
                                lineNumber={2}
                                textSize={10}
                                width="100%"
                                lastLineWidth="70%"
                                color={color}
                                />
                        </View>
                    </View>
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: '#fff', width, height: loadingHeight}}>
                {loadingArr}
            </View>
        )
    }
}