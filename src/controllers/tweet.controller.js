import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const createTweet = asyncHandler(async (req, res) => {

    const {tweet} = req.body
    // const {tweetfile} = req.file
   
    if(!tweet){
        throw new ApiError(400, "tweet is reqired")
    }
    let tweetfile=req.file?.path;
    console.log(tweetfile);
    // if (req.file && Array.isArray(req.file.tweetfile) && req.file.tweetfile.length > 0) {
    //     tweetfile = req.file.tweetfile[0].path
    // }
    if(!tweetfile){
        throw new ApiError(400, "tweetfile file not found")
    }

    const tweetfileRes = await uploadOnCloudinary(tweetfile)
    if(!tweetfileRes.url){
        throw new ApiError(400,"tweetfile file failed to uploadOnCloudinary")
    }
    const tweetUpload = await Tweet.create({
        content:tweet.toLowerCase(),
        post: tweetfileRes.url,
        owner:req.user._id,
    })
    if(!tweetUpload){
        throw new ApiError(400,"Tweet Uploaded failled")
    }

    return res.status(201).json(
        new ApiResponse(200, tweetUpload, "Video Uploadig Suceesfully")
    )
})

const updateTweet  = asyncHandler(async(req,res)=>{
    const {tweetid} = req.params
    const {content} = req.body
    const user_id = req.user._id
    // console.log(typeof req.user._id)
    console.log(content)
    if(!(tweetid && content)){
        throw new ApiError(400, "Plase Pass the Id")
    }
    const findtweet = await Tweet.findById(tweetid)
    if(!findtweet){
        throw new ApiError(400,"Cant find Tweet")
    }
    const tweetOwnerId =findtweet.owner
    console.log("this is my user id",user_id)
    console.log("this is my tweet owner id",tweetOwnerId)
    if(tweetOwnerId.equals(user_id.toString()))
    {
        const updatedtweet = await Tweet.findByIdAndUpdate(tweetid,{$set:{content}},{new:true})
        if(!updatedtweet)
        {
            throw new ApiError(400, "tweet not found")
        }else{
            return res
            .status(200)
            .json(new ApiResponse(200,updatedtweet,"tweet updated successfully"))
        }
    }else{
        throw new ApiError(400, "Only can owner update tweets")
    }    
})

const deleteTweet = asyncHandler(async (req, res) => {
    
    const {tweetid} = req.params
    const user_id = req.user._id
    
    if(!(tweetid)){
        throw new ApiError(400, "Plase Pass the Id")
    }
    const findtweet = await Tweet.findById(tweetid)
    if(!findtweet){
        throw new ApiError(400,"Cant find Tweet")
    }
    const tweetOwnerId =findtweet.owner
    // console.log("this is my user id",user_id)
    // console.log("this is my tweet owner id",tweetOwnerId)
    if(tweetOwnerId.equals(user_id.toString()))
    {
        const updatedtweet = await Tweet.deleteOne({_id:tweetid})
        if(!updatedtweet)
        {
            throw new ApiError(400, "tweet not found")
        }else{
            return res
            .status(200)
            .json(new ApiResponse(200,updatedtweet,"tweet updated successfully"))
        }
    }else{
        throw new ApiError(400, "Only can owner update tweets")
    }    
})


export {createTweet,updateTweet,deleteTweet}