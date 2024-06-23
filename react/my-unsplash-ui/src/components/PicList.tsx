import { SetStateAction, useEffect, useRef, useState } from "react";
import { UnsplashPhoto } from "../models/unsplashApiTypes";


const CHUNK_SIZE = 5;

const PicList = <T,>(props : {pics : UnsplashPhoto[] ,likedPicUpdateFunction? : (value: SetStateAction<T>) => void} ) => {
    const [likedPics, setLikedPics] = useState<UnsplashPhoto[]>([])
    const likedPicsID = likedPics?.map(pic => pic.id)
    const isPeding = useRef(false) 
    const picColumns: UnsplashPhoto[][] = [...Array(Math.ceil(props.pics.length / CHUNK_SIZE))].map( (_, i) => props.pics.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE))

    useEffect(() => {
        isPeding.current = true
        const jsonPics = localStorage.getItem("likedPics")
        if (jsonPics){
            setLikedPics((JSON.parse(jsonPics as string) as UnsplashPhoto[]))
        }
    }, [])
    
    useEffect(() => {
        if (isPeding.current) {
            isPeding.current = false
        } else {
            localStorage.setItem("likedPics", JSON.stringify(likedPics));
            props.likedPicUpdateFunction && props.likedPicUpdateFunction(likedPics as T)
        } 
    }, [likedPics])

    function handleClick(ev: React.MouseEvent<HTMLButtonElement>): void {
        const imgID = ev.currentTarget.parentElement?.id 


        if (likedPicsID?.includes(imgID as string)){
            setLikedPics(likedPics?.filter(pic => pic.id !== imgID))  
        } else {
            setLikedPics(likedPics.concat([props.pics.find( pic => pic.id === imgID) as UnsplashPhoto]))
        }       
    }

    return (
        <div className="pic-list" >
            {props.pics[0]? picColumns.map( (picCol : UnsplashPhoto[]) => (
                <div className="pic-col">
                    {picCol.map( (pic : UnsplashPhoto) => (
                        <div className="pic" key={pic.id} id={pic.id}>
                            <img src={pic.urls.thumb} alt={pic.alt_description as string} />
                            <button onClick={handleClick} className="pic-button" 
                                style={likedPicsID?.includes(pic.id as string)? {backgroundColor: "#FF0000", color: "white"}: {backgroundColor: "ButtonFace"}}>
                                ♡
                            </button>
                        </div>
                    ))}   
                </div>
            )) : "Not found"}
        </div>
      );
}
 
export default PicList;