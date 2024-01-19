import axios from 'axios';

export const videoSdkInstance = axios.create({
  baseURL: 'https://api.videosdk.live/v2',
});
