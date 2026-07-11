function drawNetworkV2(canvas, dimension, networkV2) {
    canvas.width = dimension[0];
    canvas.height = dimension[1];

    // Make sure we don't execute when canvas isn't supported
    if (canvas.getContext) {

        // use getContext to use the canvas for drawing
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.transform(1, 0, 0, -1, 0, canvas.height) // flip y

        //drawBorder(ctx, canvas);
        //console.log("networkUpdateUI=" + networkUpdateUI)
        if (networkUpdateUI > 0) {
            networkUpdateUI -= 1
            drawUpdating(ctx, canvas)
        }

        let network = networkV2;
        for (var layerIdx = 0; layerIdx < network.layers.length; layerIdx++) {
            let xShift = 100 * (layerIdx + 1)
            for (var layerNodeIdx = 0; layerNodeIdx < network.layers[layerIdx].length; layerNodeIdx++) {
                let yShift = 50 * (layerNodeIdx + 1)
                // console.log("draw node " + layerIdx + ":" + layerNodeIdx)
                this.drawBullet(ctx, {
                    "pos": { "x": xShift, "y": yShift },
                    "size": annNodeSize,
                    "fillStyle": "black"
                })
                let calcValue = Math.floor(networkDrawState[layerIdx][layerNodeIdx] * 10) / 10
                ctx.font = "10px Arial";
                ctx.fillText("" + calcValue, xShift, yShift + 10 + annNodeSize);
            }
        }

        for (let dstLayerIdx = 1; dstLayerIdx < network.weights.length; dstLayerIdx++) {
            for (let dstNodeIdx = 0; dstNodeIdx < network.weights[dstLayerIdx].length; dstNodeIdx++) {
                for (let srcNodeIdx = 0; srcNodeIdx < network.weights[dstLayerIdx][dstNodeIdx].length; srcNodeIdx++) {
                    let weight = network.weights[dstLayerIdx][dstNodeIdx][srcNodeIdx]
                    // set line stroke and line width
                    ctx.strokeStyle = 'black';
                    let linkLog = Math.max(0, Math.log(Math.abs(weight * 5)) + 1)
                    // console.log("linkIdx=" + linkIdx +
                    //     " link.weight=" + link.weight +
                    //     " width=" + linkLog)
                    if (link.weight != 0 && linkLog > 3) {
                        if (Math.sign(link.weight) > 0) {
                            ctx.strokeStyle = 'green';
                        } else {
                            ctx.strokeStyle = 'red';
                        }
                    }
                    if (linkLog == 0) {
                        ctx.setLineDash([5, 3]);
                        ctx.lineWidth = 2;
                    } else {
                        ctx.setLineDash([]);
                        ctx.lineWidth = linkLog;
                    }

                    // draw a line
                    ctx.beginPath();
                    let xShift = 100 * (dstLayerIdx) + annNodeSize
                    let yShift = 50 * (srcNodeIdx + 1)
                    ctx.moveTo(xShift, yShift);
                    xShift = 100 * (dstLayerIdx + 2) - annNodeSize
                    yShift = 50 * (dstNodeIdx + 1)
                    ctx.lineTo(xShift, yShift);
                    ctx.stroke();
                }
            }
        }
    } else {
        alert('Canvas.getContext not supported in your browser');
    }
}
