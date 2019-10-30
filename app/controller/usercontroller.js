const shortid=require('shortid');
const mongoose=require('mongoose');
const passwordhashing=require('./../lib/hasspassword');
const response=require('./../lib/responseLib');
const logger=require('./../lib/loggerLib');
const check=require('./../lib/checkLib');
const validation=require('./../lib/paramsvalidation');
const token=require('./../lib/tokenLib');
const nodemailer=require('nodemailer');


//models
const userpath=require('./../models/UserModel');
const UserModel= mongoose.model('UserModel');
const authpath=require('./../models/auth');
const AuthModel=mongoose.model('Auth');
const eventpath=require('./../models/event');
const EventModel=mongoose.model('eventModel');


//signup function is start
let signup=(req,res)=>{
    let validateuseremail=()=>{
        return new Promise((resolve,reject)=>{
      
            if(req.body.email){
               
            if(!validation.Email(req.body.email)){
                 logger.captureError('email does not meet requirement','email validation',8);
                 let apiResponse=response.response(true,'email does not meet requirement',404,null);
                 reject(apiResponse);
            }
            else if(check.isEmpty(req.body.email)){
                logger.captureError('email is not there','email validation',5);
                let apiResponse=response.response(true,'email is not there',400,null);
                reject(apiResponse);
            }
            else{
               
                resolve(req);
            }
            }
            else {
                logger.captureError('email parameter is missing','email validation',10);
                let apiResponse=response.response(true,'email parameter is missing',403,null);
                reject(apiResponse);
            }
        })
    }
    let validateuserpassword=()=>{
        return new Promise((resolve,reject)=>{
         
            if(req.body.password){
               
            if(!validation.Password(req.body.password)){
                 logger.captureError('password not meet requirement','email validation',8);
                 let apiResponse=response.response(true,'password does not meet requirement',404,null);
                 reject(apiResponse);
            }
            else if(check.isEmpty(req.body.password)){
                logger.captureError('password is not there','email validation',5);
                let apiResponse=response.response(true,'password is not there',400,null);
                reject(apiResponse);
            }
            else{
               
                resolve(req);
            }
            }
            else {
                logger.captureError('password parameter is missing','email validation',10);
                let apiResponse=response.response(true,'password parameter is missing',403,null);
                reject(apiResponse);
            }
        })
    }

    
  
   let createUser=()=>{
       return new Promise((resolve,reject)=>{
           UserModel.findOne({email:req.body.email})
           .exec((err,emailDeatils)=>{
               if(err){
                logger.captureError('some error occured','createuser',10);
                   let apiResponse=response.response(true,err.message,400,null);
                   reject(apiResponse);
               }
               else if(check.isEmpty(emailDeatils)){
                   let createuser=new UserModel({
                            resetId:shortid.generate(),
                            userId:shortid.generate(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            mobileNumber:req.body.mobileNumber,
                            email:req.body.email,
                            password:passwordhashing.hashpassword(req.body.password),
                            userName:req.body.userName,
                            isAdmin: req.body.isAdmin,
                            CountryCode:req.body.CountryCode,
                            createdOn:Date.now()
                   })
                   createuser.save((err,createuser)=>{
                       if(err){
                        logger.captureError('error','createuser',10);
                           let apiResponse=response.response(true,err.message,403,null)
                           reject(apiResponse)
                       }
                       else{
                           let object=createuser.toObject();
                       
                           resolve(object);
                           
                       }
                   })
               }
               else {
                logger.captureError('email is already present','createuser',10);
                   let apiResponse=response.response(true,'email is already present',500,null);
                   reject(apiResponse);
               }
           })
       })
   }

       validateuseremail(req,res)
        .then(validateuserpassword)
       .then(createUser)
       .then((resolve)=>{

           delete resolve.password;
           logger.captureInfo('signup succesfully','signup',10);
           let apiResponse=response.response(false,'signup succesfully',200,resolve);
           res.send(apiResponse);
       })
       .catch((reject)=>{
           res.send(reject);
       })
}

//signup function end




//signin function is start

let signin=(req,res)=>{
    
    let checkemail=()=>{
        return new Promise((resolve,reject)=>{
             if(req.body.email){
                 UserModel.findOne({email:req.body.email},(err,result)=>{
                     if(err){
                        logger.captureError(err.message,'checkmail',8);
                         let apiResponse=response.response(true,err.message,404,null)
                         reject(apiResponse)
                     }
                     else if(check.isEmpty(result)){
                        logger.captureError('user not found','checkmail',8);
                         let apiResponse=response.response(true,'user not found',400,null)
                         reject(apiResponse)
                     }
                     else {
                         resolve(result)
                     }
                 })
             }
             else {
                logger.captureError('Email parameter is missing','checkmail',8);
                 let apiResponse=response.response(true,'Email parameter is missing',500,null)
                 reject(apiResponse)
             }
        })
    }
    let checkpassword=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            if(req.body.password){
                passwordhashing.comparepassword(req.body.password,userDetails.password,(err,result)=>{
                    if(err){
                        logger.captureError("password is not match",'checkpassword',8);
                        let apiResponse=response.response(true,"password is not match",404,null)
                        reject(apiResponse)
                    }
                    else if(result){
                        let newuserDetails=userDetails.toObject();
                        delete newuserDetails.password;
                        delete newuserDetails.__v;
                        delete newuserDetails._id;
                        resolve(newuserDetails);
                    }
                    else {
                        logger.captureError('Log In Failed.Wrong Password','checkpassword',8);
                        let apiResponse=response.response(true,'Log In Failed.Wrong Password',400,null)
                        reject(apiResponse)
                    }
                })
            }
            else {
                logger.captureError('passeord parrameter is missing','checkpassword',8);
                let apiResponse=response.response(true,'passeord parrameter is missing',404,null)
                reject(apiResponse)
            }
        })
    } 

    let generatetoken=(newuserDetails)=>{
        return new Promise((resolve,reject)=>{
             token.generateToken(newuserDetails,(err,tokenDetails)=>{
                 if(err){
                    logger.captureError('some error occured','genertae token',8);
                    let apiResponse=response.response(true,'token is not generated',400,null)
                    reject(apiResponse)
                 }
                 else {
                     tokenDetails.userId=newuserDetails.userId;
                     tokenDetails.userDetails=newuserDetails;
                   
                     resolve(tokenDetails);
                 }
             })
        })
    }
    let saveToken=(tokenDetails)=>{
        
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId},(err,retrievedUserSetails)=>{
                if(err){
                    logger.captureError(err.message,'userController:saveToken',10)
                    let apiResponse=response.generate(true,'Failed to Generate Token',500,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(retrievedUserSetails)) {
                    let newAuthToken=new AuthModel({
                        userId:tokenDetails.userId,
                        authToken:tokenDetails.token,
                        tokenSecret:tokenDetails.tokenSecret,
                        tokenGenerationTime:Date.now()
                    })
                   
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            logger.captureError(err.message,'userController:saveToken()',10)
                            let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
                            reject(apiResponse)
                        }
                        else{
                            let responseBody={
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            
                            resolve(responseBody)
                        }
                    })
                }else {
                    retrievedUserSetails.authToken=tokenDetails.token;
                    retrievedUserSetails.tokenSecret=tokenDetails.tokenSecret;
                    retrievedUserSetails.tokenGenerationTime=Date.now();
                    retrievedUserSetails.save((err,newTokenDetails)=>{
                             if(err){
                                 logger.captureError(err.message,'userController:saveToken()',10)
                                 let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
                                 reject(apiResponse)
                             }
                             else {
                                   let responseBody={
                                    authToken:newTokenDetails.authToken,
                                    userDetails:tokenDetails.userDetails
                                   }
                                  
                                   resolve(responseBody)
                             }
                    })
                    
                }
            })
        })
    
    }
       
    checkemail(req,res)
    .then(checkpassword)
    .then(generatetoken)
    .then(saveToken)
    .then((resolve)=>{
        
        let apiResponse=response.response(false,'signin successfully',200,resolve);
        res.send(apiResponse)
    })
    .catch((reject)=>{
  
    res.send(reject)
   
    })
}
//sign in function end



