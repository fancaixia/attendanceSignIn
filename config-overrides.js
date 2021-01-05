const { override, fixBabelImports } = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: 'css',
    }),
);


module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        style: 'css',
    }),
);