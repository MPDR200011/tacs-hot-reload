import * as gulp from 'gulp'
import * as bs from 'browser-sync'
import { default as webpack } from 'webpack-stream'
import * as path from 'path'

const browserSync = bs.create()
const { src, dest, watch, series } = gulp

function buildHtml() {
    // place code for your default task here
    return src('src/*.html').pipe(dest('public'))
}

function buildTypescript() {
    return src('src/**/*.ts').pipe(webpack({ 
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ['ts-loader'],
                    include: [
                        path.resolve(__dirname, 'src'),
                        path.resolve(__dirname, 'lib'),
                    ],
                },
            ],
        },
        output: {
            filename: 'source.js'
        },
        resolve: {
            extensions: ['.ts', '.js', '.json']
        }
    })).pipe(dest('public/js/'))
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
