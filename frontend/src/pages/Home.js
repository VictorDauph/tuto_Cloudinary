import React, { useEffect, useState } from 'react';
import { Image } from 'cloudinary-react';

export default function Home() {
    //les ilages Ids sont envoyés parf l'API node et servent à cherger les images depuis cloudinary
    const [imageIds, setImageIds] = useState();
    const loadImages = async () => {
        try {
            const res = await fetch('/api/images');
            const data = await res.json();
            console.log("data",data)
            //on fetch iles id des images et on les stock dans un state
            setImageIds(data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        loadImages();
    }, []);
    return (
        <div>
            <h1 className="title">Cloudinary Gallery</h1>
            <div className="gallery">
            </div>
            <div className="gallery"> {/* les id des images sont traités par le composant image qui de vient de cloudinary-React et permet de charger une image à partire du cloudname et de son ID*/}
                {imageIds &&
                    imageIds.map((imageId, index) => (
                        <Image
                            key={index}
                            cloudName={process.env.REACT_APP_CLOUDINARY_NAME} 
                            publicId={imageId}
                            width="300"
                            crop="scale"
                        />
                    ))}
            </div>
        </div>
    );
}
