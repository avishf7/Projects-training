import { FormEvent, useState, ChangeEvent, useRef, MutableRefObject, useEffect } from "react";
import { UnsplashPhoto, UnsplashPhotosResponse} from "../models/unsplashApiTypes";
import useUnsplashFetch from "../hooks/useUnsplashFetch";
import PicList from "../components/PicList";

type OrderOptions = "latest" | "relevant" 
type OrientationOptions = "landscape" | "portrait" | "squarish" 
type ColorOptions = "black_and_white" 
                    | "black" | "white" 
                    | "yellow" | "orange" 
                    | "red" | "purple"
                    | "magenta" | "green" 
                    | "teal" | "blue" 

type SearchData = {
    keyword: string,
    orderBy?: OrderOptions
    orientation?: OrientationOptions
    color?: ColorOptions
} | null

function fetchDetails(url: string) {
    let pics : UnsplashPhoto[] | null = null
    let total_pages : number = 0

    const { res,  isPeding,  error } = useUnsplashFetch(url)
    res && (pics = (res as UnsplashPhotosResponse).results)
    res && (total_pages = (res as UnsplashPhotosResponse).total_pages)

    return { pics ,total_pages, isPeding, error }
}

function createUrlFromData(data: SearchData, pageIndex: number) {
    let tmpUrl = `https://api.unsplash.com/search/photos?query=${data?.keyword}&page=${pageIndex}&per_page=20`;

    if (data?.orderBy) { tmpUrl += `&order_by=${data.orderBy}`; }
    if (data?.orientation) { tmpUrl += `&orientation=${data.orientation}`; }
    if (data?.color) { tmpUrl += `&color=${data.color}`; }
    
    return tmpUrl;
}


const Home = () => {
    const [data, setData] = useState<SearchData>(null) 
    const [url, setUrl] = useState<string>("")
    const pageIndex = useRef<number>(1)

    const hideStyle = {
        display: 'none'
    }


    const {pics , total_pages, isPeding, error} = fetchDetails(url)

    useEffect(() => {      
        if (data?.keyword) {
            pageIndex.current = 1
            setUrl(createUrlFromData(data, pageIndex.current))  
        }
    }, [data])

    function handleSubmit(ev: FormEvent<HTMLFormElement>): void {
        ev.preventDefault() ; 
        const keyword = new FormData(ev.target as HTMLFormElement).get('keyword') as string 
        if(keyword){
            setData(prevData => ({
                ...prevData ,
                keyword : keyword      
            }))
        }

    }

    function handleOrderChange(ev: ChangeEvent<HTMLSelectElement>): void {
            setData(prevData => ({
                ...prevData,
                orderBy: ev.target.value as OrderOptions,
                keyword: prevData?.keyword ?? ""
            }))
    }

    function handleColorChange(ev: ChangeEvent<HTMLSelectElement>): void {
        setData(prevData => ({
            ...prevData,
            color: ev.target.value as ColorOptions,
            keyword: prevData?.keyword ?? ""
        }))
    }

    function handleOrientationChange(ev: ChangeEvent<HTMLSelectElement>): void {
        setData(prevData => ({
            ...prevData,
            orientation: ev.target.value as OrientationOptions,
            keyword: prevData?.keyword ?? ""
        }))

    }

    function handlePageIndexClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        const increase = (ev.target as HTMLElement).textContent === ">"

        increase? pageIndex.current += 1: pageIndex.current -= 1
        setUrl(createUrlFromData(data, pageIndex.current))  
    }


    function handleRefreshClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        const filter: string = (ev.target as HTMLElement).parentElement?.id ?? ""

        switch (filter) {
            case "order":
                if (data?.orderBy) {
                    setData({
                        ...data,
                        orderBy: undefined
                    })
                }
                break;
            case "orientation":
                if (data?.orientation) {
                    setData({
                        ...data,
                        orientation: undefined
                    })
                }
            break;
            case "color":
                if (data?.color) {
                    setData({
                        ...data,
                        color: undefined
                    })
                }
            break;
        }
    }

    return ( 
    <>
    <div className="search-section ">
        <form onSubmit={handleSubmit}>
            <div className="form-item">
                <input placeholder="keyword..."
                       type="text" 
                       name="keyword"
                       required/>
            </div>
            <div className="form-item columns" id="order">
                <label htmlFor="order">Order by:</label>
                <select value={data? data.orderBy? data.orderBy: "" : ""} 
                        onChange={handleOrderChange}>
                    <option value="latest">latest</option>
                    <option value="relevant">relevant</option>
                    <option style={hideStyle} value=""></option>
                </select>
                <button onClick={handleRefreshClick}>⟳</button>
            </div>
            <div className="form-item columns" id="orientation">
                <label htmlFor="orientation">Orientation: </label>
                <select value={data? data.orientation? data.orientation: "" : ""}
                        onChange={handleOrientationChange}>
                    <option value="landscape">landscape</option>
                    <option value="portrait">portrait</option>
                    <option value="squarish">squarish</option>
                    <option style={hideStyle} value=""></option>
                </select>
                <button onClick={handleRefreshClick}>⟳</button>
            </div>
            <div className="form-item columns" id="color">
                <label htmlFor="color">Color: </label>
                <select value={data? data.color? data.color: "" : ""} 
                        onChange={handleColorChange}>
                    <option value="black_and_white">black and white</option>
                    <option value="black">black</option>
                    <option value="white">white</option>
                    <option value="yellow">yellow</option>
                    <option value="orange">orange</option>
                    <option value="red">red</option>
                    <option value="purple">purple</option>
                    <option value="magenta">magenta</option>
                    <option value="green">green</option>
                    <option value="teal">teal</option>
                    <option value="blue">blue</option>
                    <option style={hideStyle} value=""></option>
                </select>
                <button onClick={handleRefreshClick}>⟳</button>
            </div>
            <button className="search-btn">Search</button>
        </form>
    </div>
    {pics && <>
                <section className="index-pic-section">
                    {pageIndex.current > 1 && <button className="index-pic-btn" onClick={handlePageIndexClick}>{"<"}</button>}
                    <p>{`${pageIndex.current}/${total_pages}`}</p>
                    { pageIndex.current < total_pages && <button className="index-pic-btn" onClick={handlePageIndexClick}>{">"}</button>}
                </section>
                <PicList pics={ pics } />
            </>}
    {isPeding && <div>Loading...</div>}
    {error && <div>{ error }</div>}
    </> 
    );
}
 
export default Home;
