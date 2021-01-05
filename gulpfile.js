let project_folder = "dist";
let source_folder = "source";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  source: {
    html: source_folder + "/*.html",
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/"
}


let {src, dest}  = require('gulp'),
  gulp  = require('gulp'), 
  browsersync  = require('browser-sync').create(),
  del  = require('del'),
  scss  = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  gulp_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin');
  

  function browserSync() {
    browsersync.init({
      server: {
        baseDir: "./" + project_folder + "/"
      },
      port: 3000,
      notify: false
    })
  }


  function html() {
    return src(path.source.html)
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  }

  function css () {
    return src(path.source.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe(
      gulp_media()
    )
    .pipe (
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  }

  function js() {
    return src(path.source.js)
      .pipe(dest(path.build.js))
      .pipe(
        uglify()
      )
      .pipe(
        rename({
          extname: ".min.js"
        })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
  }

  function imges() {
    return src(path.source.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false}],
        interlaced: true,
        optimizationLavel: 3
      })
    )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
  }



  function watchFiles() {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], imges)
  }

  function clean () {
    return del(path.clean);
  }


let build = gulp.series(clean, gulp.parallel(js, css, html, imges));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.build = build;
exports.imges = imges;
exports.js = js;
exports.css = css;
exports.html = html;
exports.watch = watch;
exports.default = watch;

