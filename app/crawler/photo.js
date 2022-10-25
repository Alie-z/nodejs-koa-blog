/**
 * @description 图集岛爬虫
 * @description Data Access Objects for Administrators
 * @author Aliez
 */
const request = require('request');
const cheerio = require('cheerio');
const tag = require('@lib/tag');
const {Resolve} = require('@lib/helper');
const res = new Resolve();
class PhotoCrawler {
    static async getPhoto(params) {
        const {kw, page} = params;
        return new Promise((resolve, reject) => {
            try {
                // 爬取关键词图集
                request(
                    {
                        url: encodeURI(tag.referer + kw + '&page=' + page),
                        method: 'GET',
                        headers: {
                            cookie: 'uid=' + tag.uid,
                            'user-agent':
                                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
                        }
                    },
                    async function (error, response, body) {
                        // console.log('🚀 > body', body);
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(body);
                            if (body.indexOf('没有登录') != -1) {
                                console.log('🚀 > 登陆态失效，请更新。');
                                resolve([err, '登陆态失效，请更新。']);
                            } else {
                                let list = $('div.hezi>ul>li');
                                if (list.length > 0) {
                                    let photoArr = [];
                                    list.map(async function () {
                                        const num = $(this).find('span.shuliang').text().trim().split('P')[0];
                                        const tags = $(this).find('p:not(.biaoti)').text();
                                        const titleNode = $(this).find('p.biaoti > a');
                                        const id = titleNode.attr('href').split('id=')[1];
                                        const title = titleNode.text().trim();
                                        const imgSrc = $(this).find('a>img').attr('src');
                                        photoArr.push({title, num, id, tags, imgSrc});
                                    });
                                    const hasMore = body.indexOf('下一页') != -1;
                                    resolve([null, photoArr, hasMore]);
                                } else {
                                    resolve([null, []]);
                                }
                            }
                        } else {
                            resolve([error + 'kw参数错误，未查询到', null]);
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = {
    PhotoCrawler
};
