# Description
This module is for logging other modules or services.  
# Install
- origamicore [Doc](https://github.com/vahidHossaini/origami#readme)
# Configuration
 
    {
        'context': '{db context name}', 
        //if use file log
        'fileData':{'path':'{path of log}'},
        //Services allowed to use
        acceptedService:{
            '{domainName}':[
                '{serviceName}'
            ]
        }
    } 
# Internal Services

        //Save data on file
        global.log.fileLog(name,data) 
        //Create a collection or table on database with type
        global.log.tagLog(type,domain,service,data,session)  
        //domain log
        global.log.domainLog(domain,service,session,data)  