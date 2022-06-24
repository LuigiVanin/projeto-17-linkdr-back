import {
    getHashtagsByName, getTrendingHashtags, insertHashtag
} from "../repositories/hashtagRepository.js";

const getHashtag = async (req, res) => {
    let { hashtag } = req.params;

    try {
        const hashtagPostsResult = await getHashtagsByName(hashtag);
        const { rows: hashtags } = hashtagPostsResult;
        return res.status(200).send(hashtags);
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getTrending = async (_, res) => {
    try {
        const { rows: trending } = await getTrendingHashtags();
        return res.status(200).send(trending);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

function formatHashtags(text){
    const regex = /((?:^|\s)(?:#[a-z\d -]+))/gi
    const splittedText = text.split(regex)

    return splittedText.filter(Boolean).map((string)=>{
        if(string.includes('#')) return string.replace("#", "").replaceAll(' ', '')
        //hashtags devem estar no final da frase 
    })
}

export { getHashtag, getTrending, formatHashtags };