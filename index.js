import makeHTTP from "./http-protocol.js"
import makeGemini from "./gemini-protocol.js"
import makeGopher from "./gopher-protocol.js"
import makeBTFetch from "./bt-protocol.js"
import makeIPFSFetch from "./ipfs-protocol.js"
import makeHyperFetch from "./hyper-protocol.js"
import makeOnion from "./tor-protocol.js"
import makeGarlic from "./iip-protocol.js"
import makeIndex from "./oui-protocol.js"

export {makeHTTP, makeGemini, makeGopher, makeBTFetch, makeIPFSFetch, makeHyperFetch, makeOnion, makeGarlic, makeIndex}