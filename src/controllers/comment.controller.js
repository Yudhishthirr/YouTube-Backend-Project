import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const user_id = req.user._id
    const {comment} = req.body
    // console.log(user_id)
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (!comment) {
        throw new ApiError(404, "Please Enter comment");
    }
    const commentres = await Comment.create({content:comment,video:videoId,owner:user_id});
    if (!commentres) {
        throw new ApiError(404, "Video not found");
    }
    return (
        res
        .status(200)
        .json(new ApiResponse(200, commentres, "comment added successfully"))
    );    
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    const user_id = req.user._id
    console.log(content)
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalied comment id")
    }
    // console.log(content)
    if(!content){
        throw new ApiError(400, "comment is requeird")
    }
    const findComment = await Comment.findById(commentId)
    if(!findComment){
        throw new ApiError(400,"Cant find comment")
    }
    // const tweetOwnerId =findtweet.owner
    // console.log("this is my user id",user_id)
    // console.log("this is my tweet owner id",tweetOwnerId)
    if(findComment.owner.equals(user_id.toString()))
    {
        const updatedcomment = await Comment.findByIdAndUpdate(commentId,{$set:{content}},{new:true})
        if(!updatedcomment)
        {
            throw new ApiError(400, "comment not found")
        }else{
            return res
            .status(200)
            .json(new ApiResponse(200,updatedcomment,"comment updated successfully"))
        }
    }else{
        throw new ApiError(400, "Only can owner update comment")
    }    
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const user_id = req.user._id
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalied comment id")
    }
    const findComment = await Comment.findById(commentId)
    if(!findComment){
        throw new ApiError(400,"Cant find comment")
    }
    // const tweetOwnerId =findtweet.owner
    // console.log("this is my user id",user_id)
    // console.log("this is my tweet owner id",tweetOwnerId)
    if(findComment.owner.equals(user_id.toString()))
    {
        const deletecomment = await Comment.deleteOne({_id:commentId})
        if(!deletecomment)
        {
            throw new ApiError(400, "failled to delet comment")
        }else{
            return res
            .status(200)
            .json(new ApiResponse(200,deletecomment,"comment deleted successfully"))
        }
    }else{
        throw new ApiError(400, "Only can owner update comment")
    }    
})
export {addComment,updateComment,deleteComment}