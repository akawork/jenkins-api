class Build{

    /**
     * Create a build instance
     * 
     * @param {object} jenkins - jenkins instance
     */
    constructor(jenkins){
        this.jenkins = jenkins;
    }
}

module.exports.Build = Build;