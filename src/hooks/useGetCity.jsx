import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setUserData 
} from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'
import { serverUrl } from '../config/server'

function useGetCity() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const apiKey = import.meta.env.VITE_GEOAPIKEY

  useEffect(() => {

    // ---- Handling permission errors + async inside geolocation properly ----
    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          // Save to Redux
          dispatch(setLocation({ lat: latitude, lon: longitude }))

          // Reverse geocoding
          const { data } = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
          )

          const res = data?.results?.[0] || {}

          // Save in Redux
          dispatch(setCurrentCity(res.city || res.county || ""))
          dispatch(setCurrentState(res.state || ""))
          dispatch(setCurrentAddress(res.address_line2 || res.address_line1 || ""))

          dispatch(setAddress(res.address_line2 || ""))

        }, (error) => {
          console.log("Location error →", error.message)
        })
      } catch (err) {
        console.log("Failed to get user location:", err)
      }
    }

    fetchLocation()

  }, [userData, apiKey, dispatch])
}

export default useGetCity
