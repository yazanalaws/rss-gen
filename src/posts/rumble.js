const rp = require("request-promise");
const cheerio = require("cheerio");

const getRumblePosts = async (channelName) => {
  const url = `https://rumble.com/c/${channelName}`;
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const items = $(".video-listing-entry", html).toArray();
    const posts = items.map((item) => {
      const title = $(".video-item--title", item).text();
      const url_rel = $(".video-item--a", item).attr("href");
      const url_abs = `https://rumble.com${url_rel}`;
      const date = $(".video-item--time", item).attr("datetime");
      const description = `This is a video by ${channelName}!`;
      return { title, link: url_abs, date, description };
    });
    return posts;
  } catch (err) {
    console.log("err: ", err);
  }
  return [];
};

module.exports = { getRumblePosts };
