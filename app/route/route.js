const appConfig=require('./../Config/appConfig');
const controller=require('./../controller/usercontroller');
const authorization=require('./../middlewares/auth');

let setRouter=(app)=>{
    let baseUrl=`${appConfig.apiVersion}/users`;
  
    app.post(`${baseUrl}/signup`,controller.signup);
    /**
     * @api {post} /api/v1/users/signup Signup
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} firstName of the user passed as a body parameter
     * @apiParam {String} lastName of the user passed as a body parameter
     * @apiParam {String} email of the user passed as a body parameter
     * @apiParam {String} password of the user passed as a body parameter
     * @apiParam {String} countrycode of the user passed as a body parameter
     * @apiParam {String} AccountType of the user passed as a body parameter
     * @apiParam {Number} mobileNumber of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"signup successfully",
     *   "status":200,
     *   "data": [
     *             {
     *             userId:"string",
     *             resetId:"string",
     *             firstName:"string",
     *             lastName:"string",
     *             userId:"string",
     *             countrycode:"number",
     *             accounttype:"number",
     *             mobileNumber:"number"
     *             }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":500/403/400,
     *      "data":null
     *    }
     */



    app.post(`${baseUrl}/signin`,controller.signin);
    /**
     * @api {post} /api/v1/users/signin Signin
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} email of the user passed as a body parameter
     * @apiParam {String} password of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"signin successfully",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                firstName:"string",
     *                lastName:"string",
     *                email:"string",
     *                userId:"string",
     *                accounttype:"string",
     *                mobileNumbernumber:"number",
     *                countrycode:"number"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.get(`${baseUrl}/allUsers/:authToken`,authorization.isAuthorized,controller.getallusers);
      /**
     * @api {get} /api/v1/users/allUsers Get All Users
     * @apiVersion 0.0.1
     * @apiGroup get
     * 
     * 
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Users Are listed",
     *   "status":200,
     *   "data": [
     *              {
     *             userId:"string",
     *             resetId:"string",
     *             firstName:"string",
     *             lastName:"string",
     *             userId:"string",
     *             countrycode:"number",
     *             accounttype:"number",
     *             mobileNumber:"number"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/createevent`,authorization.isAuthorized,controller.createevent);
     /**
     * @api {post} /api/v1/users/createevent create event
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} Title of the user passed as a body parameter
     * @apiParam {String} purpose of the user passed as a body parameter
     * @apiParam {String} location of the user passed as a body parameter
     * @apiParam {String} color of the user passed as a body parameter
     * @apiParam {String} startDate of the user passed as a body parameter
     * @apiParam {String} endDate of the user passed as a body parameter
     * @apiParam {String} startMinute of the user passed as a body parameter
     * @apiParam {String} endminute of the user passed as a body parameter
     * @apiParam {String} authToken of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Event Is Created Successfully",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                eventId:"string"
     *                title:"string",
     *                locatio :"string",
     *                purpose:"string",
     *                color:"string",
     *                startDate:"number",
     *                endDate:"number",
     *                startMinute:"number",
     *                endMinute:"number"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/getallevents`,authorization.isAuthorized,controller.getallevents);
       /**
     * @api {post} /api/v1/users/getallevents get all event
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Users Are Listed",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                eventId:"string"
     *                title:"string",
     *                locatio :"string",
     *                purpose:"string",
     *                color:"string",
     *                startDate:"number",
     *                endDate:"number",
     *                startMinute:"number",
     *                endMinute:"number"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */



    app.post(`${baseUrl}/getsingleevent`,authorization.isAuthorized,controller.getsingleevent);
       /**
     * @api {post} /api/v1/users/getsingleevent get single event
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * @apiParam {String} eventId of the user passed as a body parameter
     * 
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Event Is Getting Successfully",
     *   "status":200,
     *   "data": [
     *              {
     *                userId:"string",
     *                eventId:"string"
     *                title:"string",
     *                locatio :"string",
     *                purpose:"string",
     *                color:"string",
     *                startDate:"number",
     *                endDate:"number",
     *                startMinute:"number",
     *                endMinute:"number"
     *              }
     *           ]  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/deleteevent`,authorization.isAuthorized,controller.deleteevent);
      /**
     * @api {post} /api/v1/users/deleteevent delete event
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * @apiParam {String} eventId of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Event Is Deleted Successfully",
     *   "status":200,
     *   "data": []  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/editevent`,authorization.isAuthorized,controller.updateevent);
       /**
     * @api {post} /api/v1/users/editevent edit event
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * 
     * @apiParam {String} authToken of the user passed as a body parameter
     * @apiParam {String} eventId of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Event Is Edited Successfully",
     *   "status":200,
     *   "data": []  
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400/500/403,
     *      "data":null
     *    }
     */




    app.post(`${baseUrl}/resetcode`,controller.resetcode);
      /**
     * @api {post} /api/v1/users/resetcode Password Reset
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} email of the user passed as a body parameter
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Reset Code send successfully",
     *   "status":200,
     *   "data": []
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400,
     *      "data":null
     *    }
     */



    app.post(`${baseUrl}/resetpassword`,controller.resetpassword);
       /**
     * @api {post} /api/v1/users/resetpassword Password Reset
     * @apiVersion 0.0.1
     * @apiGroup post
     * 
     * @apiParam {String} resetId of the user passed as a body parameter
     * @apiParam {String} Newpassword of the user passed as a body parameter
     * 
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
     *   "error":false,
     *   "message":"Your Password Is Reset Successfully",
     *   "status":200,
     *   "data": []
     *  }
     *   @apiErrorExample {json} Error-Response:
     *    {
     *      "error":true,
     *      "message":"Error Occured",
     *      "status":400,
     *      "data":null
     *    }
     */
    
    app.post(`${baseUrl}/sendcreatedmail`,controller.sendCreatedMail);
    app.post(`${baseUrl}/sendeditmail`,controller.sendeditMail);
    app.post(`${baseUrl}/sendedeletemail`,controller.sendedeletedMail);
}

module.exports={
    setRouter:setRouter
}