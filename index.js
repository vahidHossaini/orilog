var uuid=require("uuid");
var fs;
class LogRouting
{
	constructor(disc)
	{
		this.disc=disc
	}
	fileLog(name,data,func)
	{
		return this.disc.run('log','fileLog',{name,data},func); 
	}
	tagLog(type,domain,service,data,session)
    {
		this.disc.run('log','tagLog',{type,domain,service,data,session},()=>{}); 
    }
	domainResponse(domain,service,id,response)
    {
        
		 this.disc.run('log','domainResponse',{id,response,domain,service},()=>{});
        return   
    }
	domainLog(domain,service,session,data)
	{  
        var id=uuid.v4();
		 this.disc.run('log','domainLog',{domain,service,session,data,id},()=>{});
        return id 
	}
}
module.exports = class logIndex
{
	constructor(config,dist)
	{
		this.config=config.statics
		this.context=this.config.context 
		if(this.config.fileData)
		{
			fs=require('fs');
			this.fileData=this.config.fileData;
		}
		this.accepted={};
		if(this.config.acceptedService)
		{
			for(var a in this.config.acceptedService)
			{
				var data=this.config.acceptedService[a];
				for(var b of data)
				{
					this.accepted[a+"_"+b]=true;
				}
			}
		}
        this.bootstrap=require('./bootstrap.js')
        this.enums=require('./struct.js') 
        this.tempConfig=require('./config.js')
		global.log=new LogRouting(dist)
	}
	async fileLog(msg,func,self)
    { 
        var data=msg;
		console.log(self.fileData.path+data.name)
		fs.writeFileSync(self.fileData.path+data.name,JSON.stringify(data.data));
		return func(null,data);
    }
	async tagLog(msg,func,self)
    {
        var data=msg;
        global.db.Save(self.context,'log_'+data.type,["_id"],{_id:uuid.v4(),domain:data.domain,service:data.service,data:data.data,session:data.session,responseDate:new Date()})
		return func(null,data);
    }
	async domainLog(msg,func,self)
	{
		var data=msg;  
		var name=data.domain+"_"+data.service
		if(!self.accepted[name])
			return(null,{})
        global.db.Save(self.context,'log_domain',["_id"],{
            _id:data.id,
            data:data.data,
            domain:data.domain,
            service:data.service,
            session:data.session,
            submitDate:new Date()
            })
		return func(null,data);
	}
	async domainResponse(msg,func,self)
	{
		var data=msg; 
		var name=data.domain+"_"+data.service
		if(!self.accepted[name])
			return(null,{}) 
        global.db.Update(self.context,'log_domain',["_id"],{_id:data.id,response:data.response,responseDate:new Date()})
		return func(null,data);
	}
}