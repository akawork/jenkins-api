# jenkins-api

## Table of contents

- [Install akawork-jenkins-api](#install)
- [Usage](#usage)
  - [Setup](#setup)
  - [Job](#job)
    - [Get Job Information](#job-info)
    - [Get All Jobs](#all-job)
    - [Rename](#rename)
    - [Create job](#create)
    - [Job is exist](#is-exist)
    - [Get job config](#job-config)
    - [Reconfig job](#reconfig)
    - [Delete job](#delete)
    - [Disable job](#disable)
    - [Enable job](#enable)
    - [Copy job](#copy)

## Install akawork-jenkins-api <a id="install"></a>

- Firstly, install node package jenkins api in your project as below:

```bash
npm install --save akawork-jenkins-api
```

## Usage <a id="usage"></a>

### Setup <a id="setup"></a>

```javascript
const jenkins = require('akawork-jenkins-api');

//enter your jenkins url
const Jenkins = jenkins('http://username:password@localhost:8080');
```

### Job <a id="job"></a>

#### Get Job Information <a id="job-info"></a>

```javascript
async function get_url(job_name){
    let job_info = await Jenkins.Job.get_job_info(job_name);
    console.log(job_info.url)
}
get_url('test/abc') // test/abc: test is folder and abc is job inside that folder.
```

#### Get All Jobs <a id="all-job"></a>

```javascript
async function get_total_jobs(){
    let list = await Jenkins.Job.get_all_jobs();
    console.log(list)
}
```

#### Rename <a id="rename"></a>

```javascript
async function rename(){
    // oldname: abc newname:fff
    await J.Job.rename('abc','fff');
}
rename()
```

#### Create job <a id="create"></a>

```javascript
const config = `<flow-definition plugin="workflow-job@2.33">
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

async function get_total_jobs(){
    await Jenkins.Job.create('test/new_name',config);
}
```

#### Job is exist <a id="is-exist"></a>

```javascript
Jenkins.Job.is_exist('job_name')
//return true if exist, if not return false
```

#### Get Job Config <a id="job-config"></a>

```javascript
Jenkins.Job.get_job_config('job_name')
```

#### Reconfig job <a id="reconfig"></a>

```javascript
const config = `<flow-definition plugin="workflow-job@2.33">
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

Jenkins.Job.reconfig('job_name',config)
```

#### Delete job <a id="delete"></a>

```javascript
Jenkins.Job.delete('job_name')
```

#### Disable job <a id="disable"></a>

```javascript
Jenkins.Job.disable('job_name')
```

#### Enable job <a id="enable"></a>

```javascript
Jenkins.Job.enable('job_name')
```

#### Copy job <a id="copy"></a>

```javascript
Jenkins.Job.copy('from_job','to_job')
```
