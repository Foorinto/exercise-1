const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const purgecss = require('gulp-purgecss')

// Clean assets

function clear() {
    return src('./assets/*', {
            read: false
        })
        .pipe(clean());
}

// JS function 

function js() {
    const source = './js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./assets/js/'));
}

// JS function no minify 

function jsnomin() {
    const source = './js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat('app.js'))
        .pipe(dest('./assets/js/'));
}

// CSS function 

function css() {
    const source = './sass/main.scss';

    return src(source)
        .pipe(changed(source))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./assets/css/'));
}

// purgecss file

// function purgecssfile() {
//     return src('./assets/css/*.css')
//         .pipe(purgecss({
//             content: ['./*.html']
//         }))
//         .pipe(dest('./assets/css'))
// }

// Watch files

function watchFiles() {
    watch('./sass/*', css);
    watch('./js/*', jsnomin);
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles);
exports.default = series(clear, parallel(js, css));