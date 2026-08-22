export const generateTarget = () => {
  // Generate percentage coordinates between 10% and 85% to keep target inside board
  const x = Math.floor(Math.random() * 75) + 10;
  const y = Math.floor(Math.random() * 75) + 10;
  const targetId = `target_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  return {
    id: targetId,
    x,
    y,
    createdAt: Date.now(),
  };
};
