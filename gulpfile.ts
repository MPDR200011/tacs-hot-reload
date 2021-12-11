import { src, dest, watch, series } from 'gulp'
import * as ts from 'gulp-typescript'
import * as bs from 'browser-sync'

const tsProject = ts.createProject('tsconfig.json')
const browserSync = bs.create()

function buildHtml() {
    // place code for your default task here
    return src('src/*.html').pipe(dest('public'))
}

function buildTypescript() {
    return src('src/**/*.ts').pipe(tsProject()).pipe(dest('public'))
}

function dev() {
    browserSync.init({
        server: {
            baseDir: './public'
        },
        open : false,
        injectChanges: true
    });

    watch('src/**/*.ts', {ignoreInitial: false, persistent: true}, function reloadTS(cb) {buildTypescript(); browserSync.reload(); cb()})
    watch('src/*.html', {ignoreInitial: false, persistent: true}, function reloadHTML(cb) {buildHtml(); browserSync.reload(); cb()})
}

export { dev }
export default series(buildHtml, buildTypescript)
