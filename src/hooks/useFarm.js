import { useState, useEffect, useCallback } from 'react';
import { 
  BASE_GROWTH_TIME, 
  PLOT_COST, 
  HARVEST_REWARD, 
  INITIAL_COINS,
  CHECK_INTERVAL 
} from '../constants/gameConstants';
import { generateInitialPlots, getGrowthTime } from '../utils/plotHelpers';

export const useFarm = () => {
  // состояние участков
  const [plots, setPlots] = useState(generateInitialPlots);
  
  // состояние игрока
  const [player, setPlayer] = useState({
    coins: INITIAL_COINS,
    harvested: 0,
  });
  
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // проверка роста растений игровым циклом
  useEffect(() => {
    const timerId = setInterval(() => {
      const now = Date.now();

      setPlots((currentPlots) => {
        let hasChanges = false;
        const newPlots = currentPlots.map((plot) => {
          if (plot.type === 'field' && 
              plot.plantStatus !== 'empty' && 
              plot.plantStatus !== 'ready') {
            
            const timeThreshold = getGrowthTime(plot.plantStatus, speedMultiplier);
            const timeElapsed = now - plot.lastStatusChangeAt;

            if (timeElapsed >= timeThreshold) {
              hasChanges = true;
              let nextStatus = plot.plantStatus;
              
              if (plot.plantStatus === 'planted') {
                nextStatus = 'growing';
              } else if (plot.plantStatus === 'growing') {
                nextStatus = 'ready';
              }
              
              return {
                ...plot,
                plantStatus: nextStatus,
                lastStatusChangeAt: now,
              };
            }
          }
          return plot;
        });

        return hasChanges ? newPlots : currentPlots;
      });

    }, CHECK_INTERVAL);

    return () => clearInterval(timerId);
  }, [speedMultiplier]);

  // обработчик клика по участку
  const handlePlotClick = useCallback((plotId) => {
    setPlots((currentPlots) => {
      const plotIndex = currentPlots.findIndex((p) => p.id === plotId);
      if (plotIndex === -1) return currentPlots;

      const plot = currentPlots[plotIndex];
      const newPlots = [...currentPlots];

      // покупка закрытого участка
      if (plot.type === 'locked') {
        if (player.coins >= PLOT_COST) {
          setPlayer((p) => ({ ...p, coins: p.coins - PLOT_COST }));
          newPlots[plotIndex] = {
            ...plot,
            type: 'field',
            plantStatus: 'empty',
            lastStatusChangeAt: null,
          };
        } else {
          alert("Недостаточно монет для покупки участка!");
        }
        return newPlots;
      }

      // посадка растения
      if (plot.plantStatus === 'empty') {
        newPlots[plotIndex] = {
          ...plot,
          plantStatus: 'planted',
          lastStatusChangeAt: Date.now(),
        };
        return newPlots;
      }

      // сбор вкусняхи
      if (plot.plantStatus === 'ready') {
        setPlayer((p) => ({
          ...p,
          coins: p.coins + HARVEST_REWARD,
          harvested: p.harvested + 1,
        }));
        newPlots[plotIndex] = {
          ...plot,
          plantStatus: 'empty',
          lastStatusChangeAt: null,
        };
        return newPlots;
      }

      return currentPlots;
    });
  }, [player.coins]);

  const handleSpeedChange = useCallback((newSpeed) => {
    setSpeedMultiplier(newSpeed);
  }, []);

  // расч1т текущего времени роста для отображения
  const currentGrowthTime = BASE_GROWTH_TIME / 1000 / speedMultiplier;

  return {
    plots,
    player,
    speedMultiplier,
    handlePlotClick,
    handleSpeedChange,
    currentGrowthTime,
  };
};