//get all users code start
 
let getallusers=(req,res)=>{
    UserModel.find()
    .exec((err,result)=>{
        if(err){
            let apiResponse=response.generate(true,'Failed To Get All Users',500,null);
            res.send(apiResponse);
        }
        else {
         let apiResponse=response.response(false,'Users Are Found',200,result);
        res.send(apiResponse)
        }
    })
}

//get all users code end  



//create event code start

let createevent=(req,res)=>{
    let createnewevent=new EventModel({
        eventId: shortid.generate(),
        userId: req.body.userId,
        adminId: req.body.adminId,
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        startHour: req.body.startHour,
        startMinute: req.body.startMinute,
        endHour: req.body.endHour,
        endMinute: req.body.endMinute,
        adminName: req.body.adminName,
        color: req.body.color,
        purpose: req.body.purpose,
        location: req.body.location
    })
    createnewevent.save((err,result)=>{
        if (err) {
            let apiResponse = response.response(true,'Failed to register Event', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.response(true,'Event not found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.response(false, 'Event created', 200, result)
            res.send(apiResponse)
        }
    })
}

//create event code end


//get all events code strat
 let getallevents=(req,res)=>{
   EventModel.find({userId:req.body.userId},(err,result)=>{
    if (err) {
        let apiResponse = response.response(true,'Failed to get Event',403, null)
        res.send(apiResponse)
    } else if (check.isEmpty(result)) {
        let apiResponse = response.response(true,'Events Are not found',500, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.response(false,'Events Are Listed', 200, result)
        res.send(apiResponse)
    }
   })
 }
//get all users code end


//get single event code start
 let getsingleevent=(req,res)=>{
    EventModel.findOne({eventId:req.body.eventId},(err,result)=>{
     if (err) {
         let apiResponse = response.response(true,'Failed to get Single Event',403, null)
         res.send(apiResponse)
     } else if (check.isEmpty(result)) {
         let apiResponse = response.response(true,'Event not found',500, null)
         res.send(apiResponse)
     } else {
         let apiResponse = response.response(false,'Event Listed', 200, result)
         res.send(apiResponse)
     }
    })
  }
//get single event code end

//delete event code start
let deleteevent=(req,res)=>{
    EventModel.deleteOne({eventId:req.body.eventId},(err,result)=>{
        if(err){
        let apiResponse=response.response(true,'some error occured',500,null)
        res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,"Events Is Deleted Successfully",200,result);
            res.send(apiResponse)
        }
    })
}
//delete event code end


//edit event code start
let updateevent=(req,res)=>{
    let options=req.body;
    EventModel.update({eventId:req.body.eventId},options,{multi:true}).exec((err,result)=>{
        if(err){
            logger.captureError('some error occured','update event',6)
        let apiResponse=response.response(true,'some error occured',403,null)
        res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,"Events Is Updated Successfully",200,result);
            res.send(apiResponse)
        }
    })
}
//edit event code end



//reset code start
let resetcode=(req,res)=>{     
    let findmaildetails=()=>{
        return new Promise((resolve,reject)=>{
            if(req.body.email){
                
                UserModel.findOne({email:req.body.email},(err,result)=>{
                    if(err){
                        logger.captureError('some error occured','findemaildetails',9)
                        let apiResponse=response.response(true,'some error occured',400,null)
                        reject(apiResponse)
                    }
                    else if(check.isEmpty(result)){
                        let apiResponse=response.response(true,'User is not found',403,null)
                        res.send(apiResponse)
                    }
                    else  {
                            let resetnumber=Math.floor(Math.random() * (99999-10000+1)) +1000;
                             result.resetId=resetnumber;
                                result.save((err,result)=>{
                                    if(err){
                                        logger.captureError('some error occured','fimdemaildetails',5)
                                        let apiResponse=response.response(true,'some error occured',500,null)
                                        reject(apiResponse)
                                    }
                                    else {
                                        resolve(req)
                                    }
                                })
                            }
                        })
            }
          else {
            logger.captureError('some error occured','findemaildetails',7)
            let apiResponse=response.response(true,'Email parameter is missing',500,null)
            reject(apiResponse)
          }
        })
    }
    //reset code end


  //send mail code start 
  let sendmail=()=>{
      return new Promise((resolve,reject)=>{
          UserModel.findOne({email:req.body.email},(err,result)=>{
              if(err){
                logger.captureError('some error occured','sendmail',8)
                let apiResponse=response.response(true,'some error occured',400,null)
                reject(apiResponse)
              }
              else if(check.isEmpty(result)){
                let apiResponse=response.response(true,'Code is not found',500,null)
                res.send(apiResponse)
            }
              else {
                  
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'ashokbejo01@gmail.com',
                        pass:'ashokbejo01@10@97'
                    }
                });
                let mailOptions={
                    from:'"Meeting Planner"',
                    to:result.email,
                    subject:'"Welcome to Meeting Planner app"',
                    html:`<p>YOUR RESET PASSWORD CODE IS</p> <h1>${result.resetId}</h1>`
                }
                transporter.sendMail(mailOptions,function(err,data){
                    if(err){
                        logger.captureError('some error occured','sendmail',9)
                        let apiResponse=response.response(true,'some error occured',500,null)
                        reject(apiResponse)
                    }
                    else {
                        resolve('Reset Code send successfully')
                    }
                })
              }
          })
      })
  }
     findmaildetails(req,res)
     .then(sendmail)
   .then((resolve)=>{
       let apiResponse=response.response(false,'Reset code send your Email',200,resolve);
       res.send(apiResponse);
   })
   .catch((reject)=>{
       res.send(reject);
   })
}
//send mail code end



