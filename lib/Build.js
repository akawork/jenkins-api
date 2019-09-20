const BUILD_INFO = '/%sjob/%s/%s/api/json?depth=%s'
const BUILD_JOB = '/%sjob/%s/build'
const STOP_JOB = '/%sjob/%s/%s/stop'

class Build{

    /**
     * Create a build instance
     * 
     * @param {object} jenkins - jenkins instance
     */
    constructor(jenkins){
        this.jenkins = jenkins;
    }

    /**
     * Stop a running jenkins job
     * 
     * @param {string} name - name of job
     * @param {int} number - number build to stop
     */
    async stop_build(name,number){
        let [folder_job,short_name] = this.jenkins.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(STOP_JOB,folder_job,short_name,number);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Trigger to build job
     * 
     * @param {string} name - name of job
     */
    async build_job(name){
        let [folder_job,short_name] = this.jenkins.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(BUILD_JOB,folder_job,short_name);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Get build information of a job
     * 
     * @param {string} name - name of job
     * @param {int} number - build number
     * @param {int} depth - JSON depth
     * @returns information of build number save as json object
     */
    async get_build_info(name,number,depth=0){
        let [folder_job,short_name] = this.jenkins.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(BUILD_INFO,folder_job,short_name,number,depth);
        let rs = await this.jenkins.callAPI(endpoint,'GET');
        return rs.data;
    }
}

module.exports.Build = Build;