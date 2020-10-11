export const capitalizeFirst = (str: string | undefined): string => (str ? `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}` : '');
