/*
Based on:

===============================================================================
  Gulp Vue-Split
  Copyright 2016 Sebastian Software GmbH <https://www.sebastian-software.de>
===============================================================================
*/
const through = require('through2');
const File = require('vinyl');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
const series = require('async/series');
const gutil = require('gulp-util');

const memCache = {};

module.exports = (generateScopedName = name => name, plugins = []) => {
  let moduleMapping = null;

  function processStyle(done, text, path, base) {
    if (!text) {
      return done();
    }

    return postcss([
      ...plugins,
      postcssModules({
        generateScopedName,
        getJSON: (cssFileName, json) => {
          moduleMapping = JSON.stringify(json);
        },
      }),
    ])
      .process(text, {
        from: path,
      })
      .then(() => {
        if (memCache[path] === moduleMapping) {
          return done();
        }

        memCache[path] = moduleMapping;

        const fileObj = new File({
          contents: Buffer.from(moduleMapping),
          path: path.replace('.css', '.json'),
          base,
        });

        return done(null, fileObj);
      });
  }


  function transform(file, encoding, callback) {
    /* eslint no-invalid-this: 0 */

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new gutil.PluginError('gulp-postcss-modules', 'Streams are not supported'))
    }

    const self = this;

    const filePath = file.path;
    const fileBase = file.base;
    const fileContent = file.contents.toString('utf8');

    return series(
      [done => processStyle(done, fileContent, filePath, fileBase)],
      (err, results) => {
        if (err) {
          return callback(new gutil.PluginError('gulp-postcss-modules', err));
        }

        results.forEach(resultFile => resultFile && self.push(resultFile));
        return callback();
      });
  }

  return through.obj(transform);
};
