'use strict';


/* ----------------- */
/* Dependencies
/* ----------------- */

const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      image = require('gulp-image'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      clean = require('gulp-clean'),
      uglify = require('gulp-uglify'),
      cleanCSS = require('gulp-clean-css'),
      gutil = require('gulp-util'),
      glob = require('glob'),
      envify = require('envify'),
      manifest = require('gulp-manifest'),
      watchify = require('watchify'),
      jshint = require('gulp-jshint'),
      plumber = require('gulp-plumber'),
      chalk = require('chalk');





const hbsfy = require('hbsfy').configure({
  extensions: ['html']
});

/* ----------------- */
/* Settings variables
/* ----------------- */

const settings = {
  src: '.',
  build: './ContentPlugin'
}, 
templatesPath = settings.build,
scssPathes = ['node_modules/susy/sass', 
              'node_modules/breakpoint-sass/stylesheets'];





/* ----------------- */
/* LINT
/* ----------------- */
gulp.task('lintsource', () => {
  return gulp.src('src/**/*.js')
    .pipe(jshint({
      'esversion': 6,
      'moz': true
    }))
    .pipe(jshint.reporter('default'));
});
function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  this.end()
}
/* ----------------- */
/* SCRIPTS
/* ----------------- */
const vendors = [
  'moment',
  'cropit'
];
const babelPlugins = [
       'transform-class-properties',
       'transform-decorators-legacy',
       'transform-object-rest-spread'
];

const scriptName = 'main';
gulp.task('fastjs', () => {
  process.env.NODE_ENV = 'development';

  return browserify({
      transform: ['hbsfy'],
      entries: settings.src + `/js/${scriptName}.js`,
      debug: true
    })
    // .external(vendors)
    .transform("babelify", {
      plugins: babelPlugins,
      presets: ['latest'],
      sourceMapsAbsolute: true
    })
    .bundle()
    .on('error', function(err)
      {
          console.log(err.message);
          browserSync.notify(err.message, 3000);
          this.emit('end');
      })
    .pipe(plumber())//{errorHandler: map_error}
    .pipe(source(`${scriptName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(settings.build));
});


gulp.task('source', ['lintsource'], () => {
  process.env.NODE_ENV = 'production';

  return browserify({
      transform: ['hbsfy'],
      entries: settings.src + '/js/main.js',
      debug: false
    })
    // .external(vendors)
    .transform("babelify", {
      plugins: babelPlugins,
      presets: ['latest'],
      sourceMapsAbsolute: true
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify()).on('error', gutil.log)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(settings.build));
});



/* ----------------- */
/* STYLES
/* ----------------- */

gulp.task('faststyles', () => {
  return gulp.src(settings.src + '/sass/**/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: scssPathes
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(settings.build))
});

gulp.task('styles', () => {
  return gulp.src(settings.src + '/sass/**/*.sass')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: scssPathes
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(settings.build));
});



gulp.task('locales', () => {
  return  gulp.src(settings.src + '/locales/**/*.*')
    .pipe(gulp.dest(settings.build  + '/_locales/'));
});

gulp.task('json', () => {
  return gulp.src(settings.src + '/json/*.json')
    .pipe(gulp.dest(settings.build));
});
/* ----------------- */
/* MEDIA
/* ----------------- */
gulp.task('fastimages', () => {
  return gulp.src(settings.src + '/img/**/*')
    .pipe(gulp.dest(settings.build));
});

gulp.task('images', () => {
  return gulp.src(settings.src + '/img/**/*')
    .pipe(image())
    .pipe(gulp.dest(settings.build + '/img'));
});
gulp.task('html', () => {
  return gulp.src(settings.src + '/*.html')
    .pipe(gulp.dest(templatesPath));
});
/* ----------------- */
/* CLEAN
/* ----------------- */

gulp.task('clean', () => {
    return gulp.src(settings.build, { read: false })
      .pipe(clean());
});

/* ----------------- */
/* Predefined
/* ----------------- */

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: settings.build
    },
    open: true,
    port: 9020,
    reloadDelay: 2200
  });
});

gulp.task('watch', () => {
  gulp.watch(settings.src + '/sass/**/*.sass', ['faststyles']).on('change', browserSync.reload);
  gulp.watch(settings.src + '/img/**/*.*', ['fastimages']).on('change', browserSync.reload);
  gulp.watch(settings.src + '/js/**/*.js', ['fastjs']).on('change', browserSync.reload);
  gulp.watch(settings.src + '/locales/**/*.*', ['locales']);
  gulp.watch(settings.src + '/json/*.json', ['json']);
  gulp.watch(settings.src + '/*.html',  ['html']).on('change', browserSync.reload);
});
gulp.task('watchjs', () => {
  gulp.watch(settings.src + '/js/**/*.js', ['fastjs']).on('change', browserSync.reload);
  gulp.watch(settings.src + '/locales/**/*.*', ['locales']);
  gulp.watch(settings.src + '/json/*.json', ['json']);
});



gulp.task('fastdevelop', ['html', 'fastjs', 'faststyles', 'fastimages', 'locales', 'json', 'serve']); 
gulp.task('production', ['source', 'styles', 'images', 'locales', 'json']);


gulp.task('default', ['fastdevelop',  'watch']);  // development

gulp.task('deploy', ['production']);
