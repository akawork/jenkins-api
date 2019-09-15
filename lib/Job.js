const API = '/api/json'
const JOB_INFO = '/%sjob/%s' + API+'?depth=%s' 
const JOBS_QUERY = '?tree=%s'
const JOBS_QUERY_TREE = 'jobs[url,color,name,%s]'
const JOB_RENAME = '/%sjob/%s/doRename?newName=%s'
const CREATE_JOB = '/%screateItem?name=%s'
const CONFIG_JOB = '/%sjob/%s/config.xml'
const DELETE_JOB = '/%sjob/%s/doDelete'
const DISABLE_JOB = '%sjob/%s/disable'
const ENABLE_JOB = '%sjob/%s/enable'
const COPY_JOB = '%screateItem?name=%s&mode=copy&from=%s'

const DEFAULT_CONFIG = `<flow-definition plugin="workflow-job@2.33">
<description/>
<keepDependencies>false</keepDependencies>
<properties/>
<definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.72">
<script/>
<sandbox>true</sandbox>
</definition>
<triggers/>
<disabled>false</disabled>
</flow-definition>`


class Job {

    /**
     * Create a job instance
     * 
     * @param {object} jenkins - jenkins instance
     */
    constructor(jenkins){
        this.jenkins = jenkins;
    }

    /**
     * Copy job on jenkins
     * 
     * @param {string} fromjob - is job you want to copy 
     * @param {string} tojob - the destination job
     */
    async copy(fromjob,tojob){
        let [from_folder_job,from_short_name] = this.get_job_folder(fromjob);
        let [to_folder_job,to_short_name] = this.get_job_folder(tojob);
        if(from_folder_job !== to_folder_job){
            throw new Error('You just can copy job in the same folder');
        }
        if(await this.is_exist(tojob)){
            throw new Error('This job is exist')
        }
        let endpoint = await this.jenkins.stringQuery(COPY_JOB,from_folder_job,to_short_name,from_short_name);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Enable jenkins job
     * 
     * @param {string} name - name of job
     */
    async enable(name){
        if(await !this.is_exist(name)){
            throw new Error('This job is not exist')
        }
        let [folder_job,short_name] = this.get_job_folder(name);
        let endpoint = await this.jenkins.stringQuery(ENABLE_JOB,folder_job,short_name);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Disable jenkins job
     * 
     * @param {string} name - name of job
     */
    async disable(name){
        if(await !this.is_exist(name)){
            throw new Error('This job is not exist')
        }
        let [folder_job,short_name] = this.get_job_folder(name);
        let endpoint = await this.jenkins.stringQuery(DISABLE_JOB,folder_job,short_name);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Delete jenkins job
     * 
     * @param {string} name - name of job 
     */
    async delete(name){
        if(await !this.is_exist(name)){
            throw new Error('This job is not exist')
        }
        let [folder_job,short_name] = this.get_job_folder(name);
        let endpoint = await this.jenkins.stringQuery(DELETE_JOB,folder_job,short_name);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Reconfig a job
     * 
     * @param {string} name - name of job you want to reconfig 
     * @param {string} config - config setting for job
     */
    async reconfig(name,config){
        try {
            let [folder_job,short_name] = this.get_job_folder(name);
            let endpoint = await this.jenkins.stringQuery(CONFIG_JOB,folder_job,short_name);
            await this.jenkins.callAPI(endpoint,'POST',config,true);
        } catch (error) {
            throw new Error("Error while reconfig job");
        }
    }

    /**
     * Get config information of a job
     * 
     * @param {string} name - name of job
     * @returns return a config string of a job 
     */
    async get_job_config(name){
        try {
            let [folder_job,short_name] = this.get_job_folder(name);
            let endpoint = await this.jenkins.stringQuery(CONFIG_JOB,folder_job,short_name);
            let config = await this.jenkins.callAPI(endpoint,'GET');
            return config.data
        } catch (error) {
            throw new Error("Error while get job config");
        }
    }

    /**
     * Create new job
     * 
     * @param {string} name - name of new job 
     * @param {string} config - config file for a job
     */
    async create(name,config){
        if(await this.is_exist(name)){
            throw new Error("This job is exist pls try again");
        }
        let [folder_job,short_name] = this.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(CREATE_JOB,folder_job,short_name);
        await this.jenkins.callAPI(endpoint,'POST',config,true)
    }

    /**
     * Check a job is exist or not
     * 
     * @param {string} name - is job name
     * @returns {boolean} - return true if job exist, if not return false
     */
    async is_exist(name){
        try {
            let [folder_job,short_name] = this.get_job_folder(name);
            if(await this.get_job_name(name) === short_name){
                return true
            }
        } catch (error) {
            return false;
        }
    }

    /**
     * Get name of a job
     * 
     * @param {string} name
     * @returns {Promise} - resolve it to receive name of job 
     */
    async get_job_name(name){
        try {
            let job_info = await this.get_job_info(name);
            return job_info.name;
        } catch (error) {
            throw new Error("Error while get job name")
        }
    }

    /**
     * Change a job name
     * 
     * @param {string} name - name of job you want to rename
     * @param {string} newName - this is new name of job
     */
    async rename(name, newName){
        try {
            let [folder_job,short_name] = this.get_job_folder(name);
            let endpoint = this.jenkins.stringQuery(JOB_RENAME,folder_job,short_name,newName);
            await this.jenkins.callAPI(endpoint,'POST','',true);
        } catch (error) {
            throw new Error("Error while rename check your old name or new name")
        }
    }

    /** 
     * Get dictionary of job information
     * 
     * @param {string} name - job name. EX: folder/job_name
     * @param {int} depth - JSON depth
     * @returns {Promise} - resolve it to receive a json object of job infomation
    */
    async get_job_info(name, depth=0){
        try {
            let endpoint_raw = this.get_job_folder(name);
            let endpoint = this.jenkins.stringQuery(JOB_INFO,endpoint_raw[0],endpoint_raw[1],depth);
            let log = await this.jenkins.callAPI(`${endpoint}`,"GET");
            return log.data
        } catch (error) {
            throw new Error("Error while get job info make sure you enter right name!")
        }
    }
    /**
     * Get list all jobs recursively.
     * Each job include 'name','url','color'.
     * @param {int} folder_depth_per_req - number level to fetch. With default is 10
     * is enough to get all jobs inside folder.
     * @returns {Promise} - resolve it to receive an array of total jobs
     */
    async get_all_jobs(folder_depth_per_req=10){
        try {
            let queryNormal="jobs";
            for(let i=0;i<folder_depth_per_req;i++){
                queryNormal = this.jenkins.stringQuery(JOBS_QUERY_TREE,queryNormal);
            }
            let jobQuery = this.jenkins.stringQuery(JOBS_QUERY,queryNormal);
            let jobs = await this.jenkins.callAPI(`${API}${jobQuery}`,'GET');
            return jobs.data.jobs;
        } catch (error) {
            throw new Error("Error when get all jobs")
        }
    }

    /**
     * Get full endpoint of a job.
     * 
     * @param {string} name - is name of job EX: folder/job_name => job/folder/job/job_name
     * @returns {Array} - include job folder and shortname
     */
    get_job_folder(name){
        let arr = name.split("/");
        let map = arr.map(x => "job/"+x+"/");
        let shortName = arr.pop();
        let jobFolder = map.slice(0,map.length-1).join("");
        return [jobFolder,shortName];
    }
}

module.exports.Job = Job;