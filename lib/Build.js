const BUILD_INFO = '/%sjob/%s/%s/api/json?depth=%s'

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
     * Get build information of a job
     * 
     * @param {string} name - name of job
     * @param {int} number - build number
     * @param {int} depth - JSON depth
     * @returns information of build number save as json object
     */
    async get_build_info(name,number,depth=0){
        let [folder_job,short_name] = this.get_job_folder(name);
        let endpoint = await this.jenkins.stringQuery(BUILD_INFO,folder_job,short_name,number,depth);
        let rs = await this.jenkins.callAPI(endpoint,'GET');
        return rs.data;
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

module.exports.Build = Build;