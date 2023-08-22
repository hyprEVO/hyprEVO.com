// -- Var -- //

//PLUGINS//
var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify-es').default;
var rename = require("gulp-rename");
var wait = require("gulp-wait");
var dirSync = require("gulp-directory-sync");
// var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var clean = require('gulp-rimraf');
var ftp = require('vinyl-ftp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');
var localFilesGlob = ['./build/**'];


//PROJECTS//
var localDir = "http://localhost/hyprEVO/";
var srcDir = "./src/";
var buildDir = "./build/";
var altDir = "C:/xampp/htdocs/hyprEVO/";



// -- BASE BUILD TASKS -- //


//Compile SCSS,make-styles --> build
gulp.task('make-styles', async function () {
    const timestamp = new Date().getTime(); // Get current timestamp
  
    gulp.src(srcDir + 'scss/style.scss', {
      allowEmpty: true
    })
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({
        compatibility: 'ie8'
      }))
      .pipe(autoprefixer())
      .pipe(gulp.dest(buildDir + 'css/'))
      .pipe(gulp.dest(altDir + 'css/'))
      .pipe(rename({ suffix: '?' + timestamp })) // Append timestamp as query parameter
      .pipe(gulp.dest(buildDir + 'css/'))
      .pipe(gulp.dest(altDir + 'css/'));
  });
  
gulp.task('make-sstyles', function () {
    runSequence('base-dev',
        'make-rest');
});

//Compile JS, make-js --> build
gulp.task('make-js', async function () {

    return gulp.src([srcDir + 'js/lib/*.js', srcDir + 'js/core/*.js'], {
        allowEmpty: true
    })
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir + 'js/'))
        .pipe(gulp.dest(altDir + 'js/'));
});

gulp.task('make-image', function () {
    return gulp.src(srcDir + 'img/**/**')
        .pipe()
        .pipe(gulp.dest(buildDir + 'img/'))
        .pipe(gulp.dest(altDir + 'img/'));
});

//Build everything make-rest --> build
gulp.task('make-rest', async function () {
    var ignoreList = ['html', 'modules', 'scss', 'css', 'js', 'js/**', 'partials', 'notes'];
    return gulp.src('.', {
        allowEmpty: true
    }).pipe(dirSync(srcDir, buildDir, {
        ignore: ignoreList
    })).pipe(dirSync(srcDir, altDir, {
        ignore: ignoreList
    }));
});

gulp.task('make-html', async function () {
    gulp.src([srcDir + 'index.html', srcDir + 'output-header.html', srcDir + 'output-join.html', srcDir + 'output-main.html', srcDir + 'output-comm.html'], {
        allowEmpty: true
    })
        .pipe(fileinclude())
        .pipe(gulp.dest(altDir))
        .pipe(gulp.dest(buildDir));
});


// -- UTIL -- //


//Kill build dir
gulp.task('clean', function () {

    return gulp.src('./build', {
        read: false,
        allowEmpty: true
    }) // much faster
        .pipe(wait(1000))
        .pipe(clean());

});
//(styles, js,, sync rest)
gulp.task('construct', gulp.series('clean',
    'make-styles',
    'make-js',
    'make-html',
    'make-rest'));

//(styles, js, image, sync rest)
gulp.task('construct-all', gulp.series('clean',
    'make-styles',
    'make-js',
    'make-html',
    'make-rest'));
//Spin up local server
gulp.task('sync', async function () {
    browserSync.init({
        proxy: localDir
    });
});





//Reload Browser
gulp.task('reload', function () {
    return gulp.src('.', {
        allowEmpty: true
    })
        .pipe(wait(2000))
        .pipe(browserSync.stream());
});






//-- WATCHERS --// 


gulp.task('watch', function () {
    //Source
    gulp.watch(['./src/*.html', './src/modules/*.html', './src/modules/*/*.html', './src/modules/*/*/*.html', './src/modules/handlebars/*.html', './src/*.html'], gulp.series('make-html', 'make-rest', 'reload'));
    gulp.watch(['./src/*.php'], gulp.series('make-html', 'make-rest', 'reload'));
    gulp.watch(['./src/scss/*.scss', './src/scss/*/*.scss'], gulp.series('make-html', 'make-styles', 'reload'));
    gulp.watch(['./src/js/**/*.js'], gulp.series('make-html', 'make-js', 'make-rest', 'reload'));
    gulp.watch(['./src/img/**'], gulp.series('make-rest', 'reload'));
});


// -- Default -- //

gulp.task('local', gulp.series('clean', 'construct-all', 'sync', 'watch'));
gulp.task('serve', gulp.series('sync', 'watch'));
gulp.task('makeBuild', gulp.series('clean', 'construct-all'));