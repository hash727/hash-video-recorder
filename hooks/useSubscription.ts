import { useState } from "react"
import axios from 'axios'

export const useSubscription = () => {
    const [isProcessing, setIsprocessing] = useState(false);
    const onSubscribe = async () =>{
        setIsprocessing(true)
        const response = await axios.get("/api/payment")

        if(response.data.status === 200){
            return (window.location.href = `${response.data.session_url}`)
        }
        setIsprocessing(false)
    }
    return{onSubscribe, isProcessing}
}