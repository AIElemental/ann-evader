class NetworkV2 {
    //layers is array of arrays [
    //  [A 0, j], // just input count, not actually used, first input is bias B
    //  [A 1, j] // functions that will take sum of inputs with weights and produce some output
    //]
    constructor(...layers) {
        console.log("Layers count=" + layers.length);
        this.layers = layers;
        this.weights = this.generateWeights(layers);
    }

    generateWeights(layers) {
        let result = []
        result.push([])
        for (let srcLayerIdx = 0; srcLayerIdx < layers.length - 2; srcLayerIdx++) {
            let dstLayerIdx = srcLayerIdx + 1;
            let srcLayerInputs = layers[srcLayerIdx].length
            let dstLayerInputs = layers[dstLayerIdx].length
            let layerInputWeights = []
            for (let dstIdx = 0; dstIdx < dstLayerInputs; dstIdx++) {
                let layerInputWeightsLine = []
                for (let srcIdx = 0; srcIdx < srcLayerInputs; srcIdx++) {
                    let weight = 0
                    if (Math.random() < 0.5) {
                        weight = (Math.random() < 0.5) ? -1 : 1;
                    }
                    layerInputWeightsLine.push(weight)
                }
                layerInputWeights.push(layerInputWeightsLine)
            }
            result.push(layerInputWeights)
        }
        return result
    }

    calc(input) {
        if (input.length != this.layers[0].length) {
            console.log("Bad input. Need array of length " + this.layers[0].length + ". Got " + input.length)
            return
        }
        for (let i = 0; i < input.length; i++) if (input[i] == null) throw new Error("bad network calc input at idx=" + i)

        let results = [input]
        let layerInput = input
        for (let layerIdx = 1; layerIdx < this.layers.length; layerIdx++) {
            let layerResults = []
            for (let layerNodeIdx = 0; layerNodeIdx < this.layers[layerIdx].length; layerNodeIdx++) {
                let inputSum = 0
                for (let layerNodeInputIdx = 0; layerNodeInputIdx < this.layers[layerIdx - 1].length; layerNodeInputIdx++) {
                    inputSum = inputSum + input[layerNodeInputIdx] * this.weights[layerIdx][layerNodeIdx][layerNodeInputIdx]
                }
                let layerNodeFunctionResult = this.layers[layerIdx][layerNodeIdx](inputSum)
                layerResults.push(layerNodeFunctionResult)
            }
            layerInput = layerResults
            results.push(layerResults)
        }
        return results
    }

    trainSingle(input, outcome) {
        if (input.length != this.layers[0].length) {
            console.log("Bad input. Need array of length " + this.layers[0].length + ". Got " + input.length)
            return
        }
        for (let i = 0; i < input.length; i++) if (input[i] == null) throw new Error("bad network calc input at idx=" + i)

        let results = [input]
        let layerInput = input
        for (let layerIdx = 1; layerIdx < this.layers.length; layerIdx++) {
            let layerResults = []
            for (let layerNodeIdx = 0; layerNodeIdx < this.layers[layerIdx].length; layerNodeIdx++) {
                let inputSum = 0
                for (let layerNodeInputIdx = 0; layerNodeInputIdx < this.layers[layerIdx - 1].length; layerNodeInputIdx++) {
                    inputSum = inputSum + input[layerNodeInputIdx] * this.weights[layerIdx][layerNodeIdx][layerNodeInputIdx]
                }
                let layerNodeFunctionResult = this.layers[layerIdx][layerNodeIdx](inputSum)
                layerResults.push(layerNodeFunctionResult)
            }
            layerInput = layerResults
            results.push(layerResults)
        }
        return results
    }

    //----

    splitIntoSectors(angleNormalRad, sectors) {
        let result = []
        for (let secId = 0; secId < sectors; secId++) {
            let sectorMin = 2.0 * Math.PI * secId / sectors
            let sectorMax = 2.0 * Math.PI * (secId + 1) / sectors
            let inSector = sectorMin <= angleNormalRad && angleNormalRad < sectorMax
            result.push(inSector ? 1 : 0)
        }
        return result;
    }

    queueInput(invaderShip, evaderShip) {
        if (this.trainInputQueueBusy) return;
        let input = this.makeInput(invaderShip, evaderShip)
        for (let i = 0; i < input.length; i++) if (input[i] == null) throw new Error("bad network queue input")

        if (this.trainInputQueueIdx == 0) {
            let previousValue = this.trainInputQueue[this.trainInputQueueIdx]
            // this.trainSingle(previousValue, -1, -1)
        }
        this.trainInputQueue[this.trainInputQueueIdx] = input
        this.trainInputQueueIdx = (this.trainInputQueueIdx + 1) % queueSize
    }

    trainSingle(input, result, weightAdjust) {
        if (input === undefined) return;
        if (result != 1 && arrayContains(this.trainInputDeadSet, input)) {
            console.log("Skip input, its actually deadly " + input)
            return;
        }
        let networkResult = this.calc(input)
        console.log("Network result " + networkResult + " expected result " + result)
        if (networkResult[2][0] == result) {
            console.log("No error, no updates to network")
            return;
        }
        let updates = 0
        for (let secondLayerIdx = 0; secondLayerIdx < this.layers[1]; secondLayerIdx++) {

            let secondLayerNodeValue = 0;
            for (let linkIdx = 0; linkIdx < this.links.length; linkIdx++) {
                let link = this.links[linkIdx]
                if (link.src.layerIdx == 0 && link.dst.layerIdx == 1
                && link.dst.layerNodeIdx == secondLayerIdx) {
                    secondLayerNodeValue += link.weight * input[link.src.layerNodeIdx]
                }
            }
            //console.log("train single idx=" + secondLayerIdx + " value=" + secondLayerNodeValue + " middleValue=" + this.middleLayerIdxFunction(secondLayerNodeValue))
            if (this.middleLayerIdxFunction(secondLayerNodeValue) > 0) {
                for (let linkIdx = 0; linkIdx < this.links.length; linkIdx++) {
                    let link = this.links[linkIdx]
                    if (link.src.layerIdx == 1 && link.dst.layerIdx == 2
                    && link.src.layerNodeIdx == secondLayerIdx) {
                        link.weight += weightAdjust
                        updates = 1
                        console.log(link.toString() + " weight readjusted")
                    }
                }
            }
        }
        if (result == 1 && !arrayContains(this.trainInputDeadSet, input)) {
            this.trainInputDeadSet.push(input)
            console.log("Stored dead combinations " + this.trainInputDeadSet.length)
        }
        networkUpdateUI = updates * fps
    }

    trainOnLastEventsAsDeath(lastEventCount) {
        this.trainInputQueueBusy = true
        let smallQueue = [];
        for (let i = 0; i < lastEventCount; i++) {
            smallQueue.push(this.trainInputQueue.shift())
        }
        this.trainInputQueueBusy = false
        for (let i = 0; i < lastEventCount; i++) {
            this.trainSingle(smallQueue.shift(), 1, 1)
        }
    }
}
