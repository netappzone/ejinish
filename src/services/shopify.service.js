import { domainPublic, server } from '@settings';
import storage from './storage.service';
var _ = require('lodash');

class ShopifyService {
    constructor() {

    }

    /*
    vendorsSelected: this.state.vendorsSelected,
    productTypesSelected: this.state.productTypesSelected,
    collection: this.state.collection
    */

    getProducts = (handle, sortBy, currentPage) => {
      let page = currentPage || 1;
      let searchUrl = `${domainPublic}/collections/${handle}?page=${page}&sort_by=${sortBy}&view=gikApp.json`;
      return fetch(searchUrl)
          .then((response) => response.json())
          .then((responseJson) => {
              return responseJson
          })
    }

    getSimpleProducts = (handle, sortBy, page) => {
        let searchUrl = `${domainPublic}/collections/${handle}?page=${page}&sort_by=${sortBy}&view=simple.gikApp.json`;
        return fetch(searchUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson
            })
    }

    getProductByHandle = (handle) => {
        let searchUrl = `${domainPublic}/products/${handle}.json`;
        return fetch(searchUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson
            })
    }

    getFilterData = (handle) => {
        let searchUrl = `${domainPublic}/collections/${handle}?&view=gikApp.filter`;
        return fetch(searchUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson
            })
    }

    /**
    * Tìm kiếm sản phẩm theo từ khoá
    */
    searchProductsByKeyword = (keyword, page) => {
        let searchUrl = `${domainPublic}/search/?type=product&q=${keyword}&page=${page}&view=gikApp.json`;
        return fetch(searchUrl)
           .then((response) => response.json())
           .then((responseJson) => {
               return responseJson
           })
    }

    getCart = () => {
        return new Promise((resolve, reject) => {
            storage.load({
                key: 'shoppingcart',

                // autoSync(default true) means if data not found or expired,
                // then invoke the corresponding sync method
                autoSync: false,

                // syncInBackground(default true) means if data expired,
                // return the outdated data first while invoke the sync method.
                // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
                syncInBackground: false,

                // you can pass extra params to sync method
                // see sync example below for example
                syncParams: {}
            }).then((data) => {
                resolve(data)
            }).catch((error) => {
                resolve([])
            })
        })
    }

    addToCart = (item) => {
        return new Promise((resolve, reject) => {
            this.getCart().then((cartItems) => {
                if (!cartItems || cartItems.length == 0) {
                    cartItems = [];
                    cartItems.push(item);
                } else {
                    let cart_line = _.find(cartItems, { 'variantId': item.variantId });
                    if (cart_line) {
                        //Phiên bản sản phẩm đã có trong giỏ hàng
                        var index = _.indexOf(cartItems, cart_line);
                        cart_line.quantity += 1;
                        cartItems.splice(index, 1, cart_line);
                    } else {
                        cartItems.push(item);
                    }
                }
                storage.save({
                    key: 'shoppingcart',
                    data: cartItems,

                    // if not specified, the defaultExpires will be applied instead.
                    // if set to null, then it will never expire.
                    //expires: null
                });
                resolve(cartItems)
            }).catch((error) => {
                console.log(error);
                reject(error);
            })
        })
    }

    quantityMinus = (variantId) => {
        return new Promise((resolve, reject) => {
            this.getCart().then((cartItems) => {
                let cart_line = _.find(cartItems, { 'variantId': variantId });
                if (cart_line) {
                    var index = _.indexOf(cartItems, cart_line);
                    cart_line.quantity = cart_line.quantity -= 1;
                    cartItems.splice(index, 1, cart_line);

                    storage.save({
                        key: 'shoppingcart',
                        data: cartItems
                    });
                }
                resolve(cartItems)
            }).catch((error) => {
                console.log(error);
                reject(error);
            })
        })
    }

    quantityPlus = (variantId) => {
        return new Promise((resolve, reject) => {
            this.getCart().then((cartItems) => {
                let cart_line = _.find(cartItems, { 'variantId': variantId });
                if (cart_line) {
                    var index = _.indexOf(cartItems, cart_line);
                    cart_line.quantity = cart_line.quantity += 1;

                    cartItems.splice(index, 1, cart_line);

                    storage.save({
                        key: 'shoppingcart',
                        data: cartItems
                    });
                }
                resolve(cartItems)
            }).catch((error) => {
                console.log(error);
                reject(error);
            })
        })
    }

    removeCartItem = (variantId) => {
        return new Promise((resolve, reject) => {
            this.getCart().then((cartItems) => {
                _.remove(cartItems, {
                    variantId: variantId
                });
                storage.save({
                    key: 'shoppingcart',
                    data: cartItems,
                });
                resolve(cartItems)
            }).catch((error) => {
                console.log(error);
                reject(error);
            })
        })
    }

    clearCart = () => {
        storage.remove({ key: 'shoppingcart' });
    }

    getCheckoutUrl = (strUrl) => {
        if (server == "haravan") {
            return `${domainPublic}/checkout?updates[1010846506]=1&clear_cart=true`;
        } else if (server == "bizweb") {
            return `${domainPublic}/cart/`;
        }else if (server == "shopify") {
            return `${domainPublic}/cart/${strUrl}`;
        } else {
            return "";
        }
    }

    getArticles(handle, page) {
      let searchUrl = `${domainPublic}/blogs/${handle}?page=${page}&view=gikApp.json`;
      return fetch(searchUrl)
          .then((response) => response.json())
          .then((responseJson) => {
              return responseJson
          })
    }

    getArticleURL(articleHandle) {
        let articleURL = `${domainPublic}/blogs/${articleHandle}`;
        return articleURL
    }

    getArticleJson(articleHandle) {
        let articleURL = `${domainPublic}/blogs/${articleHandle}?view=gikApp.json`;
        return fetch(articleURL)
            .then(response => response.json())
            .then(responseJson => responseJson)
            .catch(err => {
                console.log(err)
            })
    }
    getPageURL(pageHandle) {
      let articleURL = `${domainPublic}/pages/${pageHandle}`;
      return articleURL
    }

    checkLogin() {
		const checkLoginUrl = `${domainPublic}/collections/all?view=account.gikApp.json`
        return fetch(checkLoginUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson
            })
            .catch(err => {
                console.log(err)
            })
	}
}

export default new ShopifyService();
