import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!(name && description)){
        throw new ApiError(400, "name and description is reqired")
    }
    const createPlaylist = await Playlist.create({
        name,
        description
    })
    if(!createPlaylist){
        throw new ApiError(400,"failled to create Playlist")
    }

    return res.status(201).json(
        new ApiResponse(200, createPlaylist, "Playlist created Suceesfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "Video not found");
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist");
    }
    const updateVideoInPlayList = await Playlist.findByIdAndUpdate(playlistId,{$push:{videos:videoId}},{new:true})
    if(!updateVideoInPlayList){
        throw new ApiError(400, "Fail to Add video in playlist");
    }
    return res.status(201).json(
        new ApiResponse(200, updateVideoInPlayList, "Video Added to Playlist Suceesfully")
    )
})

const removeVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    console.log("this is my playist id",playlistId)
    console.log("this is my videoId id",videoId)
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "Video not found");
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }
    if (playlist.videos.includes(videoId)) {
       
        const removeVideo = await Playlist.findByIdAndUpdate(playlistId,{$pull:{videos:videoId}},{new:true})
        if(!removeVideo){
            throw new ApiError(400, "Fail to delet video in playlist");
        }
        return res.status(201).json(
            new ApiResponse(200, removeVideo, "Video deleted from Playlist Suceesfully")
        )
        // throw new ApiError(400, "Video already exists in the playlist");
    }else{
        throw new ApiError(400, "Video not found");
    }
    
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    console.log("this is my playist id",playlistId)
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist Id");
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }
    const removeplaylist = await Playlist.deleteOne({_id:playlistId})
    if(!removeplaylist){
        throw new ApiError(400, "Fail to delet playlist");
    }
    return res.status(201).json(
        new ApiResponse(200, removeplaylist, "playlist deleted Suceesfully")
    )
    
})

export {createPlaylist,addVideoToPlaylist,removeVideoToPlaylist,deletePlaylist}