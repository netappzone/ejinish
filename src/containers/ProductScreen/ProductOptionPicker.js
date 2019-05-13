import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import { Button, Icon } from 'native-base';
import { AppHelper } from '@services';

var _ = require('lodash');
export default class ProductOptionPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            firstOptions: [],
            secondOptions: []
        }
    }

    componentDidMount() {
        const variants = this.props.variants;
        const options = this.props.options;

        let firstOptions = [];
        _.forEach(variants, function (variant) {
            if (!_.find(firstOptions, { value: variant.option1 })) {
                if (options.length == 1) {
                    let outOfStock = false;

                    if (variant.inventory_management
                        && variant.inventory_quantity == 0
                        && variant.inventory_policy == "deny") {
                        outOfStock = true;
                    }
                    firstOptions.push({ id: variant.id, value: variant['option1'], variant: variant, outOfStock: outOfStock });
                } else {
                    firstOptions.push({ id: variant.id, value: variant['option1'], variant: variant });
                }
            }
        })

        let secondOptions = [];
        let firstOptionSelect = firstOptions[0];
        let secondOptionSelected = firstOptionSelect;
        if (options.length == 2) {
            _.forEach(this.props.variants, function (variant) {
                if (variant.option2 && variant.option1 == firstOptionSelect.value) {
                    let outOfStock = false;

                    if (variant.inventory_management
                        && variant.inventory_quantity == 0
                        && variant.inventory_policy == "deny") {
                        outOfStock = true;
                    }
                    secondOptions.push({ value: variant.option2, variant: variant, outOfStock: outOfStock });
                }
            })
            secondOptionSelected = secondOptions[0];
        }

        this.setState({
            firstOptions: firstOptions,
            firstOptionSelect: firstOptionSelect,
            secondOptions: secondOptions,
            secondOptionSelected: secondOptionSelected
        })
        this.props.updateVariant(secondOptionSelected);
    }

    firstOptionChanged = (firstOptionSelect) => {
        let secondOptions = [];
        let secondOptionSelected = firstOptionSelect;
        if (this.props.options.length == 2) {
            _.forEach(this.props.variants, function (variant) {
                if (variant.option2 && variant.option1 == firstOptionSelect.value) {
                    let outOfStock = false;

                    if (variant.inventory_management
                        && variant.inventory_quantity == 0
                        && variant.inventory_policy == "deny") {
                        outOfStock = true;
                    }
                    secondOptions.push({ value: variant.option2, variant: variant, outOfStock: outOfStock });
                }
            })
            secondOptionSelected = secondOptions[0];
        }
        this.setState({
            firstOptionSelect: firstOptionSelect,
            secondOptions: secondOptions,
            secondOptionSelected: secondOptionSelected
        });
        this.props.updateVariant(secondOptionSelected);
    }

    secondOptionChanged = (secondOptionSelected) => {
        this.setState({ secondOptionSelected: secondOptionSelected });
        this.props.updateVariant(secondOptionSelected);
    }

    render() {
        const { secondOptions, secondOptionSelected, firstOptionSelect, firstOptions } = this.state;

        const option2Render = () => {
            if (this.props.options.length == 2) {
                return (
                    <View style={styles.option_picker_item}>
                        <View style={styles.option_name_bar}>
                            <Text style={styles.option_name}>{this.props.options[1].name}:</Text>
                        </View>
                        <View style={styles.option_values}>
                            {
                                secondOptions.map((item, index) => {
                                    if (secondOptionSelected && secondOptionSelected.value == item.value) {
                                        return (
                                            <Button small danger bordered iconLeft
                                                key={AppHelper.newGuid()}
                                                style={{ marginRight: 10, marginTop: 5 }}
                                                onPress={this.secondOptionChanged.bind(this, item)}>
                                                <Icon name='checkmark' />
                                                {
                                                    item.outOfStock
                                                        ? <Text style={{ color: '#e42127', textDecorationLine: 'line-through' }}>{item.value}</Text>
                                                        : <Text style={{ color: '#666666' }}>{item.value}</Text>
                                                }
                                            </Button>
                                        )
                                    } else {
                                        return (
                                            <Button small info bordered
                                                key={AppHelper.newGuid()}
                                                style={{ marginRight: 10, marginTop: 5 }}
                                                onPress={this.secondOptionChanged.bind(this, item)}>
                                                {
                                                    item.outOfStock
                                                        ? <Text style={{ color: '#e42127', textDecorationLine: 'line-through' }}>{item.value}</Text>
                                                        : <Text style={{ color: '#666666' }}>{item.value}</Text>
                                                }
                                            </Button>
                                        )
                                    }
                                })
                            }
                        </View>
                    </View>
                )
            } else {
                return null
            }
        }
        return (
            <View style={styles.option_picker}>
                <View style={styles.option_picker_item}>
                    <View style={styles.option_name_bar}>
                        <Text style={styles.option_name}>{this.props.options[0].name}:</Text>
                    </View>
                    <View style={styles.option_values}>
                        {
                            firstOptions.map((item, index) => {
                                if (firstOptionSelect == item) {
                                    return (
                                        <Button
                                            key={AppHelper.newGuid()}
                                            small danger bordered iconLeft
                                            style={{ marginRight: 10, marginTop: 5, 
                                                paddingRight: 5 }}
                                            onPress={this.firstOptionChanged.bind(this, item)}>
                                            <Icon name='checkmark' />
                                            <Text style={{ color: '#666666', marginLeft: 3 }}>{item.value}</Text>
                                        </Button>
                                    )
                                } else {
                                    return (
                                        <Button
                                            key={AppHelper.newGuid()}
                                            small info bordered
                                            style={{ marginRight: 10, marginTop: 5,
                                                    paddingHorizontal: 5 }}
                                            onPress={this.firstOptionChanged.bind(this, item)}>
                                            <Text style={{ color: '#666666' }}>{item.value}</Text>
                                        </Button>
                                    )
                                }
                            })
                        }
                    </View>
                </View>
                {option2Render()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    optionPicker: {},
    option_picker_item: {

    },
    option_name_bar: {
        marginTop: 10
    },
    option_name: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
        textAlign: 'left'
    },
    option_values: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    }
})
