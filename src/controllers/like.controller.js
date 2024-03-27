import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const user_id = req.user._id
    // console.log(user_id)
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const existingLike = await Like.findOne({ video: videoId, likedBy: user_id });
    if (existingLike){
        // User has already liked the video, so remove the like
        const removeLike = await Like.findByIdAndDelete(existingLike._id);
        return (
            res
            .status(200)
            .json(new ApiResponse(200, removeLike, "Like removed successfully"))
        );
    }else{
        const newLike = await Like.create({ video: videoId, likedBy: user_id});
        return (
            res
            .status(200)
            .json(new ApiResponse(200, newLike, "Like added successfully"))
        );
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const user_id = req.user._id
    // console.log(user_id)
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid video Id");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    const existingLike = await Like.findOne({ comment: commentId, likedBy: user_id });
    if (existingLike){
        // User has already liked the video, so remove the like
        const removeLike = await Like.findByIdAndDelete(existingLike._id);
        return (
            res
            .status(200)
            .json(new ApiResponse(200, removeLike, "Like removed successfully"))
        );
    }else{
        const newLike = await Like.create({ comment: commentId, likedBy: user_id});
        return (
            res
            .status(200)
            .json(new ApiResponse(200, newLike, "Like added successfully"))
        );
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const user_id = req.user._id
    // console.log(user_id)
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid video Id");
    }
    const video = await Tweet.findById(tweetId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: user_id });
    if (existingLike){
        // User has already liked the video, so remove the like
        const removeLike = await Like.findByIdAndDelete(existingLike._id);
        return (
            res
            .status(200)
            .json(new ApiResponse(200, removeLike, "Like removed successfully"))
        );
    }else{
        const newLike = await Like.create({ tweet: tweetId, likedBy: user_id});
        return (
            res
            .status(200)
            .json(new ApiResponse(200, newLike, "Like added successfully"))
        );
    }
})
export {toggleVideoLike,toggleCommentLike,toggleTweetLike}