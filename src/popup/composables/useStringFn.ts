export const useStringFn = () => ({
  capitalize: (str) => str ? `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}` : ''
});