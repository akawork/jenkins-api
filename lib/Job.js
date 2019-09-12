const API = '/api/json'
const JOB_INFO = '/%sjob/%s' + API+'?depth=%s' 
const JOBS_QUERY = '?tree=%s'
const JOBS_QUERY_TREE = 'jobs[url,color,name,%s]'

class Job {

    /**
     * Create a job instance.
     * 
     * @param {object} jenkins - jenkins instance.
     */
    constructor(jenkins){
        this.jenkins = jenkins;
    }

    /** 
     * Get dictionary of job information
     * 
     * @param {string} name - job name. EX: folder/job_name
     * @param {int} depth - JSON depth
     * @returns {Promise} - resolve it to receive a json object of job infomation
    */
    async getJobInfo(name, depth=0){
        try {
        let endpoint_raw = this.getJobFolder(name);
        let endpoint = this.jenkins.stringQuery(JOB_INFO,endpoint_raw[0],endpoint_raw[1],depth);
        let log = await this.jenkins.callAPI(`${endpoint}`,"GET");
        return log.data
        } catch (error) {
            throw new Error("Error when get job info")
        }
    }
    /**
     * Get list all jobs recursively.
     * Each job include 'name','url','color'.
     * @param {int} folderDepthPerReq - number level to fetch. With default is 10
     * is enough to get all jobs inside folder.
     * @returns {Promise} - resolve it to receive an array of total jobs
     */
    async getAllJobs(folderDepthPerReq=10){
        try {
        let queryNormal="jobs";
        for(let i=0;i<folderDepthPerReq;i++){
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
    getJobFolder(name){
        let arr = name.split("/");
        let map = arr.map(x => "job/"+x+"/");
        let shortName = arr.pop();
        let jobFolder = map.slice(0,map.length-1).join("");
        return [jobFolder,shortName];
    }
}

module.exports.Job = Job;