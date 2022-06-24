import getMetaData from "metadata-scraper";

async function getUrlMetadata(req,res){
    const {url} = req.body;

    try {
        const metadata = await getMetaData(url);
        const {title, description, image} = metadata;

        return res.status(200).send({title, description, image});

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default getUrlMetadata;