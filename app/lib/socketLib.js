const socketio=require('socket.io');
const mongoose=require('mongoose');
const userpath=require('./../models/UserModel');
const UserModel= mongoose.model('UserModel');
const check=require('./../lib/checkLib');
const redisLib=require('./../lib/redisLib');
const eventpath=require('./../models/event');
const EventModel=mongoose.model('eventModel');
const controller=require('./../controller/usercontroller');

let setServer=(server)=>{
   
    let io=socketio.listen(server);
    let myio=io.of('');

    myio.on('connection',(socket)=>{
       

        socket.emit('verifyUser','');
        //coder to verify the user and make him online
           
        
        //setuser code is start
        socket.on('set-user',(userId)=>{
            UserModel.findOne({userId:userId},(err,result)=>{
                if(err){
                    socket.emit('user-error',{status:403,message:'user is not found'})
                }
                else if(check.isEmpty(result)) {
                    socket.emit('user-error',{status:403,message:'user is not found'})
                }
                else {
                    let currentUser=result;

                    socket.userId=currentUser.userId;
                         
                    let fullName=`${currentUser.firstName} ${currentUser.lastName}`;

                    let key=currentUser.userId;
                     let value=fullName;
                     let setUserOnline=redisLib.setNewOnlineUserInHash('onlineUsers',key,value,(err,result)=>{
                         if(err){
                             console.log(err)
                         }
                         
                         else {
                             redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                                 if(err){
                                     console.log(err)
                                 }
                                 else {
                                     socket.room='meeting-planner';
                                     socket.join(socket.room)
                                     socket.to(socket.room).broadcast.emit('online-user-list',result);
                                 }
                             })
                         }
                     })
                }
            })
    })
      //setuser code is end
    
      
        //socet disconnect code start
        socket.on('disconnect',()=>{
            if(socket.userId){
            redisLib.deleteUserFromHash('onlineUsers',socket.userId);
            redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                if(err){
                    console.log(err)
                }
                else {
                    socket.leave(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',result)
                }
            })
        }
           })
        //socket disconnect code end

        //Delete code start
        socket.on('Delete-Event',(data)=>{
           socket.broadcast.emit(`${data.userId} delete`,data)
        })
        //Delete code end


        //edit notify code start
        socket.on('Edit-Event',(data)=>{
            socket.broadcast.emit(`${data.userId} edit`,data)
        })
        //edit notify code end

         //create notify code start
         socket.on('Create-Event',(data)=>{
            socket.broadcast.emit(`${data.userId} create`,data)
        })
        //create notify code end
           

        //function for event starting alarm code start
        setInterval(function () {
            EventModel.find()
            .select(' -__v -_id')
                .lean()
                .exec((err, result) =>{
                    if (err) {
                        console.log(err)
                    
                    } else if (check.isEmpty(result)) {
                       
                    } else {
                        let min= new Date().getMinutes()
                       let hours= new Date().getHours()
                       let month= new Date().getMonth()
                       let day= new Date().getDay()

                        for (let x of result){
                            m = (new Date(x.start).getMonth())
                            d = (new Date(x.start).getDay())                        
                            if (min == x.startMinute && hours == x.startHour && month == m && day == d) {
                            controller.sendAlarmMail(x.userId, x.title, x.adminName)
                            data = { adminName: x.adminName, userId: x.userId, title: x.title }
                            myio.emit('alarm', data);
                        }}

                    }
                })
        
    }, 59000)
    //staring for event starting code is end
        
                })
}


module.exports={
    setServer:setServer
}