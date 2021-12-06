require('dotenv').config();
let mongodb = require('mongodb');
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true});
let issueSchema = new mongoose.Schema({
    issue_title:{type:String,required:true},
    issue_text:{type:String,required:true},
    created_on:{type:Date, default:Date.now,required:true},
    updated_on:Date,
    created_by:{type:String,required:true},
    assigned_to:String,
    open:Boolean,
    status_text:String
});

let Issue = new mongoose.model('Issue',issueSchema);

const CreateIssue = (obj,done) =>{
    let issue = new Issue(obj);
    
    issue.save(function(err,data){
        if(err) return console.log(err);
        done(err,data);
    });
}

const deleteIssue = (id,done) =>{
    Issue.findByIdAndRemove({_id:id},function(err,remove){
        if(err) return done({error:'missing _id'},null);
        done(null,remove);
    });
}

const updateIssue = (_id,obj,done) =>{
    Issue.findOneAndUpdate({_id:_id},obj,{new:true},function(err,found){
        if(err) return console.log(err);
        done(null,found);
    });
}

const findAll = (done) =>{
    Issue.find({},function (err,issues){
        if(err) console.log(err);
        done(err,issues);
    });
}


exports.CreateIssue = CreateIssue;
exports.deleteIssue = deleteIssue;
exports.updateIssue = updateIssue;
exports.findAll = findAll;