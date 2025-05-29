import axios from 'axios';

interface ImgbbData {
  id: string;
  url: string;
  display_url: string;
  delete_url: string;
  thumb: { url: string };
}

export const uploadToImgbb = async (
  buffer: Buffer,
  apiKey: string,
  name?: string,
  expiration?: number
): Promise<ImgbbData> => {
  const base64 = buffer.toString('base64');
  const params = new URLSearchParams();
  params.append('key', apiKey);
  params.append('image', base64);
  if (name) params.append('name', name);
  if (expiration) params.append('expiration', expiration.toString());

  const res = await axios.post('https://api.imgbb.com/1/upload', params);
  return res.data.data;
};
