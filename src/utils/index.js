module.exports = {

  loadModules: function() {

    var allModules = require('require-all') ({

      dirname : __dirname + '../../',
      filter  : /^(index)\.js$/
    });
    console.log('[Debug]: All modules are loaded!');
  },

  loadRoutes: function(app) {

    var allRoutes = require('require-all') ({

      dirname : __dirname + '../../',
      filter  : /^(routes)\.js$/
    });

    for(const [name, route] of Object.entries(allRoutes)) {
      app.use('/' + name, route.routes);
    }
    console.log('[Debug]: All routes are loaded!')
  }
}
  
  