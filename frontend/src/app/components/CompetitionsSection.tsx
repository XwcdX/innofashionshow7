"use client";

import {
  FiFileText,
  FiBook,
  FiHeart,
  FiCloud,
  FiEdit,
  FiBarChart2,
} from 'react-icons/fi';
import GlassIcons from './GlassIcons';
import Image from 'next/image';

const items = [
  { icon: <FiFileText />, color: 'blue', label: 'Fashion Show' },
  { icon: <FiBook />, color: 'purple', label: 'Make Up' },
  { icon: <FiHeart />, color: 'red', label: 'Fashion Styling' },
  { icon: <FiCloud />, color: 'indigo', label: 'Fashion Design' },
  { icon: <FiEdit />, color: 'orange', label: 'Public Speaking' },
  { icon: <FiBarChart2 />, color: 'green', label: 'Photography' },
];

const CompetitionsSection = () => (
  <section
    className="min-h-[600px] py-16 relative"
    style={{ background: 'linear-gradient(180deg,#281660 0%, #A30A99 100%)' }}
  >
    <div className="max-w-7xl mx-auto text-center px-4">
      {/* Layer Asset (bottom-left corner) */}
              <div className="transform scale-210 absolute -bottom-10 left-0 w-40 h-40">
                <Image
                  src="/assets/layer3.png"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
              </div>
      {/* Layer Asset (upper-right corner) */}
      <div className="transform scale-210 absolute bottom-100 -right-15 w-40 h-40">
                <Image
                  src="/assets/layer2.png"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
              </div>        
      <h2
        className="text-4xl md:text-5xl font-bold mb-12 text-[#a6ff4d]"
        style={{ fontFamily: 'Moderniz, sans-serif' }}
      >
        Competitions
      </h2>
      <div className="flex justify-center">
        <GlassIcons
          items={items}
          className="text-white"
        />
      </div>
    </div>
  </section>
);

export default CompetitionsSection;
