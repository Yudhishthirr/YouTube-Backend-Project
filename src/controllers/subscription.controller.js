import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    //which channel you want to subscribe
    const {channelId} = req.params
    const user_id = req.user._id
    // console.log(channelId)
    if(!isValidObjectId(channelId)){
        throw new ApiError("Invalid channel id")
    }
    const checkchannel = await User.findById(channelId)

    if(!checkchannel){
        throw new ApiError("Channel not found")
    }

    const checkSubscriber=await Subscription.findOne({subscriber:user_id,channel: channelId});

    if(checkSubscriber){

        const unsubscribeTochannel = await Subscription.findOneAndDelete({subscriber:user_id,channel:channelId})

        if (!unsubscribeTochannel) {
            throw new ApiError(404, "failled to Unsubscribere channel");
        }
        return (
            res
            .status(200)
            .json(new ApiResponse(200, unsubscribeTochannel, "Unsubscribere to channel successfully"))
        ); 
    }else{
    const subscribeToChannel = await Subscription.create({subscriber:user_id,channel:channelId});
    
    if (!subscribeToChannel) {
        throw new ApiError(404, "failled to subscribere channel");
    }
    return (
        res
        .status(200)
        .json(new ApiResponse(200, subscribeToChannel, "subscribered to channel successfully"))
    ); }
})
export {toggleSubscription}