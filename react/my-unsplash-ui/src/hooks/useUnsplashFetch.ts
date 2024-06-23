import { useState, useEffect } from "react";
import { UnsplashPhotosResponse, UnsplashLikedPhotosResponse } from "../models/unsplashApiTypes";
import { UNSPLASH_ACCESS_KEY } from "../globals/tokens";




const useUnsplashFetch = (url : string, forceRender: any = undefined) => {
    const [res , setRes] = useState<UnsplashPhotosResponse | UnsplashLikedPhotosResponse | null>(null)
    const [isPeding, setIsPeding] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const abortCtr = new AbortController()

        if (url){   
            res && setRes(null)
            setIsPeding(true)

            fetch(`${url}&client_id=${UNSPLASH_ACCESS_KEY}`, { signal : abortCtr.signal})
            .then(res => {
                if (!res.ok) {
                    throw Error('not properly resource')
                }
                return res.json()
            })
            .then( (data : UnsplashPhotosResponse | UnsplashLikedPhotosResponse) => {
                setIsPeding(false)
                setRes(data)
                setError("")
            })
            .catch( (err : Error) => {
                if (err.name !== 'AbortError') {
                    setIsPeding(false)
                    setError(err.message)
                }
            })
        }


        return () => abortCtr.abort()
    }, [url, forceRender])

    return {res, isPeding, error}
}

export default useUnsplashFetch