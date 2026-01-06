import { SQL } from "drizzle-orm";

export const buildUpdateData = <T extends Record<string, any>>(data: T): Partial<T> => {
  const updateData: any = {};
  
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  });
  
  return updateData;
};

export const buildFilterConditions = <T extends Record<string, any>>(
  filters: T,
  conditionBuilders: Record<string, (value: any) => SQL | undefined>
): SQL[] => {
  const conditions: SQL[] = [];
  
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    const builder = conditionBuilders[key];
    
    if (value !== undefined && builder) {
      const condition = builder(value);
      if (condition) {
        conditions.push(condition);
      }
    }
  });
  
  return conditions;
};

export const calculatePagination = (total: number, page: number = 1, limit: number = 10) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  return {
    totalPages,
    offset,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};
