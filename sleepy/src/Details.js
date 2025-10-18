import { useRef, useEffect, useState } from 'react';

const Details = ({ slides }) => {
  // шукаємо потрібні графіки
  const bedtime = slides.find(s => s.id === 'bedtime')?.data || [];
  const duration = slides.find(s => s.id === 'sleepHours')?.data || [];
  const quality = slides.find(s => s.id === 'sleepQuality')?.data || [];

  // функція для середнього значення
  const avg = (arr) => arr.length ? (arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(1) : 0;

  const avgBedtime = avg(bedtime);
  const avgDuration = avg(duration);
  const avgQuality = avg(quality);

  return (
    <div className='details'>
      <p>last dream:</p>
      <div className='fullDetails'>
        <div className='section' id='sectionOne'>
          <img src='/png/icon-bad2.png' alt="bad2"></img>
          <img src='/png/icon-bad.png' alt="bad"></img>
          <img src='/png/good.png' alt="good"></img>
        </div>

        <div className='section' id='sectionTwo'>
          <p>bedtime</p>
          <p>duration</p>
          <p>quality</p>
        </div>

        <div className='section' id='sectionThee'>
          <p>{avgBedtime}m</p>
          <p>{avgDuration}h</p>
          <p>{avgQuality}%</p>
        </div>
      </div>
    </div>
  );
};

export default Details;
