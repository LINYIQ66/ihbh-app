import React from 'react';
import { Image } from '@/components/ui/image';

const images=[
  'https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/5c841a407_generated_ec7c2441.jpg',
  'https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/404977e62_generated_d224d422.jpg',
  'https://media.base44.com/images/public/6aa3280ca2d875c1b77cdd8e/7f94abdbc_generated_900c32ae.jpg'
];
const stories=/** @type {Array<[string, number, string]>} */ ([['Live now',0,'Natural-light wellness livestream portrait'],['Experts',1,'Natural-light wellness expert interview'],['Kitchen',2,'Natural-light kitchen wellness demonstration'],['Wellness',0,'Natural-light wellness livestream portrait'],['Roots',1,'Natural-light wellness expert interview'],['Today',2,'Natural-light kitchen wellness demonstration']]);
export default function LiveStories(){
  return <section className="live-stories live-glass"><div className="live-stories-head"><h2>Stories</h2><span>For you</span></div><div className="live-story-row">{stories.map(([label,index,alt])=><div className="live-story" key={label}><Image src={images[index]} alt={alt}/><span>{label}</span></div>)}</div></section>;
}
export { images };