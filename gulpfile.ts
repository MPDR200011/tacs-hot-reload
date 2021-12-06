import { src, dest, watch } from 'gulp';

function buildHtml() {
    // place code for your default task here
    return src('src/*.html').pipe(dest('public'))
}

function defaultTask() {
    watch('src/*.html', {ignoreInitial: false}, buildHtml)
}

export default defaultTask;
