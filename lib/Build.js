const BUILD_INFO = '/%sjob/%s/%s/api/json?depth=%s'
const BUILD_JOB = '/%sjob/%s/build'
const STOP_JOB = '/%sjob/%s/%s/stop'
const BUILD_JOB_CONSOLE = '/%sjob/%s/%s/consoleText'
const DELETE_BUILD = '/%sjob/%s/%s/doDelete'
const ALL_BUILDS = '/%sjob/%s/api/json?tree=allBuilds[number,url]'

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
     * Get total builds of a jenkins job.
     * 
     * @param {name} name - name of jenkins job.
     */
    async get_builds(name){
        let [folder_job,short_name] = this.jenkins.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(ALL_BUILDS,folder_job,short_name);
        let builds = await this.jenkins.callAPI(endpoint,'GET');
        return builds.data.allBuilds;
    }

    /**
     * delete a build number in jenkins job.
     * 
     * @param {string} name - name of job
     * @param {int} number - build number
     */
    async delete(name,number){
        let [folder_job,short_name] = this.jenkins.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(DELETE_BUILD,folder_job,short_name,number);
        await this.jenkins.callAPI(endpoint,'POST','',true);
    }

    /**
     * Get log of a build number in jenkins job.
     * 
     * @param {string} name - name of job
     * @param {int} number - build number
     */
    async get_build_log(name,number){
        let [folder_job,short_name] = this.jenkins.get_job_folder(name);
        let endpoint = this.jenkins.stringQuery(BUILD_JOB_CONSOLE,folder_job,short_name,number);
        let log = await this.jenkins.callAPI(endpoint,'GET');
        return log.data;
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

    get_time(time_stamp){
        let date = new Date(time_stamp);
        let hours = date.getHours();
        let datte = date.getDate();
        let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        let day = days[date.getDay()];
        let months = ['January','February','March','April','May','June','July','August','September','October','November','December']
        let month = months[date.getMonth()];
        let year = date.getFullYear();
        let date_string = `${day}, ${month} ${datte}, ${year}`
        let time_string = date.toTimeString().substring(0,date.toTimeString().indexOf('GMT')-1);
        return `${date_string} ${time_string}`
    }
}

module.exports.Build = Build;