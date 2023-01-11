/* eslint-disable no-param-reassign */
export const groupArrayByKey = (array: any[], key: string): any => {
  return array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
};
