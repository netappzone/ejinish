import { Navigation } from 'react-native-navigation';

import StartAppScreen from './install/start';
import ErrorScreen from './install/ErrorScreen';

import SideMenu from './core/sidemenu';
import MainMenuHorizontalLevel2 from './core/main-menu.horizontal.level2';
import TheTechStoreThemeLayout from '@themes/TechStore/screens/HomeScreen';

import ShopifyCollectionScreen from './CollectionScreen';
import ProductSortModal from './CollectionScreen/ProductSortModal';
import ShopifyPageSearchScreen from './PageSearchScreen';
import ShopifyProductDetailScreen from './ProductScreen';
import ShopifyProductDescription from './ProductScreen/ProductDescription';
import ShoppingCartScreen from './CartScreen';
import ShopifyCheckoutScreen from './CheckoutScreen';
import ShopifyCollectionAlsoLike from './ProductScreen/CollectionAlsoLike';
import ShopifyArticleListScreen from './ArticleListScreen';
import ShopifyArticleDetailScreen from './ArticleDetailScreen';
import ShopifyPageDetailScreen from './PageDetailScreen';
import ArticleLayoutModal from './ArticleListScreen/ArticleLayoutModal';
import ArticleSortModal from './ArticleListScreen/ArticleSortModal';

import Account from './Account';
import Login from './Account/Login';
import Register from './Account/Register';
import AccountDetail from './Account/AccountDetail';
import OrderHistory from './Account/OrderHistory';
import Addresses from './Account/Addresses';

import StoresLocator from './StoresLocator';
import Notifications from './Notifications';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('gikApp.StartAppScreen', () => StartAppScreen);
  Navigation.registerComponent('gikApp.ErrorScreen', () => ErrorScreen);

  Navigation.registerComponent('gikApp.SideMenu', () => SideMenu);
  Navigation.registerComponent('gikApp.MainMenuHorizontalLevel2', () => MainMenuHorizontalLevel2);
  Navigation.registerComponent('gikApp.TheTechStoreThemeLayout', () => TheTechStoreThemeLayout);

  Navigation.registerComponent('gikApp.ShopifyCollectionScreen', () => ShopifyCollectionScreen);
  Navigation.registerComponent('gikApp.ProductSortModal', () => ProductSortModal);
  Navigation.registerComponent('gikApp.ShopifyPageSearchScreen', () => ShopifyPageSearchScreen);
  Navigation.registerComponent('gikApp.ShopifyProductDetailScreen', () => ShopifyProductDetailScreen);
  Navigation.registerComponent('gikApp.ShopifyProductDescriptionScreen', () => ShopifyProductDescription);
  Navigation.registerComponent('gikApp.ShoppingCartScreen', () => ShoppingCartScreen);
  Navigation.registerComponent('gikApp.ShopifyCheckoutScreen', () => ShopifyCheckoutScreen);
  Navigation.registerComponent('gikApp.ShopifyCollectionAlsoLike', () => ShopifyCollectionAlsoLike);
  Navigation.registerComponent('gikApp.ShopifyArticleListScreen', () => ShopifyArticleListScreen);
  Navigation.registerComponent('gikApp.ShopifyArticleDetailScreen', () => ShopifyArticleDetailScreen);
  Navigation.registerComponent('gikApp.ShopifyPageDetailScreen', () => ShopifyPageDetailScreen);
  Navigation.registerComponent('gikApp.ArticleSortModal', () => ArticleSortModal);
  Navigation.registerComponent('gikApp.ArticleLayoutModal', () => ArticleLayoutModal);

  Navigation.registerComponent('gikApp.Account', () => Account);
  Navigation.registerComponent('gikApp.Login', () => Login);
  Navigation.registerComponent('gikApp.Register', () => Register);
  Navigation.registerComponent('gikApp.AccountDetail', () => AccountDetail);
  Navigation.registerComponent('gikApp.OrderHistory', () => OrderHistory);
  Navigation.registerComponent('gikApp.Addresses', () => Addresses);

  Navigation.registerComponent('gikApp.StoresLocator', () => StoresLocator);
  Navigation.registerComponent('gikApp.Notifications', () => Notifications);
}
