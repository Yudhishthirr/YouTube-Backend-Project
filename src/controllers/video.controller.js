import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiError} from "../utils/ApiError.js"
import { Video } from "../models/video.model.js"



const updateThumnail = asyncHandler(async(req,res)=>{

    // console.log(req.user)
    // console.log(req.body)



    const {videoId} = req.params
    const {thumbnail} = req.file

    console.log(req.params)
    console.log(req.file)
    
    if(!videoId){
        throw new ApiError(400, "Plase Pass the Id for updating video deatils")
    }
    let thumbnailLocalPath=req.file?.path;
    console.log(thumbnailLocalPath);
    // if (req.file && Array.isArray(req.file.thumbnail) && req.file.thumbnail.length > 0) {
    //     thumbnailLocalPath = req.file.thumbnail[0].path
    // }
    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail file not found")
    }

    const thumbnailRes = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnailRes.url){
        throw new ApiError(400,"Avatar file missing uploadOnCloudinary")
    }
    const uploadThumnil = await Video.findByIdAndUpdate(videoId,{$set:{thumbnail:thumbnailRes.url}},{new:true})
    if(!uploadThumnil){
        throw new ApiError(400, "Video not updated because vidoe not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,uploadThumnil,"thumbnail updated successfully"))
})


const getVideoById  = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    console.log(typeof(videoId))
    if(!videoId){
        throw new ApiError(400, "Plase Pass the Id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Video not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video fetched successfully"
        )
    )
    // console.log(video)
})


const publishAVideo = asyncHandler(async(req,res)=>{

    console.log(req.user)
    console.log(req.body)
    console.log(req.files)
    const {title,description} = req.body


    if ([title, description].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }
    let videoFileLocalPath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoFileLocalPath = req.files.videoFile[0].path
    }
    let thumbnailLocalPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if (!(videoFileLocalPath && thumbnailLocalPath)) {
        throw new ApiError(400, "Video is requreid ")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!(videoFile || thumbnail)){
        //note agar uploadOnCloudinary se return null aaya to ?? read it
        throw new ApiError(400, "file is required choudinary error")
    }
    // console.log("this is video duration",videoFile)
    // console.log("vidoe url",videoFile.url)
    // console.log("thumbnail url",thumbnail.url)
    // console.log("video duration",videoFile.duration)
    // console.log(thumbnail)
    // console.log(thumbnail)


    const video = await Video.create({
        videoFile:videoFile.url,
        thumbnail: thumbnail.url,
        title:title.toLowerCase(),
        description:description.toLowerCase(), 
        duration:Number(videoFile.duration),
        owner:req.user._id,
    })
    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading video")
    }

    return res.status(201).json(
        new ApiResponse(200, video, "Video Uploadig Suceesfully")
    )
})


const updateVideo = asyncHandler(async (req, res) => {
    
    console.log(req.params)
    console.log(req.req)
    console.log(req.body)
    const {videoId,title,description} = req.params
    
    if(!videoId){
        throw new ApiError(400, "Plase Pass the Id for updating video deatils")
    }
    if(!(title && description)){
        throw new ApiError(400, "Plase enter title and description")
    }

    const video = await Video.findByIdAndUpdate(videoId,{$set:{title,description}},{new:true})
    if(!video){
        throw new ApiError(400, "Video not updated because vidoe not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,video,"video updated successfully"))
    //TODO: update video details like title, description, thumbnail

})


const getAllvideo = asyncHandler(async(req,res)=>{

    // const { page = 1, limit = 4} = req.quer
    let page
    page = req.query.page || 1
    if(page==0)
    {
        page=1
    }
    // const limit = req.query.limit
    const limit = 5

    const pageNumber = parseInt(page);
    const limitOfComments = parseInt(limit);

    const skip = (pageNumber - 1) * limitOfComments;
    const pageSize = limitOfComments;

    const video = await Video.aggregate([
        {
            $match: {
                isPublished:true
            }
        },
        {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner_details",
              pipeline:[
                {
                  $project:{
                    username: 1,
                    avatar:1
                  }
                }
              ]
            }
        },
         {
            $project: {
              thumbnail:1,
              title:1,
              views:1,
            //   videoFile:1,
              duration:1,
              owner_details:1
            }
        },
        {
            $addFields: {
              owner_details:{
                $first:"$owner_details"
              }
            }
        },
        { $skip: skip },
        { $limit: pageSize }
        // {
        //     $limit: 2
        // },
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video fetched successfully"
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    const user_id = req.user._id
    
    if(!(videoId)){
        throw new ApiError(400, "Plase Pass the Id")
    }
    const findvideo = await Video.findById(videoId)
    if(!findvideo){
        throw new ApiError(400,"Cant find video")
    }
    const videoOwnerId =findvideo.owner
    // console.log("this is my user id",user_id)
    // console.log("this is my tweet owner id",tweetOwnerId)
    if(videoOwnerId.equals(user_id.toString()))
    {
        // const deleteVideoByID = await Video.deleteMany({owner:"65ec76076c4d52e944a02d59"})
        const deleteVideoByID = await Tweet.deleteOne({_id:videoId})
        if(!deleteVideoByID)
        {
            throw new ApiError(400, "video not found")
        }else{
            return res
            .status(200)
            .json(new ApiResponse(200,deleteVideoByID,"video deleted successfully"))
        }
    }else{
        throw new ApiError(400, "Only can owner delete video")
    }    
})
export {getAllvideo,publishAVideo,getVideoById,updateVideo,updateThumnail,deleteVideo}
