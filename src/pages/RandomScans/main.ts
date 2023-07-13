import { pageInterface } from '../pageInterface';

export const RandomScans: pageInterface = {
  name: 'RandomScans',
  domain: ['https://randomscans.com'],
  languages: ['Portuguese'],
  type: 'manga',
  isSyncPage(url) {
    return utils.urlPart(url, 5).startsWith('cap-');
  },
  isOverviewPage(url) {
    if (url.split('/')[4] !== undefined && url.split('/')[4].length > 0) {
      return true;
    }
    return false;
  },
  getImage() {
    return $('div.summary_image > a > img').attr('src');
  },
  sync: {
    getTitle(url) {
      return j.$('h1.chapter-heading').text().split(' - Cap')[0];
    },
    getIdentifier(url) {
      return utils.urlPart(url, 4);
    },
    getOverviewUrl(url) {
      return j.$('ol.breadcrumb > li:nth-child(2) > a').attr('href') || '';
    },
    getEpisode(url) {
      let temp = 0;

      const titlePart = document.title.match(/Cap\. (\d+)/i);

      if (titlePart && titlePart[1]) {
        temp = Number(titlePart[1]);
      }

      if (!temp) {
        const episodePart = utils.urlPart(url, 5).match(/cap-(\d+)/i);
        if (episodePart) temp = Number(episodePart[1]);
      }

      if (!temp) return 0;

      return temp;
    },
    nextEpUrl(url) {
      return utils.absoluteLink(j.$('a:contains(Next)').attr('href'), RandomScans.domain);
    },
  },
  overview: {
    getTitle(url) {
      return j.$('div.post-title > h1').text();
    },
    getIdentifier(url) {
      return utils.urlPart(url, 4);
    },
    uiSelector(selector) {
      j.$('div.profile-manga > div.container > div.row').after(
        j.html(
          `<div id="malthing" class="malthing" > <p><span>MAL-Sync</span></p> ${selector}</div>`,
        ),
      );
    },
    list: {
      offsetHandler: false,
      elementsSelector() {
        return j.$('div.page-content-listing > div > ul.main > li.wp-manga-chapter');
      },
      elementUrl(selector) {
        return selector.find('a').first().attr('href') || '';
      },
      elementEp(selector) {
        return RandomScans.sync.getEpisode(String(selector.find('a').first().attr('href')));
      },
    },
  },
  init(page) {
    api.storage.addStyle(
      require('!to-string-loader!css-loader!less-loader!./style.less').toString(),
    );
    j.$(() => {
      if (document.title.includes('Not Found')) {
        con.error('404');
        return;
      }
      page.handlePage();
    });
  },
};
