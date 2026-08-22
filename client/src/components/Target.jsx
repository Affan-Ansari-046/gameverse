import React from 'react';

export const Target = ({ target, onClick }) => {
  if (!target) return null;

  return (
    <div
      className="arena-target"
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
      }}
      onClick={(e) => onClick(target.id, e)}
      title="Shoot Target!"
    />
  );
};
