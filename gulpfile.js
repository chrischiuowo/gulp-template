const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const mergeStream = require('merge-stream')

// sass
const sass = require('gulp-sass')(require('sass'))
const packageImporter = require('node-sass-package-importer')
const postcss = require('gulp-postcss')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// pug
const pug = require('gulp-pug')

// ts
const uglify = require('gulp-uglify')
const ts = require('gulp-typescript')

// image
const imagemin = require('gulp-imagemin')

const PATHS = {
  'pug:watch': {
    src: 'src/**/*.pug',
    dest: 'dist'
  },
  'pug:build': {
    src: 'src/**/!(_)*.pug',
    dest: 'dist'
  },
  'scss:watch': {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  'scss:build': {
    src: 'src/scss/**/!(_)*.scss',
    dest: 'dist/css'
  },
  ts: {
    src: 'src/ts/**/*.ts',
    dest: 'dist/js'
  },
  assets: {
    imageSrc: 'src/assets/images/**/*',
    imageDest: 'dist/assets/images',
    src: ['src/assets/**/*', '!src/assets/images/**/*'],
    dest: 'dist/assets'
  }
}

function errorHandler(err, stats) {
  if (err || (stats && stats.compilation.errors.length > 0)) {
    const error = err || stats.compilation.errors[0].error
    notify.onError({ message: '<%= error.message %>' })(error)
    this.emit('end')
  }
}

function compilePug() {
  return gulp
    .src(PATHS['pug:build'].src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest(PATHS['pug:build'].dest))
    .pipe(browserSync.stream())
}

function compileScss() {
  return gulp
    .src(PATHS['scss:build'].src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        importer: packageImporter({
          extensions: ['.scss', '.css']
        })
      })
    )
    .pipe(postcss([autoprefixer, cssnano, tailwindcss]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS['scss:build'].dest))
    .pipe(browserSync.stream())
}

function compileTS() {
  return gulp
    .src(PATHS.ts.src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(
      ts({
        target: 'ES6',
        experimentalDecorators: true,
        moduleResolution: 'node'
      })
    )
    .js.pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.ts.dest))
    .pipe(browserSync.stream())
}

// assets
function compileAssets() {
  return mergeStream(
    gulp.src(PATHS.assets.imageSrc).pipe(imagemin()).pipe(gulp.dest(PATHS.assets.imageDest)),
    gulp.src(PATHS.assets.src).pipe(gulp.dest(PATHS.assets.dest))
  )
}

function cleanDist() {
  return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    open: false,
    port: 3030,
    reloadDelay: 500
  })
  gulp.watch(PATHS['pug:watch'].src, compilePug)
  gulp.watch(PATHS['pug:watch'].src, compileScss)
  gulp.watch(PATHS['scss:watch'].src, compileScss)
  gulp.watch(PATHS.ts.src, compileTS)
}

exports.dev = gulp.series(
  cleanDist,
  gulp.parallel(compilePug, compileScss, compileTS, compileAssets),
  gulp.series(watch)
)

exports.build = gulp.series(cleanDist, gulp.parallel(compilePug, compileScss, compileTS, compileAssets))
