module.exports = require('./lib/app').default;
module.exports.useDispatch = require('react-redux').useDispatch;
module.exports.useSelector = require('react-redux').useSelector;
module.exports.useModel = require('./lib/hooks/useModel').default;
module.exports.useApi = require('./lib/hooks/useApi').default;
module.exports.connect = require('./lib/connect').default;
module.exports.DynamicComponent = require('./lib/DynamicComponent').default;
module.exports.createModel = require('./lib/model').default;
module.exports.setCheckNextWork = require('./lib/model/enhanceFetch').setCheckNextWork;