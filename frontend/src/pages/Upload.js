import React, { useState } from 'react';
import Alert from '../components/Alert';

export default function Upload() {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    //preview file sert à afficher l'image que l'utilisteu va uploader
    const previewFile = (file) => {
        //FileReader est un composant préconfiguré Javascript qui permet de lire un fichier
        const reader = new FileReader();
        //readAsDataURL transforme le contenu de l'objet (ici, l'image) en une chaîne de caractères
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    /*
    L'objet FileReader permet à des applications web de lire le contenu de fichiers (ou de tampons de mémoire brute) de façon asynchrone.
     On peut ainsi lire le contenu des objets File ou Blob (qui représentent respectivement un fichier ou des données).
     https://developer.mozilla.org/fr/docs/Web/API/FileReader
    */

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        //selected file est un fichier sous forme d'objet qui contient l'image et ses caractéristiques.
        console.log("selectedFile",selectedFile)
        //readAsDataURL transforme le contenu de l'objet (ici, l'image) en une chaîne de caractères
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setErrMsg('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        //console.log("base64EncodedImage",base64EncodedImage)
        console.log("uploading")
        try {
            await fetch('/api/upload', {
                method: 'POST',
                //L'image est envoyée dans le body sous forme de JSON.
                body: JSON.stringify({ data: base64EncodedImage }),
                headers: { 'Content-Type': 'application/json' },
            });
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };
    return (
        <div>
            <h1 className="title">Upload an Image</h1>
            <Alert msg={errMsg} type="danger" />
            <Alert msg={successMsg} type="success" />
            <form onSubmit={handleSubmitFile} className="form">
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                />
                <button className="btn" type="submit">
                    Submit
                </button>
            </form>
            {previewSource && (
                <img
                    src={previewSource}
                    alt="chosen"
                    style={{ height: '300px' }}
                />
            )}
        </div>
    );
}
