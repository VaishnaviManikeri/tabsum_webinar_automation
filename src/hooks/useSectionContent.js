import { useEffect, useState } from 'react';
import api from '../api';

export const useSectionContent = (slug, defaults) => {
  const [content, setContent] = useState(defaults);
  useEffect(() => { api.get(`/sections/${slug}`).then(({ data }) => { if (data.data) setContent({ ...defaults, ...data.data }); }).catch(() => {}); }, [slug, defaults]);
  return content;
};

export const getSectionStyle = (content) => ({
  '--section-text-color': content.textColor || '#0f172a',
  '--section-font-family': `'${content.fontFamily || 'Inter'}', sans-serif`,
  '--section-font-size': `${content.fontSize || 16}px`,
  '--section-background-color': content.backgroundColor || '#ffffff'
});
