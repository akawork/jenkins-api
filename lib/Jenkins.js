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
     *      "sessionCrumb":"get crumb session for post request"
     * ```
     * @param {string} BaseUrl - is your jenkins base url EX:http://user:password@localhost:8080/
     */
    constructor(BaseUrl){
        this.BaseUrl = BaseUrl;
        this.Job = new Job(this);
        this.sessionCrumb = this.getCrumb();
    }

    /**
     * Get crumb token
     * 
     * @returns {Array} - include session and crumb token
     */
    async getCrumb()
    {
        let crumb = await axios({
            method:'get',
            url:`${this.BaseUrl}/crumbIssuer/api/json`,
            Connection: 'keep-alive'
        });
        let arr = crumb.headers['set-cookie'];
        let crumbIs = crumb.data.crumb;
        return [arr[0],crumbIs]
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
            let crumbIssuer = await this.sessionCrumb;
            console.log(crumbIssuer)
            return axios({
                method:method,
                url:`${this.BaseUrl}/${endpoint}`,
                headers:{
                    Cookie:crumbIssuer[0],
                    'Content-Type':'text/xml',
                    'Jenkins-Crumb': crumbIssuer[1]
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