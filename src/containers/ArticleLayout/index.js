'use strict';
import React, {Component} from "react";

import DefaultLayout from './List';
import TwoColumn from './TwoColumn';
import ThreeColumn from './ThreeColumn';
import CardLayout from './Card';
import PortfolioLayout from './Portfolio';
import PortfolioType2Layout from './PortfolioType2';

export default class ArticleLayout extends Component {
    render() {
        const articleProps = {...this.props}

        switch (this.props.layout) {
        case 'TwoColumn':
            return <TwoColumn   {...articleProps}/>
        case 'ThreeColumn':
            return <ThreeColumn {...articleProps}/>
        case 'Card':
            return <CardLayout {...articleProps}/>
        case 'Portfolio':
            return <PortfolioLayout {...articleProps}/>
        case 'PortfolioType2':
            return <PortfolioType2Layout {...articleProps}/>
        default:
            return <DefaultLayout {...articleProps}/>
        }
    }
}
