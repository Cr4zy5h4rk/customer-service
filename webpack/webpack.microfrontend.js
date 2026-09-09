const path = require('path');

const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

const packageJson = require('../package.json');
// Microfrontend api, should match across gateway and microservices.
const apiVersion = '0.0.1';

const sharedDefaults = { singleton: true, strictVersion: true, requiredVersion: apiVersion };
const shareMappings = (...mappings) => Object.fromEntries(mappings.map(map => [map, { ...sharedDefaults, version: apiVersion }]));

const shareDependencies = ({ skipList = [] } = {}) =>
  Object.fromEntries(
    Object.entries(packageJson.dependencies)
      .filter(([dependency]) => !skipList.includes(dependency))
      .map(([dependency, version]) => [dependency, { ...sharedDefaults, version, requiredVersion: version }]),
  );

let sharedDependencies = shareDependencies({ skipList: ['@angular/localize'] });
const ngBootstrapEntryPoints = ['alert', 'collapse', 'datepicker', 'dropdown', 'modal', 'pagination', 'progressbar', 'tooltip'];
sharedDependencies = {
  ...sharedDependencies,
  '@angular/common/http': sharedDependencies['@angular/common'],
  '@angular/core/rxjs-interop': sharedDependencies['@angular/core'],
  ...Object.fromEntries(
    ngBootstrapEntryPoints.map(entryPoint => [
      `@ng-bootstrap/ng-bootstrap/${entryPoint}`,
      sharedDependencies['@ng-bootstrap/ng-bootstrap'],
    ]),
  ),
  'dayjs/esm': sharedDependencies.dayjs,
  'rxjs/operators': sharedDependencies.rxjs,
};

module.exports = () => {
  return {
    resolve: {
      modules: [path.resolve(__dirname, '../src/main/webapp/'), 'node_modules'],
    },
    optimization: {
      moduleIds: 'named',
      chunkIds: 'named',
      runtimeChunk: false,
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'customer',
        exposes: {
          './translation-provider': 'app/shared/language/translation.provider.ts',
          './entity-navbar-items': 'app/entities/entity-navbar-items.ts',
          './entity-routes': 'app/entities/entity.routes.ts',
        },
        shareScope: 'default',
        dts: false,
        manifest: true,
        shared: {
          ...sharedDependencies,
          ...shareMappings(
            'app/config',
            'app/core/auth',
            'app/core/config',
            'app/core/interceptor',
            'app/core/request',
            'app/core/util',
            'app/shared',
            'app/shared/alert',
            'app/shared/auth',
            'app/shared/date',
            'app/shared/language',
            'app/shared/pagination',
            'app/shared/sort',
          ),
        },
      }),
    ],
    output: {
      publicPath: 'auto',
      scriptType: 'text/javascript',
    },
  };
};
