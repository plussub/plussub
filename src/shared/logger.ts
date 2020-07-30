import debug from 'debug';
debug.formatters.J = (v) => JSON.stringify(v, null, 2);

// localStorage.debug = 'plussub:*'
export default debug('plussub');
