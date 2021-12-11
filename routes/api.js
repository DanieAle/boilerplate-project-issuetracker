'use strict';
const { create } = require('mocha/lib/suite');
const {CreateIssue,updateIssue,deleteIssue,findAll} = require('./dataBase.js');
const TIMEOUT = 10000;
const keys = ['issue_title','issue_text','updated_on','created_by','assigned_to','open','status_text'];
const keysRequired = ['issue_title','issue_text','created_by'];
const createObj = (body,method) =>{
  let obj;
  let fields = false;
  if(method === 'PUT'){
    keys.forEach((item) =>{
      if(body[item] === undefined){
          fields=true;
      }
  });
  
  if(!fields){
    let date = new Date(Date.now());
    obj = {
      issue_title:body.issue_title,
      issue_text:body.issue_text,
      updated_on:date,
      created_by:body.created_by,
      assigned_to:'',
      open:true,
      status_text:''
    }
  }
  else return 'NOT FIELDS';
  }
  else{
    keysRequired.forEach(item => {
      if(body[item] === undefined){
        fields = true;
      }
    });
    if(!fields){
  obj = {
    issue_title:body.issue_title,
    issue_text:body.issue_text,
    created_on:body.created_on,
    updated_on:null,
    created_by:body.created_by,
    assigned_to:'',
    open:true,
    status_text:''
  }
}
else return 'NOT FIELDS';
}
  return obj;
}
module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(function (req, res){
      let project = req.params.project;
      let obj;
      if(req.query !== null){
        obj = req.query;
      }
      else obj = {};
      let t = setTimeout(() =>{
        next({message:'Time Out'});
      },TIMEOUT);
      findAll(obj,function(err,data){
        clearTimeout(t);
        if(err) return console.log('error');
        if(!data){
          console.log('Missing "done()" argument');
          return next({message:"Missing callback argument"});
        }
        res.send(data);
      });
    })
    
    .post(function (req, res,next){
      let project = req.params.project;
      let obj = createObj(req.body,req.method);
      if(obj !== 'NOT FIELDS'){ 
      let t = setTimeout(() => {
        next({message:'Time Out'});
      },TIMEOUT);
      CreateIssue(obj,function(err,data){
        clearTimeout(t);
        if(err)return res.send({error:'required field(s) missing'});
        if(!data){
          console.log('Missing "done()" argument');
          return next({message:"Missing callback argument"});
        }
        console.log('Creado');
      });
    }
    else{
        res
        .status(500)
        .send({ error: 'required field(s) missing' });
    }
    })
    
    .put(function (req, res,next){
      let project = req.params.project;
      let obj = createObj(req.body,req.method);
      
    if(obj !== 'NOT FIELDS'){
      let t = setTimeout(() => {
        next({message:'Time Out'});
      },TIMEOUT);
      updateIssue(req.body._id,req.body,function(err,data){
        clearTimeout(t);
        if(err)return next(err);
        if(!data){
          console.log('Missing "done()" argument');
          return next({message:"Missing callback argument"});
        }
        console.log('Updated....');
        next();
      });
    }
    else{
      res
      .status(500)
      .send({ error: 'no update field(s) sent', '_id': req.body._id });
    }
    })
    
    .delete(function (req, res,next){
      let project = req.params.project;
      let id = req.body._id;
      let t = setTimeout(() => {
        next({message:'Time Out'});
      },TIMEOUT);
      deleteIssue(id,function(err,data){
        clearTimeout(t);
        if(err)return next(err);
        if(!data){
          console.log('Missing "done()" argument');
          return next({message:"Missing callback argument"});
        }
        console.log('Removed...',data);
        next();
      });
    });
};
