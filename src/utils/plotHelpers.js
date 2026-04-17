import { PLOT_COUNT } from '../constants/gameConstants';

// здесь генерируется начальная сетка участков
export const generateInitialPlots = () => {
  return Array.from({ length: PLOT_COUNT }, (_, index) => ({
    id: `plot-${index}`,
    type: index < 3 ? 'field' : 'locked',
    plantStatus: 'empty',
    lastStatusChangeAt: null,
  }));
};

// это проверка на то можно ли твкнуть на участок
export const isPlotClickable = (plot) => {
  return plot.type === 'locked' || 
         plot.plantStatus === 'empty' || 
         plot.plantStatus === 'ready';
};

// это фигня для получения эмодзи для участка в зависимости от состояния посадки
export const getPlotContent = (plot) => {
  if (plot.type === 'locked') {
    return '🔒';
  }

  switch (plot.plantStatus) {
    case 'empty':
      return '';
    case 'planted':
      return '🌰';
    case 'growing':
      return '🌱';
    case 'ready':
      return '🍎';
    default:
      return '';
  }
};

// этофигня для полученя полем css стиля в зависимости от состояния
export const getPlotClassName = (plot) => {
  let className = 'plot-cell';

  if (plot.type === 'locked') {
    className += ' plot-locked';
  } else {
    switch (plot.plantStatus) {
      case 'empty':
        className += ' plot-empty';
        break;
      case 'planted':
        className += ' plot-planted';
        break;
      case 'growing':
        className += ' plot-growing';
        break;
      case 'ready':
        className += ' plot-ready';
        break;
      default:
        className += ' plot-empty';
    }
  }

  return className;
};

// расч1т времени роста для текущей стадии растения
export const getGrowthTime = (plantStatus, speedMultiplier) => {
  if (plantStatus === 'planted') {
    return 1000;
  }
  
  if (plantStatus === 'growing') {
    const { BASE_GROWTH_TIME } = require('../constants/gameConstants');
    return BASE_GROWTH_TIME / speedMultiplier;
  }

  return 0;
};