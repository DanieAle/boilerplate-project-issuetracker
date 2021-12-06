'use strict';
const {CreateIssue,updateIssue,deleteIssue,findAll} = require('./dataBase.js');
const TIMEOUT = 10000;
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let t = setTimeout(() =>{
        next({message:'Time Out'});
      },TIMEOUT);
      findAll(function(err,data){
        clearTimeout(t);
        if(err) return next(err);
        if(!data){
          console.log('Missing "done()" argument');
          return next({message:"Missing callback argument"});
        }
        res.send(data);
      });
    })
    
    .post(function (req, res,next){
      let project = req.params.project;
      let obj = {
        issue_title:req.body.issue_title,
        issue_text:req.body.issue_text,
        created_on:req.body.created_on,
        updated_on:"",
        created_by:req.body.created_by,
        assigned_to:"",
        open:true,
        status_text:""
      }
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
    })
    
    .put(function (req, res){
      let project = req.params.project;
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
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let t = setTimeout(() => {
        next({message:'Time Out'});
      },TIMEOUT);
      deleteIssue(req.body._id,function(err,data){
        clearTimeout(t);
        if(err)return next(err);
        if(!data){
          console.log('Missing "done()" argument');
          return next({message:"Missing callback argument"});
        }
        console.log('Removed...',data);
      });
    });
    app.use(function(err, req,res,next){
      if(err){
        res
        .status(err.status || 500)
        .type('txt')
        .send(err.message || 'SERVER ERROR');
      }
    });
};