//resetpassword code start
let resetpassword=(req,res)=>{
    if(req.body.resetId){
        UserModel.findOne({resetId:req.body.resetId},(err,result)=>{
            if(err){
                logger.captureError('some error occured','Reset password',5)
                let apiResponse=response.response(true,'Reset code is Wrong',403,null)
                res.send(apiResponse)
            }
            else if(check.isEmpty(result)){
                let apiResponse=response.response(true,'Reset code is Wrong',500,null)
                res.send(apiResponse)
            }
            else {
                 result.password=passwordhashing.hashpassword(req.body.password);
                 let resetnumber=Math.floor(Math.random() * (99999-10000+1)) +1000;
                 result.resetId=resetnumber;
                        result.save((err,result)=>{
                            if(err){
                                logger.captureError('some error occured','Reset password',5)
                                let apiResponse=response.response(true,'Reset code is Wrong',500,null)
                                res.send(apiResponse)
                            }
                            else {
                                let apiResponse=response.response(false,'Your Password Is Reset Successfully',200,result)
                                res.send(apiResponse)
                            }
                        })
            }
        })
    }
       else {
        let apiResponse=response.response(true,'Reset code is Missing',403,null)
        res.send(apiResponse)
       }
}
//resetpassword code end



//send email for creat event code start
let sendCreatedMail = (req,res) => {
    if (req.body.userId) {
        UserModel.findOne({userId:req.body.userId},(err,userDetails) => {
            if (err) {
                let apiResponse=response.response(true,'some error occured',500,null);
                res.send(apiResponse)
            } 
            else if(userDetails) {
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'ashokbejo01@gmail.com',
                        pass:'ashokbejo01@10@97'
                    }
                });
                let mailOptions = {
                    from: '"Scheduler"',
                    to: userDetails.email,
                    subject: '"Welcome to Meeting Planner"',
                    html: `<h2>Event scheduled</h2><br><h4>The event ${req.body.title} has been scheduled </h4>
                          <p>Event will be start in ${req.body.start}</p>`

                }
                transporter.sendMail(mailOptions, function (err,data) {
                    if (err) {
                        let apiResponse=response.response(true,'Email Is Not Send Succesfully',403,null);
                        res.send(apiResponse);
                    }
                    else {
                       let apiResponse=response.response(false,'Email Is send Sucesfully',200,data);
                       res.send(apiResponse);
                    }
                })

            }
        });

    } else {
        let apiResponse = response.response(true, 'userId is missing', 400, null)
        reject(apiResponse)
    }
}
//send email for event code is end



