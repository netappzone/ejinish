const settingDefault = {
  themeConfigs: {
    product_list: {
      image_width: 480,
      image_height: 480,
      screenBackgroundColor: "#f1f1f1",
      productBackgroundColor: "#ffffff",
      titleTextColor: "",
      vendorTextColor: "#777",
      descTextColor: "#999",
      priceTextColor: "#ff9500"
    }
  },
  SECTIONS_MENU_SHOPIFY: [
		{
			icon: require("@images/demo/gikapp_menu_icon_1.png"),
			name: "Demo item 1",
			iconWidth: 20,
			iconHeight: 20,
			source: "shopify",
			id: "/",
			linkType: "home",
			children: [
			]
    },
    {
			icon: require("@images/demo/gikapp_menu_icon_2.png"),
			name: "Demo item 2",
			iconWidth: 20,
			iconHeight: 20,
			source: "shopify",
			id: "/",
			linkType: "home",
			children: [
				{
					name: "Sub item 1",
					source: "shopify",
          id: "/",
          linkType: "home",
					children: [
					]
				}
				, {
					name: "Sub item 2",
					source: "shopify",
          id: "/",
          linkType: "home",
					children: [
						{
							name: "Sub item 1",
							source: "shopify",
              id: "/",
              linkType: "home",
							children: []
						}
						, {
							"name": "Sub item 2",
							"source": "shopify",
              "id": "/",
              "linkType": "home",
							"children": []
						}
						, {
							"name": "Sub item 3",
							"source": "shopify",
              "id": "/",
              "linkType": "home",
							"children": []
						}
					]
				}
				, {
					"name": "Sub item 3",
					"source": "shopify",
          "id": "/",
          "linkType": "home",
					"children": [
					]
				}
				, {
					"name": "Sub item 4",
					"source": "shopify",
          "id": "/",
          "linkType": "home",
					"children": [
					]
				}
			]
    },
    {
			"icon": require("@images/demo/gikapp_menu_icon_3.png"),
			"name": "Demo item 3",
			"iconWidth": 20,
			"iconHeight": 20,
			"source": "shopify",
      "id": "/",
			"linkType": "home",
			"children": [
			]
    },
    {
			"icon": require("@images/demo/gikapp_menu_icon_4.png"),
			"name": "Demo item 4",
			"iconWidth": 20,
			"iconHeight": 20,
			"source": "shopify",
      "id": "/",
			"linkType": "home",
			"children": [
			]
    },
    {
			"icon": require("@images/demo/gikapp_menu_icon_5.png"),
			"name": "Demo item 5",
			"iconWidth": 20,
			"iconHeight": 20,
			"source": "shopify",
      "id": "/",
			"linkType": "home",
			"children": [
			]
    },
    {
			"icon": require("@images/demo/gikapp_menu_icon_6.png"),
			"name": "Demo item 6",
			"iconWidth": 20,
			"iconHeight": 20,
			"source": "shopify",
      "id": "/",
			"linkType": "home",
			"children": [
			]
    },
    {
			"icon": require("@images/demo/gikapp_menu_icon_7.png"),
			"name": "Demo item 7",
			"iconWidth": 20,
			"iconHeight": 20,
			"source": "shopify",
      "id": "/",
			"linkType": "home",
			"children": [
			]
    },
    {
			"icon": require("@images/demo/gikapp_sidemenu_bookmark_image.png"),
			"name": "Demo item 10",
			"iconWidth": 20,
			"iconHeight": 20,
      "id": "/",
			"linkType": "home",
			"id": "",
			"children": []
		}
  ],
  HOMEPAGES_SHOPIFY: [
    {
      width: 600,
      height: 400,
      type: "imagesSwipper",
      data: [
        {
          imgUrl: require("@images/demo/banner.jpg"),
          linkType: "collection",
          id: "women"
        },
        {
          imgUrl: require("@images/demo/banner.jpg"),
          linkType: "collection",
          id: "women"
        },
        {
          imgUrl: require("@images/demo/banner.jpg"),
          linkType: "collection",
          id: "women"
        }
      ]
    },
    {
      title: "DEMO",
      id: "women",
      type: "collectionScrollHorizontal",
      data: [
        {
          id: 10482146627,
          title: "Product demo 1",
          featured_image: require("@images/demo/product-1.jpg"),
          handle: "iphone-6-32gb-2017",
          short_description: "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          price: 34798,
          price_format: "$347.98",
          compare_at_price: "0",
          compare_at_price_format: "0",
          available: true,
          vendor: "Apple",
          on_sale: false,
          sale: ""
        },
        {
          id: 10482155779,
          title: "Product demo 2",
          featured_image: require("@images/demo/product-1.jpg"),
          handle: "iphone-7-plus-128gb-product-red",
          short_description: "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          price: 69999,
          price_format: "$699.99",
          compare_at_price: "79999",
          compare_at_price_format: "$799.99",
          available: true,
          vendor: "Apple",
          on_sale: true,
          sale: "-13%"
        },
        {
          "id": 10482158147,
          "title": "Product demo 3",
          "featured_image": require("@images/demo/product-1.jpg"),
          "handle": "iphone-5s-16gb",
          "short_description": "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          "price": 29900,
          "price_format": "$299.00",
          "compare_at_price": "49900",
          "compare_at_price_format": "$499.00",
          "available": true,
          "vendor": "Apple",
          "on_sale": true,
          "sale": "-40%"
        },
        {
          "id": 10482229443,
          "title": "Product demo 4",
          "featured_image": require("@images/demo/product-1.jpg"),
          "handle": "lg-g5-titan-32-gb",
          "short_description": "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          "price": 63550,
          "price_format": "$635.50",
          "compare_at_price": "0",
          "compare_at_price_format": "0",
          "available": true,
          "vendor": "Apple",
          "on_sale": false,
          "sale": ""
        },
        {
          "id": 10482226051,
          "title": "Product demo 5",
          "featured_image": require("@images/demo/product-1.jpg"),
          "handle": "lenovo-vibe-k5-note",
          "short_description": "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          "price": 20148,
          "price_format": "$201.48",
          "compare_at_price": "0",
          "compare_at_price_format": "0",
          "available": true,
          "vendor": "Apple",
          "on_sale": false,
          "sale": ""
        },
        {
          "id": 10482241731,
          "title": "Product demo 6",
          "featured_image": require("@images/demo/product-1.jpg"),
          "handle": "apple-watch-series-1-42-mm-silver",
          "short_description": "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          "price": 54095,
          "price_format": "$540.95",
          "compare_at_price": "0",
          "compare_at_price_format": "0",
          "available": true,
          "vendor": "Apple",
          "on_sale": false,
          "sale": ""
        },
        {
          id: 10482234371,
          title: "Product demo 7",
          featured_image: require("@images/demo/product-1.jpg"),
          handle: "apple-watch-series-2-42-mm",
          short_description: "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          price: 54095,
          price_format: "$540.95",
          compare_at_price: "0",
          compare_at_price_format: "0",
          available: true,
          vendor: "Apple",
          on_sale: false,
          sale: ""
        },
        {
          id: 10482223299,
          title: "Product demo 8",
          featured_image: require("@images/demo/product-1.jpg"),
          handle: "macbook-air-13-128gb",
          short_description: "About us Welcome to our Store! We supply many products including mobile phones& accessories, camera & camcorder accessories,car accessories &...",
          price: 129900,
          price_format: "$1,299.00",
          compare_at_price: "149900",
          compare_at_price_format: "$1,499.00",
          available: true,
          vendor: "Apple",
          on_sale: true,
          sale: "-13%"
        }
      ]
    }
  ]
}

export default settingDefault;
