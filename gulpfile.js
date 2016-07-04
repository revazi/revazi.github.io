const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const browserify = require('browserify');
const plumber = require('gulp-plumber');

const promise = require('es6-promise');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const minifycss = require('gulp-cssnano');
const sass = require('gulp-sass');

const siteRoot = '_site';
const cssFiles = '_css/**/*.?(s)css';
const cssDest  = './_site/css';
const jsFiles  = './js/**/*.js';
const jsDest   = './_site/js/';
const jsEntry  = './js/main.js';

gulp.task('fonts', () => {
    return gulp.src(['./fonts/*'])
        .pipe(gulp.dest('./_site/fonts/'));
});

gulp.task('javascript', () => {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: jsEntry,
        debug: true
    });

    return b.bundle()
        .pipe(plumber( (error) => {
            handleError(error);
            this.emit('end');
        }))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDest));
});


gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(plumber(function (error) {
        handleError(error);
        this.emit('end');
    }))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss([
        autoprefixer({browsers: ['last 2 version']}),
        mqpacker,
    ]))
    .pipe(gulp.dest(cssDest))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(cssDest))
  //gulp.src(cssFiles)
    //.pipe(sass())
    //.pipe(concat('all.css'))
    //.pipe(gulp.dest('assets'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(cssFiles, ['css']);
  gulp.watch(jsFiles, ['javascript']);
});

gulp.task('default', ['css', 'jekyll', 'serve']);