//send email edit event code start
let sendeditMail = (req,res) => {
    console.log(req.body.userId)
    if (req.body.userId) {
        UserModel.findOne({userId:req.body.userId},(err,userDetails) => {
            if (err) {
                let apiResponse=response.response(true,'some error occured',500,null);
                res.send(apiResponse)
            } 
            else if(userDetails) {
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'ashokbejo01@gmail.com',
                        pass:'ashokbejo01@10@97'
                    }
                });
                let mailOptions = {
                    from: '"Scheduler"',
                    to: userDetails.email,
                    subject: '"Welcome to Meeting Planner"',
                    html: `<h2>Event Is Edited by ${req.body.adminName}</h2><br><h4>Small Change Is Added Your ${req.body.title}Event .Go Ands Check</h4>`

                }
                transporter.sendMail(mailOptions, function (err,data) {
                    if (err) {
                        let apiResponse=response.response(true,'Email Is Not Send Succesfully',403,null);
                        res.send(apiResponse);
                    }
                    else {
                       let apiResponse=response.response(false,'Email Is send Sucesfully',200,data);
                       res.send(apiResponse);
                    }
                })

            }
        });

    } else {
        let apiResponse = response.response(true, 'userId is missing', 400, null)
        reject(apiResponse)
    }
}
//send edit email code is end



