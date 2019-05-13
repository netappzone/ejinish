var _ = require('lodash');
import {
	Linking
} from 'react-native';
import { oneSignalConfigs } from '@settings';

var NotificationService = {
	fetchNotifications: function (limit, page) {
		const timestamp = new Date().getTime();
		let url = `https://onesignal.com/api/v1/notifications?app_id=${oneSignalConfigs.id}&limit=${limit}&offset=${page}&kind=0&v=${timestamp}`;

		return fetch(url,
			{
				headers: {
					"Authorization": `Basic ${oneSignalConfigs.restApiKey}`
				}
			})
			.then(response => response.json())
			.then(responseJson => {
				return responseJson;
			})
			.catch(err => console.log('Notify error: ', err))
	}
}

module.exports = NotificationService;
