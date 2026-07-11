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

// Source - https://stackoverflow.com/a/39671702
// Posted by Dekel, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-11, License - CC BY-SA 3.0

function getRandomItems(arr, items) {
    var ret = [];
    var indexes = [];
    var arr_length = arr.length;

    // If we don't have enough items to return - return the original array
    if (arr_length < items) {
        return arr;
    }

    while (ret.length < items) {
        i = Math.floor(Math.random() * arr_length);
        if (indexes.indexOf(i) == -1) {
            indexes[indexes.length] = i;
            ret[ret.length] = arr[i];
        }
    }
    return ret;
}
