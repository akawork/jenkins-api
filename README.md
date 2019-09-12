# jenkins-api

## Table of contents

- [Install akawork-jenkins-api](#install)
- [Usage](#usage)

## Install akawork-jenkins-api <a id="install"></a>

- Firstly, install node package jenkins api in your project as below:

```bash
npm install --save akawork-jenkins-api
```

## Usage <a id="usage"></a>

### Setup

```javascript
const jenkins = require('akawork-jenkins-api');

//enter your jenkins
const Jenkins = jenkins('http://username:password@localhost:8080');
```

### Get Job Information

```javascript
async function get_url(job_name){
    let job_info = await Jenkins.Job.getJobInfo(job_name);
    console.log(job_info.url)
}
get_url('test/abc') // test/abc: test is folder and abc is job inside that folder.
```

### Get All Jobs

```javascript
async function get_total_jobs(){
    let list = await Jenkins.Job.getAllJobs();
    console.log(list)
}
```

### Rename

```javascript
async function rename(){
    // oldname: abc newname:fff
    let rs = await J.Job.reName('abc','fff');
    if(rs.statusText === "OK"){
        console.log('rename success')
    }
}
rename()
```
