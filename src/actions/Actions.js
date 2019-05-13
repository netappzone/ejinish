import { Linking } from 'react-native';
import { AppHelper } from '@services';
import Language from '@language';
import { configs } from '@settings';

class Actions {
  /*
	* Redirect source to relevant-screen (using this.props.navigator)
	*
	* @author: phong.nguyen 20161104
	* @param url
	*/
	redirectScreen = (options, navigator) => {
		let source = options.source,
			linkType = options.linkType,
			id = options.id,
			settings = options.settings,
			widgetProps = options.widgetProps || {};
		let redirectScreen = "";
		let switchToTab = 0;
		let props = {};

		if(source !== 'external') {
			switch (linkType) {
				case 'product':
					props = {
						settings,
						product: {
							handle: id
						},
						collectionHandle: widgetProps.collectionHandle
					};
					return this.toProductScreen(props, navigator);

				case 'collection':
					props = { 
						settings,
						collection: {
							handle: id
						}
					};
					return this.toCollectionScreen(props, navigator);

				case 'page_search':
					return this.toSearchScreen(options, navigator);

				case 'page':
					props = {
						settings,
						page: {
							handle: id
						}
					};
					return this.toPageDetail(props, navigator);

				case 'article':
					return this.toArticleScreen(props, navigator);

				case 'blog':
					props = {
						settings,
						blog: {
							handle: id
						}
					};
					return this.toBlogScreen(props, navigator);

				case 'bookmark':
					props = {
						settings,
						type: 'bookmark',
						blog: {
							title: Language.t('bookmark')
						}
					}
					return this.toBlogScreen(props, navigator);
			}

			if (!AppHelper.isNullOrEmpty(redirectScreen)) {

				// phong.nguyen 20161107: fix bug, goto "first tab" first, then do redirectScreen.
				navigator.switchToTab({
					tabIndex: switchToTab
				});

				// off Navigator.
				navigator.dismissAllModals({
					animationType: 'slide-down'
				});
			}
		}
		else {
			this.toExternalLink(id);
		}
	}

	toHomeScreen = (navigator, boToggleMenu) => {
		// toggle menu
		if(boToggleMenu == true){
			navigator.toggleDrawer({
				side: configs.RTL ? 'right' : 'left',
				animated: true
			});
		}

		// phong.nguyen 20161111: using redirectScreen for all components.
		navigator.switchToTab({
			tabIndex: 0
		});
		navigator.popToRoot({
			animated: false
		});
	}

	toCollectionScreen = (props, navigator) => {
		let navigatorButtons = configs.RTL
		?
		{
			leftButtons: [
				{
					icon: require('@images/search.png'),
					id: 'search' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
				}
			],
			rightButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-forward.png'),
				}
			]
		}
		:
		{
			leftButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-back.png')
				}
			],
			rightButtons: [
				{
					icon: require('@images/search.png'), // for icon button, provide the local image asset name
					id: 'search' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
				}
			]
		}
		navigator.push({
			screen: "gikApp.ShopifyCollectionScreen",
			backButtonTitle: '',
			animationType: 'fade',
			passProps: props,
			navigatorButtons
		});
	}

	toProductScreen = (props, navigator) => {
		let navigatorButtons = configs.RTL
		?
		{
			leftButtons: [
				{
					icon: require('@images/search.png'), // for icon button, provide the local image asset name
					id: 'search' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
				}
			],
			rightButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-forward.png'),
				}
			]
		}
		:
		{
			leftButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-back.png')
				}
			],
			rightButtons: [
				{
					icon: require('@images/search.png'), // for icon button, provide the local image asset name
					id: 'search' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
				}
			]
		}
		navigator.push({
			screen: "gikApp.ShopifyProductDetailScreen",
			backButtonTitle: '',
			animationType: 'fade',
			passProps: props,
			navigatorButtons
		});
	}

	toBlogScreen = (props, navigator) => {
		let navigatorButtons = configs.RTL
		?
		{
			leftButtons: [
				{
					id: 'layout',
					icon: require('@images/layout.png')
				}
			],
			rightButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-forward.png')
				}
			]
		}
		:
		{
			leftButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-back.png')
				}
			],
			rightButtons: [
				{
					id: 'layout',
					icon: require('@images/layout.png')
				}
			]
		}

		navigator.push({
			screen: "gikApp.ShopifyArticleListScreen",
			backButtonTitle: '',
			animationType: 'fade',
			passProps: props,
			navigatorButtons
		});
	}

	toArticleScreen = (props, navigator) => {
		navigator.push({
			screen: "gikApp.ShopifyArticleDetailScreen",
			backButtonTitle: '',
			animationType: 'fade',
			passProps: props
		});
	}

	toPageDetail = (props, navigator) => {
		let navigatorButtons = configs.RTL
		?
		{
			leftButtons: [
				{
					icon: require('@images/md-share.png'),
					id: 'share'
				}
			],
			rightButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-forward.png')
				}
			]
		}
		:
		{
			leftButtons: [
				{
					id: 'back',
					icon: require('@images/md-arrow-back.png')
				}
			],
			rightButtons: [
				{
					icon: require('@images/md-share.png'),
					id: 'share'
				}
			]
		}

		navigator.push({
			screen: "gikApp.ShopifyPageDetailScreen",
			backButtonTitle: '',
			animationType: 'fade',
			passProps: props,
			navigatorButtons
		});
	}

	toSearchScreen = (props, navigator) => {
		navigator.push({
			screen: "gikApp.ShopifyPageSearchScreen",
			backButtonTitle: '',
			title: Language.t('search'),
			animationType: 'fade',
			passProps: props,
			backButtonHidden: configs.RTL
		});	
	}

	toExternalLink = (url) => {
    Linking.openURL(url);
	}

	toPreviousScreen = (navigator) => {
		navigator.pop({
			animationType: 'fade' 
		})
	}
}

export default new Actions();