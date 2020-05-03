var gulp = require('gulp');
var $ = require("gulp-load-plugins")();
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

//ライブラリを結合
gulp.task("lib", (done) => {
	gulp.src(['src/assets/_lib/00_jquery/*.js','src/assets/_lib/**/*.js'])
		.pipe($.plumber())
		.pipe($.uglify()) //圧縮
		.pipe($.concat('library.js')) //結合
		// .pipe($.notify("[js] Compliled:)"))
		.pipe(gulp.dest('./src/assets/js'));
	done();
});

gulp.task("scss", () => {
	return gulp.src('src/assets/_scss/**/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe(
			$.sass({
				outputStyle: 'expanded'
			})
			.on('error', $.sass.logError)
		)
		.pipe($.pleeease({
			autoprefixer: {
				browsers: ['last 2 versions', 'ie >= 10', 'Android >= 5','ios_saf 10','ios_saf 10', 'Safari >= 8']
			},
			rem: {rootValue: '10px'},
			minifier: false,
			opacity: true,
			filters: true
		}))
		// .pipe($.sourcemaps.write("sourcemaps"))
		// .pipe($.csscomb())
		.pipe(gulp.dest('src/assets/css'));
});

// Static server
gulp.task('browser-sync', () => {
	return browserSync({
		notify: false,
		// server: {
		// 	baseDir: "./src/"
		// },
  //       port: 3000
        proxy : 'localhost:10021'
	})
})

// Reload all browsers
gulp.task("reload", (done) => {
  browserSync.reload()
  done()
})


gulp.task("watch", () => {
	gulp.watch('src/assets/_scss/**/*.scss', gulp.series("scss", "reload"));
	gulp.watch('src/assets/_lib/**/*.js', gulp.series('lib', "reload"));
	gulp.watch("src/**/*.html", gulp.task('reload'));

})
gulp.task("default", gulp.parallel("browser-sync", "watch"));