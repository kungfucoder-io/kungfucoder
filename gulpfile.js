var gulp = require('gulp')
  , less = require('gulp-less')
;

gulp.task('build-less', function () {
  gulp.src('./public/src/less/base.less')
    .pipe(less())
    .pipe(gulp.dest('./public/dist/css/'))
  ;
});

gulp.task('watch', function () {
  gulp.watch(
    ['./public/src/less/*.less'],
    ['build-less']);
});

gulp.task('default', ['watch']);