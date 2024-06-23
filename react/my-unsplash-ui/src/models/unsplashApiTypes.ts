export type UnsplashPhoto = {
    id: string;
    created_at: string;
    updated_at: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    description: string | null;
    alt_description: string | null;
    urls: UnsplashUrls;
    links: UnsplashPhotoLinks;
    user: UnsplashUser;
    liked_by_user?: boolean; 
  };
  
  export type UnsplashUrls = {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  
  export type UnsplashPhotoLinks = {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  
  export type UnsplashUser = {
    id: string;
    username: string;
    name: string;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: UnsplashUserLinks;
  };
  
  export type UnsplashUserLinks = {
    self: string;
    html: string;
    photos: string;
    likes: string;
    portfolio: string;
  };
  
  export type UnsplashPhotosResponse = {
    total: number;
    total_pages: number;
    results: UnsplashPhoto[];
  };
  
  export type UnsplashLikedPhotosResponse = UnsplashPhoto[];
  