const {Job} = require('./Job')
const axios = require('axios')

class Jenkins{
    /**
     * Create new Jenkins instance
     * 
     * This initialization include:
     * ```javascript
     *      "BaseUrl":"Setting base url"
     *      "Job":"Create new Job instance for using feature of Job"
     * ```
     * @param {string} BaseUrl - is your jenkins base url EX:http://user:password@localhost:8080/
     */
    constructor(BaseUrl){
        this.BaseUrl = BaseUrl;
        this.Job = new Job(this);
    }

    /**
     * Use to send request to Jenkins API.
     * 
     * @param {string} endpoint - EX: localhost:8080/api/json endpoint is /api/json.
     * @param {string} method - is GET or POST.
     * @param {string} body - use to send config file. 
     * @param {boolean} useCrumb - If require use crumbIssuer for authen use it.
     */
    async callAPI(endpoint, method = 'GET', body="", useCrumb=false)
    {   
        if(useCrumb===false){
            return axios({
                method:method,
                url:`${this.BaseUrl}/${endpoint}`
            });
        }else{
            let crumbIssuer = await this.callAPI('crumbIssuer/api/json','GET');
            return axios({
                method:method,
                url:`${this.BaseUrl}/${endpoint}`,
                headers:{
                    'Content-Type':'text/xml',
                    'Jenkins-Crumb': crumbIssuer.data.crumb
                },
                data:body
            })
        }
           
    }

    /**
     * Use to replace %s in a string.
     * 
     * @param {string} string - is string you want to replace.
     * @param  {...any} arr  - word to replace.
     */
    stringQuery(string,...arr){
        let str = "";
        for(let i = 0;i < arr.length;i++){
            if(i === 0){
                str = string.replace('%s',arr[i]);
            }else{
                str = str.replace('%s',arr[i]);
            }
        }
        return str;
    }
}

module.exports.Jenkins = Jenkins;