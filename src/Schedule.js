import { useRef, useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';

const Schedule = ({ slides }) => {
  const chartRef = useRef(null);
  const myChart = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    myChart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: slides[currentSlide].labels,
        datasets: [
          {
            label: slides[currentSlide].label,
            data: slides[currentSlide].data,
            fill: false,
            borderColor: slides[currentSlide].borderColor,
            tension: 0.3
          }
        ]
      },
      options: {
        animation: { duration: 600 },
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });

    return () => myChart.current.destroy();
  }, []);

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextIndex);

    myChart.current.data.labels = slides[nextIndex].labels;
    myChart.current.data.datasets[0].label = slides[nextIndex].label;
    myChart.current.data.datasets[0].data = slides[nextIndex].data;
    myChart.current.data.datasets[0].borderColor = slides[nextIndex].borderColor;
    myChart.current.update();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <canvas ref={chartRef} width="600" height="300"></canvas>
      <button className='Schedulebtn' onClick={nextSlide}>
        Next schedule
      </button>
    </div>
  );
};

export default Schedule;
