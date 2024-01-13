import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';
import swaggerUI from 'swagger-ui-dist';
import express from 'express';

// The trick with adding url query param and redirecting
// does not work for now because of this
// https://github.com/swagger-api/swagger-ui/issues/7983
// So let's try to use a new trick similar to
// https://github.com/swagger-api/swagger-ui/issues/9237#issuecomment-1730346919

const initializerCode = (url) => `window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: "${url}",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
};
`;

const factory = (express, swaggerUI) => {
  const staticMiddleware = express.static(swaggerUI.getAbsoluteFSPath());
  return ({ docUrl }) => (req, res, next) => {
    // url base is not suppoed to be used. 
    // It just doesn't work without base
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/swagger-initializer.js') {
      return res.send(initializerCode(docUrl))
    }
    return staticMiddleware(req, res, next);
  };
};
factory[dependencies] = [express, swaggerUI];
factory[singleton] = true;
export default factory;
