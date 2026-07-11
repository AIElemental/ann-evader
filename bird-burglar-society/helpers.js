function random255() {
    return Math.floor(Math.random() * 256);
}

function clamp(x) {
    return Math.max(0, Math.min(255, Math.round(x)));
}

function randomPrism() {
    return new Prism(
        random255(),
        random255(),
        random255()
    );
}