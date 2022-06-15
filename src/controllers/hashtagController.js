import { getHashtagsByName } from "../repositories/hashtagRepository.js";

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

export { getHashtag };
