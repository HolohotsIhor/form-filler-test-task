/* 	************** 
	VARIEBLES
	************** */
const project_folder = 'dist'; // Final project directory
const source_folder = 'src';   // Source directory

// Full project links
const path={
	build: {
		html: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		img: project_folder + '/img/',
		fonts: project_folder + '/fonts/',
	},
	src: {
		html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
		css: source_folder + '/css/**/*.styl',
		js: source_folder + '/js/script.js',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
		fonts: source_folder + '/fonts/*ttf'
	},
	watch: {
		html: source_folder + '/**/*.html',
		css: source_folder + '/css/**/*.styl',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}'
	},
	clean: "./" + project_folder + "/"
};

// Plugins variables
const {src, dest} = require('gulp'),
	gulp = require('gulp'),
	minify = require('gulp-minify'),
	stylus = require('gulp-stylus'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	uglify = require('gulp-uglify-es').default;


/*  ************** 
	FUNCTIONS 
	*************** */
// Browser reload task
browserSync = () => {
	browsersync.init({
		server: {
      		baseDir: './' + project_folder + '/'
    	},
    	open: false, // Automatical open in browser: false. Ubuntu error
		notify: false
	})
};

// Prepare HTML
html = () => {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
};

// Prepare Fonts
fonts = () => {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
};

getTTF = () => {
	return src([source_folder + '/fonts/*.ttf'])
		.pipe(dest(path.build.fonts));
};

// Prepare Images
images = () => {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
};

// Prepare CSS
css = () => {
	return src(path.src.css)
		.pipe(stylus())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 5 versions'],
				cascade: true
			})
		)
		.pipe(dest(path.build.css))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(
			rename({
				extname: '.min.css'
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
};

// Prepare JS
js = () => {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(minify())
		.pipe(
			rename({
				extname: '.min.js'
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
};


// What files are causing the think reload?
watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
};

// Delet 'Dist folder'
clean = () => {
	return del(path.clean);
};

const build = gulp.series(clean, gulp.parallel(js, fonts, getTTF, css, html, images));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.getTTF = getTTF;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;