//send email delete event code start
let sendedeletedMail = (req,res) => {
    if (req.body.userId) {
        UserModel.findOne({userId:req.body.userId},(err,userDetails) => {
            if (err) {
                let apiResponse=response.response(true,'some error occured',500,null);
                res.send(apiResponse)
            } 
            else if(userDetails) {
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'ashokbejo01@gmail.com',
                        pass:'ashokbejo01@10@97'
                    }
                });
                let mailOptions = {
                    from: '"Scheduler"',
                    to: userDetails.email,
                    subject: '"Welcome to Meeting Planner"',
                    html: `<h2>Event Canceled</h2><br><h4>Your ${req.body.title} Event Is Canceled by ${req.body.adminName}</h4>`

                }
                transporter.sendMail(mailOptions, function (err,data) {
                    if (err) {
                        let apiResponse=response.response(true,'Email Is Not Send Succesfully',403,null);
                        res.send(apiResponse);
                    }
                    else {
                       let apiResponse=response.response(false,'Email Is send Sucesfully',200,data);
                       res.send(apiResponse);
                    }
                })

            }
        });

    } else {
        let apiResponse = response.response(true, 'userId is missing', 400, null)
        reject(apiResponse)
    }
}
//send event delete email code is end





//send mail on  start time of event code is start
let sendAlarmMail = (userId, title, name) => {
    if (userId) {
        UserModel.findOne({ userId: userId }, (err, userDetails) => {
            if (err) {
                logger.captureError('Failed To Retrieve User Data', 'userController: findUser()', 10)
               
            } else if (check.isEmpty(userDetails)) {

                logger.captureError('No User Found', 'userController: findUser()', 7)
            } else {
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'ashokbejo01@gmail.com',
                        pass:'ashokbejo01@10@97'
                    }
                });
                let mailOptions = {
                    from: '"Scheduler"',
                    to: userDetails.email,
                    subject: '"Welcome to Meeting Planner"',
                    html: `<h2>Event started</h2><br><h4>The scheduled event ${title} by  ${name} has started </h4>`


                }
                transporter.sendMail(mailOptions, function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log('Mail for alarm successfully')
                    }
                })

            }
        });

    } else {
        let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
        reject(apiResponse)
    }
}
////function to send mail on start time of event 


module.exports={
    signup:signup,
    signin:signin,
    getallusers:getallusers,
    createevent:createevent,
    getallevents:getallevents,
    getsingleevent:getsingleevent,
    deleteevent:deleteevent,
    updateevent:updateevent,
    resetcode:resetcode,
    resetpassword:resetpassword,
    sendCreatedMail:sendCreatedMail,
    sendeditMail:sendeditMail,
    sendedeletedMail:sendedeletedMail,
    sendAlarmMail:sendAlarmMail
}