(() => {
    let counterElement = document.getElementById('counter')

    let buttonElement = document.getElementById('button')

    let counter = 0

    function setCounterContents() {
        if (!counterElement) {
            console.log('Counter element is missing')
            return
        }
        counterElement.innerHTML = `${counter}`;
    }

    setCounterContents()

    if (!buttonElement) {
        console.log('Button element is missing')
        return
    }
    buttonElement.addEventListener('click', () => {
        counter += 5;
        setCounterContents()
    })
})();
