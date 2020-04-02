var uuid=require("uuid");
class LogRouting
{
	constructor(disc)
	{
		this.disc=disc
	}
	tagLog(type,domain,service,data,session)
    {
		this.disc.run('log','domainResponse',{type,domain,service,data,session},func); 
    }
	domainResponse(id,response,session)
    {
        
		 this.disc.run('log','domainResponse',{id,response,session},func);
        return   
    }
	domainLog(domain,service,session,data)
	{  
        var id=uuid.v4();
		 this.disc.run('log','domainLog',{domain,service,session,data,id},func);
        return id 
	}
}
module.exports = class logIndex
{
	constructor(config,dist)
	{
		this.config=config.statics
		this.context=this.config.context 
        this.bootstrap=require('./bootstrap.js')
        this.enums=require('./struct.js') 
        this.tempConfig=require('./config.js')
		global.log=new LogRouting(dist)
	}
	async domainLog(msg,func,self)
    {
        var data=msg;
        global.db.Save(self.context,'log_'+data.type,["_id"],{_id:uuid.v4(),domain:data.domain,service:data.service,data:data.data,session:data.session,responseDate:new Date()})
		return func(null,data);
    }
	async domainLog(msg,func,self)
	{
		var data=msg;  
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
        global.db.Save(self.context,'log_domain',["_id"],{_id:data.id,response:data.response,responseSession:data.session,responseDate:new Date()})
		return func(null,data);
	}
}