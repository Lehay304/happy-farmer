import React from 'react';
import './App.css';
import { useFarm } from './hooks/useFarm';
import PlotCell from './components/PlotCell';
import { PLOT_COST, HARVEST_REWARD } from './constants/gameConstants';

function App() {
  const {
    plots,
    player,
    speedMultiplier,
    handlePlotClick,
    handleSpeedChange,
    currentGrowthTime,
  } = useFarm();

  return (
    <div className="app-container">
      <header className="header">
        <h1>Весёлый Фермер</h1>
        
        <div className="stats-bar">
          <div className="stat-item">💰 Монеты: {player.coins}</div>
          <div className="stat-item">🌾 Урожай: {player.harvested}</div>
        </div>

        <div className="controls">
          <label htmlFor="speed-select">Скорость времени: </label>
          <select 
            id="speed-select"
            value={speedMultiplier} 
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
          >
            <option value={0.5}>0.5x (Медленно)</option>
            <option value={1}>1x (Нормально)</option>
            <option value={2}>2x (Быстро)</option>
            <option value={5}>5x (Очень быстро)</option>
          </select>
          <div className="time-info">
            Время роста: {currentGrowthTime.toFixed(1)} сек.
          </div>
        </div>
      </header>

      <div className="farm-grid">
        {plots.map((plot) => (
          <PlotCell 
            key={plot.id} 
            plot={plot} 
            onClick={() => handlePlotClick(plot.id)} 
          />
        ))}
      </div>

      <div className="legend">
        <h3>Подсказки:</h3>
        <ul>
          <li>🔒 Закрыто (Купить за {PLOT_COST})</li>
          <li>🟫 Пусто (Посадить)</li>
          <li>🌰 Посажено (1 сек)</li>
          <li>🌱 Растёт ({currentGrowthTime.toFixed(1)} сек)</li>
          <li>🍎 Готово (Собрать +{HARVEST_REWARD})</li>
        </ul>
      </div>
    </div>
  );
}

export default App;