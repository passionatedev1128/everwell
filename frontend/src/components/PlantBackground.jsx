import { useEffect, useState } from 'react';

const PlantBackground = () => {
  const [showFruit, setShowFruit] = useState(false);

  useEffect(() => {
    // Show "Everwell" fruit after plants have grown (8 seconds)
    const timer = setTimeout(() => {
      setShowFruit(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="plant-background-container">
      {/* Stems */}
      <div className="plant-stem stem-1" />
      <div className="plant-stem stem-2" />
      <div className="plant-stem stem-3" />
      <div className="plant-stem stem-4" />
      <div className="plant-stem stem-5" />

      {/* Leaves */}
      <div className="plant-leaf leaf-1" />
      <div className="plant-leaf leaf-2" />
      <div className="plant-leaf leaf-3" />
      <div className="plant-leaf leaf-4" />
      <div className="plant-leaf leaf-5" />
      <div className="plant-leaf leaf-6" />
      <div className="plant-leaf leaf-7" />
      <div className="plant-leaf leaf-8" />

      {/* Flowers */}
      <div className="plant-flower flower-1" />
      <div className="plant-flower flower-2" />
      <div className="plant-flower flower-3" />
      <div className="plant-flower flower-4" />

      {/* Everwell as Fruit */}
      {showFruit && (
        <div className="everwell-fruit">
          <span className="everwell-fruit-text">Everwell</span>
        </div>
      )}
    </div>
  );
};

export default PlantBackground;

