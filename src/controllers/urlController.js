import getMetaData from "metadata-scraper";

async function getUrlMetadata(req, res) {
    const { url } = req.body;
    try {
        const metadata = await getMetaData(url);
        const { title, description, image } = metadata;

        res.status(200).send({ title, description, image });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            title: "titulo não encontrado",
            image: "",
            description: "",
        });
    }
}

export default getUrlMetadata;
