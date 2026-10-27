const B = 'https://base44.app/api/apps/6aa3280ca2d875c1b77cdd8e/files/mp/public/6aa3280ca2d875c1b77cdd8e/';
const f = list => list.split(' ').map(x => B + x);

export const materialProducts = [
  { key: 'oxygen', zh: '绿氧舱', en: 'Green Oxygen Chamber', zhImgs: f('c06a4b000_oxygen_zh_0.jpg 5ddd531fe_oxygen_zh_1.jpg cb3facf30_oxygen_zh_2.jpg d49edadca_oxygen_zh_3.jpg'), enImgs: f('3f6cb2921_oxygen_en_0.jpg 790866490_oxygen_en_1.jpg 4160a40e0_oxygen_en_2.jpg f2b86a804_oxygen_en_3.jpg') },
  { key: 'sleep', zh: '智能睡眠枕', en: 'Smart Sleep Pillow', zhImgs: f('53ca5dba2_sleep_zh_0.jpg 32b11f9f6_sleep_zh_1.jpg cf271fc32_sleep_zh_2.jpg 76e747f0d_sleep_zh_3.jpg'), enImgs: f('54a4e6d3e_sleep_en_0.jpg 0e9a2780b_sleep_en_1.jpg ed48823ff_sleep_en_2.jpg 0f64ae1c5_sleep_en_3.jpg') },
  { key: 'eye', zh: '眼部按摩仪', en: 'Eye Massager', zhImgs: f('ad51c95bf_eye_zh_0.jpg 912e5c5d9_eye_zh_1.jpg 25073f8f8_eye_zh_2.jpg c4723003f_eye_zh_3.jpg'), enImgs: f('4b696559c_eye_en_0.jpg e9fcd8449_eye_en_1.jpg 31765d4d5_eye_en_2.jpg 5553f798c_eye_en_3.jpg') },
  { key: 'moxa', zh: '艾灸仪', en: 'Moxibustion Device', zhImgs: f('5bc9328f2_moxa_zh_0.jpg c691e19f3_moxa_zh_1.jpg e0e15df75_moxa_zh_2.jpg 555aef3e1_moxa_zh_3.jpg'), enImgs: f('cd9f03229_moxa_en_0.jpg 25c191efe_moxa_en_1.jpg 76178c3e1_moxa_en_2.jpg 254ce2e51_moxa_en_3.jpg') },
  { key: 'aroma', zh: '香薰', en: 'Aromatherapy', zhImgs: f('ee1f857a1_aroma_zh_0.jpg 64712776d_aroma_zh_1.jpg c9aa6393e_aroma_zh_2.jpg 1af412c15_aroma_zh_3.jpg'), enImgs: f('a97ab2966_aroma_en_0.jpg d4d9c3585_aroma_en_1.jpg df3349fbf_aroma_en_2.jpg 8c2fa321a_aroma_en_3.jpg') },
];

export const materialPosters = f('c88926b4f_poster_0.jpg 33879935c_poster_1.jpg 8b42083c1_poster_2.jpg 3fa91fc03_poster_3.jpg');

// [zh, en, url, vertical]
/** @type {Array<[string,string,string,boolean]>} */
export const materialVideos = [
  ['绿氧舱宣传片', 'Green Oxygen Chamber promo', B + '95a8af9fb_video_2.mp4', true],
  ['科普：为什么氧对身体很重要（横屏）', 'Why oxygen matters (landscape)', B + '7135fa993_video_3.mp4', false],
  ['科普：为什么氧对身体很重要（竖屏）', 'Why oxygen matters (vertical)', B + '1f0487671_video_4.mp4', true],
  ['科普：如何判断身体缺氧', 'How to tell if you lack oxygen', B + '3224f9acb_video_5.mp4', false],
  ['科普：微高压氧的意义', 'The value of mild hyperbaric oxygen', B + '452d50177_video_6.mp4', true],
  ['智能睡眠枕介绍', 'Smart Sleep Pillow intro', B + '5fa0dd5c2_video_0.mp4', false],
  ['眼部按摩仪介绍', 'Eye Massager intro', B + '9600c7e86_video_1.mp4', false],
];