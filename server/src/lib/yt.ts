export const extractYouTubeID = (url: string) => {
    const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/.*|(?:v|e(?:mbed)?|.+\/d|.+\/v|.+\/e(?:mbed)?|.*[?&]v=)|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(youtubeRegex);

    if (match) {
        return match[1];
    } else {
        return null;
    }
};
