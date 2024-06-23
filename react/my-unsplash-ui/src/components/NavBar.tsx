import { Link } from "react-router-dom"

const NavBar = () => {
    return ( 
        <nav className="navBar">
            <h1>images</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/MyLikedPhotos">My liked photos</Link>
            </div>
        </nav>
     );
}
 
export default NavBar;