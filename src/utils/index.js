const { RedditSimple } = require("reddit-simple");

const REDDIT_URL = "https://www.reddit.com";

async function makeRedditCall(postType, subreddit) {
  try {
    if (postType === "top") {
      const topPost = await RedditSimple.TopPost(subreddit);
      return formatEmbed(topPost[0].data, subreddit);
    }

    if (postType === "random") {
      const randomPost = await RedditSimple.RandomPost(subreddit);
      return formatEmbed(randomPost[0].data, subreddit);
    }
  } catch (err) {
    throw new Error(`Unable to make Reddit Call ${err}`);
  }
}

function formatEmbed(data, subreddit) {
  try {
    const {
      title,
      url,
      author,
      permalink,
      thumbnail,
      created_utc,
      selftext,
      is_video,
      media,
    } = data;

    const embed = {
      color: Math.floor(Math.random() * 16777214) + 1,
      author: {
        name: `r/${subreddit}`,
        url: `${REDDIT_URL}/${subreddit}`,
        icon_url: thumbnail,
      },
      title,
      url: `${REDDIT_URL}${permalink}`,
      description: selftext,
      timestamp: created_utc * 1000,
      image: {
        url,
      },
      footer: {
        text: `u/${author}`,
        icon_url:
          "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png",
      },
    };

    if (thumbnail === null || thumbnail === "self") {
      delete embed.author.icon_url;
    }
    const link = isImage(url, is_video);

    if (is_video) {
      embed.video = {
        url: media.reddit_video.fallback_url,
        height: media.reddit_video.height,
        width: media.reddit_video.width,
      };
    }

    if (!link.isImage) {
      delete embed.image;
    }

    return embed;
  } catch (err) {
    throw new Error(`Unable to format Embed ${err}`);
  }
}

function isImage(url) {
  try {
    let isImage = false;
    const imageExtension = ["jpg", "jpeg", "png", "gif"];
    const extension = url.split(".").pop();
    if (imageExtension.includes(extension)) {
      isImage = true;
    }

    return {
      isImage,
    };
  } catch (err) {
    throw new Error(`Unable to determine Link type ${err}`);
  }
}

module.exports = {
  makeRedditCall,
};
