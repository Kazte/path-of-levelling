export const saveGuide = (guide: string) => {
  localStorage.setItem('guide', guide);
};

export const getGuide = (): string | null => {
  return localStorage.getItem('guide');
};

export const removeGuide = () => {
  localStorage.removeItem('guide');
};
