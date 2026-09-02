import { useEffect, useState } from 'react';
import api from '../api';
export const useSectionContent = (slug, defaults) => {
  const [content, setContent] = useState(defaults);
  useEffect(() => { api.get(`/sections/${slug}`).then(({ data }) => { if (data.data) setContent({ ...defaults, ...data.data }); }).catch(() => {}); }, [slug, defaults]);
  return content;
};
