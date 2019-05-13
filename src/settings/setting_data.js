import { domainPublic } from './constants';

class SettingData {
    constructor() {
        this.getData = () => {
            return fetch(`${domainPublic}/collections/all?view=settings.gikApp`)
                    .then(response => response.json())
                    .then(responseJson => {
                        return responseJson;
                    })
                    .catch(err => {
                      console.log('err: ', err)
                      return {}
                    })
        }
    }
}

export default (new SettingData);
