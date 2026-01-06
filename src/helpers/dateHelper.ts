export const extractDateParts = (dateString: string): { month: number; year: number } => {
  const [year, month] = dateString.split('-').map(Number);
  return {
    month,
    year,
  };
};

export const getDayOfWeek = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

export const formatDateForDatabase = (dateString: string): { 
  data: string; 
  month: number; 
  year: number; 
  dayOfWeek: string 
} => {
  const { month, year } = extractDateParts(dateString);
  const dayOfWeek = getDayOfWeek(dateString);
  
  return {
    data: dateString,
    month,
    year,
    dayOfWeek,
  };
};
