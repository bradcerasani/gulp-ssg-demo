var gulp = require('gulp');
var ssg = require('gulp-ssg');
var frontmatter = require('gulp-front-matter');
var marked = require('gulp-marked');
var fs = require('fs');
var es = require('event-stream');
var mustache = require('mustache');
var http = require('http');
var ecstatic = require('ecstatic');

var site = {
  title: 'My Site'
};

gulp.task('html', function() {
  var template = String(fs.readFileSync('templates/page.html'));

  return gulp.src('src/**/*.markdown')
    .pipe(frontmatter({
      property: 'meta'
    }))
    .pipe(marked())
    .pipe(ssg(site, {
      property: 'meta'
    }))
    .pipe(es.map(function(file, cb) {
      var html = mustache.render(template, {
        page: file.meta,
        site: site,
        content: String(file.contents)
      });
      file.contents = new Buffer(html);
      cb(null, file);
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', function() {
  http.createServer(
    ecstatic({root: __dirname + '/build/home'})
  ).listen(4000);
  console.log("Preview at http://localhost:4000");

  gulp.watch('src/*.markdown', ['html']);
  gulp.watch('templates/*.html', ['html']);
});


