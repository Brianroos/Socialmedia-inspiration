(function () {
  'use strict';

  /* Require Gulp plugins */
  var gulp      = require('gulp'),
    newer       = require('gulp-newer'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    bulkSass    = require('gulp-sass-bulk-import'),
    notify      = require('gulp-notify'),
    image       = require('gulp-image'),
    del         = require('del'),
    runSequence = require('run-sequence'),
    svgmin      = require('gulp-svgmin'),
    uglify      = require('gulp-uglify'),
    useref      = require('gulp-useref'),
    cleanCSS    = require('gulp-clean-css'),
    sass        = require('gulp-sass'),
    sassOptions = {errLogToConsole: true, outputStyle: 'expanded'};

  const directories = {
    src: 'app',
    dest: 'dist',
    node: 'node_modules'
  };

  const locations = {
    components: directories.src + '/views/modules/**'
  };

  const paths = {
  styles: {
    src: [
      directories.src + '/styles/'
    ],
    base: [
      directories.src + '/styles/vendor.scss',
      directories.src + '/styles/global.scss',
      directories.src + '/styles/modules.scss',
    ],
    vendor: [
      directories.node + '/foundation-sites/dist/css/foundation.css'
    ],
    dest: directories.dest + '/css'
  },
  scripts: {
    src: [
      directories.src + '/scripts/'
    ],
    components: [
      directories.src + '/scripts/modules/*.js'
    ],
    vendor: [
      directories.node + '/jquery/dist/jquery.js',
      directories.node + '/foundation-sites/dist/js/foundation.js',
      directories.src + '/scripts/vendor/**/*.js'
    ],
    dest: directories.dest + '/js'
  },
  html: {
    components_src: [
      locations.components + '/*.html',
      locations.components + '/*.php'
    ],
    components_dest: directories.dest + '/components'
  },
  assets: {
    fonts: {
      src: [
        directories.src + '/assets/fonts/**/*'
      ],
      dest: directories.dest + '/assets/fonts/'
    },
    images: {
      src: [
        directories.src + '/assets/images/**/*.png',
        directories.src + '/assets/images/**/*.PNG',
        directories.src + '/assets/images/**/*.jpg',
        directories.src + '/assets/images/**/*.JPG',
        directories.src + '/assets/images/**/*.gif',
        directories.src + '/assets/images/**/*.GIF'
      ],
      dest: directories.dest + '/assets/images/'
    }
  }
};

  // Clean dist
  gulp.task('clean', function () {
    return del('./dist');
  });
  // Build templates and export
  gulp.task('createTemplates', function () {
    return gulp.src(['app/*.php', 'app/*.html'])
      .pipe(newer('dist'))
      .pipe(gulp.dest('dist'));
  });
  gulp.task('handlebarsTemplates', function() {
    return gulp.src(['app/views/*.handlebars'])
      .pipe(newer('dist/views'))
      .pipe(gulp.dest('dist/views'));
  });
  gulp.task('handlebarsPartials', function() {
    return gulp.src(['app/views/modules/**/*.handlebars'])
      .pipe(newer('dist/views/modules'))
      .pipe(gulp.dest('dist/views/modules'));
  });
  gulp.task('handlebarsElements', function() {
    return gulp.src(['app/views/elements/*.handlebars'])
      .pipe(newer('dist/views/elements'))
      .pipe(gulp.dest('dist/views/elements'));
  });

  // Combine and Minify the JS and CSS sources.
  gulp.task('combineSources', function () {
    return gulp.src(['dist/*.php', 'dist/*.html'])
      .pipe(useref())
      .pipe(gulp.dest('dist'));
  });

  gulp.task('assets:all', function() {
    return gulp.start('assets:fonts', 'assets:images');
  });
  // Export the fonts to their appropriate locations
  gulp.task('assets:fonts', function () {
    return gulp.src(paths.assets.fonts.src)
      .pipe(newer(paths.assets.fonts.dest))
      .pipe(gulp.dest(paths.assets.fonts.dest));
  });
  // Optimizes Images (also SVG, but not using that extension)
  gulp.task('assets:images', function () {
    return gulp.src(paths.assets.images.src)
      .pipe(newer(paths.assets.images.dest))
      // .pipe(image())
      .pipe(gulp.dest(paths.assets.images.dest));
  });

  gulp.task('css', ['css:vendor', 'css:modules'], function() {
    return gulp.src(paths.styles.base)
      .pipe(concat('style.scss'))
      .pipe(sass({}))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(rename({suffix: '.min'}))
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(notify({message: 'css task done'}))
  });
  gulp.task('css:modules', function() {
    return gulp.src('app/views/modules/**/scss/*.scss')
      .pipe(concat('modules.scss'))
      .pipe(gulp.dest(paths.styles.src + '/'))
      .pipe(bulkSass())
      .pipe(notify({message: 'css:modules task done'}));
  });
  gulp.task('css:vendor', function() {
    return gulp.src(paths.styles.vendor)
      .pipe(concat('vendor.scss'))
      .pipe(gulp.dest(paths.styles.src + '/'))
      .pipe(bulkSass())
      .pipe(notify({message: 'css:vendor task done'}));
  });

  gulp.task('js:all', function() {
    return gulp.start('js', 'js:vendor');
  });
  gulp.task('js', ['js:build'], function() {
    return gulp.src(['app/scripts/modules.js', 'app/scripts/base.js'])
      .pipe(concat('script.js'))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(notify({message: 'js task done'}))
  });
  gulp.task('js:build', function() {
    return gulp.src(paths.scripts.components)
      .pipe(concat('modules.js'))
      .pipe(gulp.dest(paths.scripts.src + '/'))
      .pipe(notify({message: 'js:build task done'}));
  });
  gulp.task('js:vendor', function() {
    return gulp.src(paths.scripts.vendor)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(rename({suffix : '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(notify({message: 'js:vendor task done'}));
  });

  gulp.task('watch', function () {
    gulp.watch(['app/views/modules/**/scss/*.scss', 'app/styles/modules/*.scss', 'app/styles/global/*.scss', 'app/styles/*.scss', paths.styles.src, directories.src + '/scss/*.scss'], ['styling']);
    gulp.watch([paths.scripts.src, paths.scripts.components, directories.src + '/scripts/*.js'], ['js']);
    gulp.watch(['app/views/*.handlebars', 'app/views/modules/**/*.handlebars', 'app/views/elements/*.handlebars', 'app/views/modules/**/*.html', 'app/views/modules/**/*.php', 'app/views/*.html', 'app/views/*.php'], ['html']);
    gulp.watch([paths.assets.fonts.src], ['assets:fonts']);
    gulp.watch([paths.assets.images.src], ['assets:images']);
  });

  // Actions run from the browser or from a Watcher
  gulp.task('default', ['clean'], function (cb) {
    runSequence('media', 'scripting', 'styling', cb);
  });
  gulp.task('all', function (cb) {
    runSequence('media','scripting', 'styling', cb);
  });
  gulp.task('media', function (cb) {
    runSequence('assets:all', cb);
  });
  gulp.task('styling', function (cb) {
    runSequence('css', 'html', cb);
  });
  gulp.task('scripting', function (cb) {
    runSequence('js:all', cb);
  });
  gulp.task('html', function (cb) {
    runSequence('createTemplates', 'handlebarsElements', 'handlebarsPartials', 'handlebarsTemplates', 'combineSources', cb);
  });
  gulp.task('files', function (cb) {
    runSequence('clean', 'sass', 'createTemplates', 'combineSources', 'scripts', cb);
  });
}());
