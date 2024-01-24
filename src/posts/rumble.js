const rp = require("request-promise");
const cheerio = require("cheerio");

const getChannelHtml = async (channelName) => {
  const url = `https://rumble.com/c/${channelName}`;
  const alt_url = `https://rumble.com/user/${channelName}`;
  try {
    return await rp(url);
  } catch {
    return await rp(alt_url);
  }
};

const getRumblePosts = async (channelName) => {
  const html = await getChannelHtml(channelName);
  const $ = cheerio.load(html);
  const items = $(".videostream", html).toArray();
  const posts = items.map((item) => {
    const title = $(".thumbnail__title", item).text();
    const url_rel = $(".videostream__link", item).attr("href");
    const url_abs = `https://rumble.com${url_rel}`;
    const thumbnail = $(".thumbnail__image", item).attr("src");
    const date = $(".videostream__time", item).attr("datetime");
    const views = $(".videostream__views", item).attr("data-views");
    const duration = $(".videostream__status--duration", item).text();
    const desc = $('.videostream__description ').text();
    const description = `${desc} , views : ${views} , duration: ${duration}`;
    return { title, link: url_abs, thumbnail, date, description, views , duration };
  });
  return posts;
};

module.exports = { getRumblePosts };
