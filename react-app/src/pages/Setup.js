import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroUIProvider, Slider } from '@heroui/react';

export default function Setup() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = (location.state && location.state.mode) || 1;

  const [n, setN] = useState(10);
  const [k, setK] = useState(3);
  const [a, setA] = useState(2);
  const [b, setB] = useState(4);
  const [first, setFirst] = useState('player');
  const [errors, setErrors] = useState({});

  // Ensure b >= a
  useEffect(() => {
    if (a > b) {
      setB(a);
    }
  }, [a, b]);

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (n < 5 || n > 50) newErrors.n = 'n: от 5 до 50';
    if (mode === 1 || mode === 3) {
      if (k < 1 || k > n) newErrors.k = `k: от 1 до ${n}`;
    }
    if (mode === 2 || mode === 4) {
      if (a < 2 || a > b) newErrors.a = 'a: от 2 до b';
      if (b < a || b > n) newErrors.b = `b: от a до ${n}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [n, k, a, b, mode]);

  // Handle form submission
  const handleSubmit = () => {
    if (!validate()) return;

    const settings = { mode, n, first };
    if (mode === 1 || mode === 3) {
      settings.k = k;
    }
    if (mode === 2 || mode === 4) {
      settings.a = a;
      settings.b = b;
    }

    navigate('/game', { state: settings });
  };

  return (
    <HeroUIProvider>
      <div
        className="p-10 flex items-center justify-center min-h-screen bg-cover bg-center text-white font-nunito relative"
        style={{ backgroundImage: 'url(/bg/table.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/80 z-10" />
        <div className="relative z-20 max-w-md w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <h2 className="text-center text-2xl text-primary mb-8">Настройки</h2>

          {/* Палочек */}
          <div className="mb-6">
            <Slider
              label="Палочек"
              minValue={5}
              maxValue={50}
              value={n}
              onChange={val => setN(Number(val))}
              showTooltip
            />
            {errors.n && <p className="mt-2 text-sm text-error">{errors.n}</p>}
          </div>

          {/* Максимум за ход */}
          {(mode === 1 || mode === 3) && (
            <div className="mb-6">
              <Slider
                label={`Максимум за ход: 1–${n}`}
                minValue={1}
                maxValue={n}
                value={k}
                onChange={val => setK(Number(val))}
                showTooltip
                marks
              />
              {errors.k && <p className="mt-2 text-sm text-error">{errors.k}</p>}
            </div>
          )}

          {/* Интервал */}
          {(mode === 2 || mode === 4) && (
            <div className="mb-6">
              <Slider
                label={`Интервал: ${a}–${b}`}
                minValue={2}
                maxValue={n}
                value={[a, b]}
                onChange={arr => {
                  const [newA, newB] = arr;
                  if (newA < newB) {
                    setA(newA);
                    setB(newB);
                  }
                }}
                showTooltip
                marks
              />
              {errors.a && <p className="mt-2 text-sm text-error">{errors.a}</p>}
              {errors.b && <p className="mt-2 text-sm text-error">{errors.b}</p>}
            </div>
          )}

          {/* Первый ход */}
          <div className="mb-6">
            <label className="block mb-2 text-primary font-semibold">
              Кто ходит первым:
            </label>
            <select
              value={first}
              onChange={e => setFirst(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-200 text-gray-800 font-bold"
            >
              <option value="player">Игрок</option>
              <option value="computer">Компьютер</option>
            </select>
          </div>

          {/* Кнопка */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 text-lg bg-primary rounded-lg font-bold shadow-md"
          >
            Начать игру
          </button>
        </div>
      </div>
    </HeroUIProvider>
  );
}
