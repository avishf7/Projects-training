import { useEffect, useState } from "react";
import PicList from "../components/PicList";
import { UnsplashPhoto } from "../models/unsplashApiTypes";


const LikedPhotos = () => {
    const [pics, setPics] = useState<UnsplashPhoto[] | null>()


    useEffect(() => {
        const jsonPics = localStorage.getItem("likedPics")
        if (jsonPics){
            setPics((JSON.parse(jsonPics as string) as UnsplashPhoto[]))
        }
    }, [])


    return ( 
        <>
        <div className="liked-photos">
            <h1>My liked Photos</h1>
            {pics && <PicList pics={ pics } likedPicUpdateFunction={setPics} /*renderFunc={ setRender } renderFuncValue={prev => !prev}*//>}
            {!pics && <div>empty</div>}
        </div>
        </>
     );
}
 
export default LikedPhotos;