import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)

    useEffect(()=>{
        if (!userData?._id) return

        const updateLocation=async (lat,lon) => {
            try {
                const result=await axios.post(
                    `${serverUrl}/api/user/update-location`,
                    { lat, lon },
                    { withCredentials:true }
                )
                console.log(result.data)
            } catch (error) {
                console.error('Failed to update location', error.response?.data || error.message)
            }
        }

        const watchId=navigator.geolocation.watchPosition(
            (pos)=>{
                updateLocation(pos.coords.latitude,pos.coords.longitude)
            },
            (error)=>{
                console.error('Geolocation error', error.message)
            },
            { enableHighAccuracy: true }
        )

        return () => navigator.geolocation.clearWatch(watchId)
    },[userData?._id])
}

export default useUpdateLocation
