import React from 'react';
import Reveal from '@/components/globest/Reveal';
import WellnessCategories from '@/components/globest/WellnessCategories';
import HerbTeaEntry from '@/components/globest/herbtea/HerbTeaEntry';
import GlobalHighlights from '@/components/globest/global/GlobalHighlights';
import QiaoZhangGui from '@/components/globest/QiaoZhangGui';
import HbhFeed from '@/components/globest/hbh/HbhFeed';
import JournalStrip from '@/components/globest/JournalStrip';
import HbhStores from '@/components/globest/hbh/HbhStores';
import ReferralBand from '@/components/globest/ReferralBand';
import MallStorySection from '@/components/globest/MallStorySection';
import FounderLetter from '@/components/globest/site/FounderLetter';

export default function VideoEditorialContent() {
  return <div className="mall-page">
    <Reveal><WellnessCategories /></Reveal>
    <Reveal glow><HerbTeaEntry /></Reveal>
    <Reveal><GlobalHighlights /></Reveal>
    <Reveal glow><QiaoZhangGui /></Reveal>
    <Reveal><HbhFeed /></Reveal>
    <Reveal><JournalStrip /></Reveal>
    <Reveal><HbhStores /></Reveal>
    <Reveal glow><ReferralBand /></Reveal>
    <Reveal><MallStorySection /></Reveal>
    <Reveal><FounderLetter /></Reveal>
  </div>;
}