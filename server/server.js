//ici on importe pas directement le plugin cloudinary, mais le fichier de configuration de cloudinary
const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:tuto-cloudinary') //On mets ici le nom du fichier où l'on souhaite retrouver toutes lesi mages pour toutes les afficher
        .sort_by('public_id', 'desc') 
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    console.log(publicIds)
    res.send(publicIds); //on renvoie au frontend un tableau des id des images à afficher
});
app.post('/api/upload', async (req, res) => {
    try {
        //On récupère l'image sous forme de string depuis la requête
        const fileStr = req.body.data;
        //on upload l'image sur cloudinary
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            //upload presets correspond au nom du presets à utiliser sur cloudinary, configuré au préalable directement sur cloudinary.
            upload_preset: 'tuto_cloudinary_preset',
        });
        console.log(uploadResponse);
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});
