import { DEFAULT_PREVIEW_IMG } from '../config/constants';

export const updateHeadMeta = ({ title, description, url, image = DEFAULT_PREVIEW_IMG }) => {
  document.title = title;

  const setMeta = (property, content) => {
    let tag = document.querySelector(`meta[property='${property}']`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  setMeta('og:title', title);
  setMeta('og:description', description);
  setMeta('og:url', url);
  setMeta('og:image', image);
};
