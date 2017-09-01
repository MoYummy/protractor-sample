const gulp = require("gulp");
const rename = require('gulp-rename');
const ts = require("gulp-typescript");
const tsConfig = ts.createProject("tsconfig.json");
const jasmine = require('gulp-jasmine');
const del = require('del');
const config = require('./gulp/config');
const protractor = require("gulp-protractor").protractor;

function clean(cb) {
  return del([
    tsConfig.options.outDir,
  ], cb)
}

gulp.task('clean', [], clean);

function prepare() {
  return gulp.src('./src/protractor-intercept.d.ts')
    .pipe(rename('index.d.ts'))
    .pipe(gulp.dest('./node_modules/protractor-intercept/lib'));
}

gulp.task('prepare', [], prepare);

function compile() {
  return tsConfig.src()
    .pipe(tsConfig())
    .js.pipe(gulp.dest(tsConfig.options.outDir));
}

gulp.task('compile', ['prepare'], compile);

function test() {
  return gulp.src(config.paths.specs)
    .pipe(protractor({
      configFile: config.paths.protractorConf,
      args: [],
    }));
}

gulp.task('test', ['compile'], test)