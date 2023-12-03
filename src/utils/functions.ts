export const objectToUpdateStatement = (
  tableName: string,
  idName: string,
  obj: any
): string => {
  const columns = Object.keys(obj);
  return `UPDATE ${tableName} SET ${columns
    .map((col, index) => `${col} = $${index + 1}`)
    .join(", ")} ,UPDATED_AT = NOW() WHERE ${idName} = $${columns.length + 1};`;
};
