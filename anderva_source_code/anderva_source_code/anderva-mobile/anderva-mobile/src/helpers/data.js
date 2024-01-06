import {api} from '.';

export const getCategories = params => {
  return api.get('categories', {params}).catch(err => console.error(err));
};

export const getBusinesses = params => {
  return api.get('businesses', {params}).catch(err => console.error(err));
};
export const getBusiness = id => {
  return api.get('businesses/' + id).catch(err => console.error(err));
};

export const getArticles = params => {
  return api.get('articles', {params}).catch(err => console.error(err));
};
export const getArticle = id => {
  return api.get('articles/' + id).catch(err => console.error(err));
};

export const getEvents = params => {
  return api.get('events', {params}).catch(err => console.error(err));
};
export const getEvent = id => {
  return api.get('events/' + id).catch(err => console.error(err));
};
