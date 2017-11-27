Gulp plugin for extracting CSS module to JSON file using [PostCSS](https://github.com/postcss/postcss)

This plugin based on [gulp-postcss-modules](https://www.npmjs.com/package/gulp-postcss-modules),
but you can pass custom `generateScopedName` callback for [postcss-modules](https://github.com/css-modules/postcss-modules) plugin.

### Usage

Basic

```
gulp.task('css-modules',
    () => gulp.src('lib/**/*.css')
      .pipe(cssModules())
      .pipe(gulp.dest(options.defaultDir));
});
```

Custom `generateScopedName` according to [https://github.com/webpack/loader-utils#interpolatename]
```
gulp.task('css-modules',
    () => gulp.src('lib/**/*.css')
      .pipe(cssModules(
            '[name]__[local]___[hash:base64:5]',
          ))
      .pipe(gulp.dest(options.defaultDir));
});
```

Also you can pass array of postcss plugin as second parameter, it will be passed directly to postcss module
```
gulp.task('css-modules',
    () => gulp.src('lib/**/*.css')
      .pipe(cssModules(
            '[name]__[local]___[hash:base64:5]',
            [
              // init postcss plugins
            ]
          ))
      .pipe(gulp.dest(options.defaultDir));
});
```