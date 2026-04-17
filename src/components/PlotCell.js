import React from 'react';
import { isPlotClickable, getPlotContent, getPlotClassName } from '../utils/plotHelpers';

// компонент для отдельного участка на ферме
function PlotCell({ plot, onClick }) {
  const clickable = isPlotClickable(plot);
  const content = getPlotContent(plot);
  const className = getPlotClassName(plot);

  return (
    <div 
      className={className} 
      onClick={clickable ? onClick : undefined}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <span className="plot-content">{content}</span>
    </div>
  );
}

export default PlotCell;