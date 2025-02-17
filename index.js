import path from 'path'
import fs from 'fs'

export default async function(fsPath, opts = {}){
    fsPath = fsPath || path.join(import.meta.dirname, 'data')
    if(!fs.existsSync(fsPath)){
        fs.mkdirSync(fsPath, {recursive: true})
    }
    const obj = {}
    const closer = []
    const appOpts = {bt: {dir: path.join(fsPath, 'bt'), err: opts.err}, ipfs: {repo: path.join(fsPath, 'ipfs'), err: opts.err}, hyper: {storage: path.join(fsPath, 'hyper'), err: opts.err}}
    const torrentz = await (async () => {const {default: Torrentz} = await import('torrentz');return new Torrentz(appOpts.bt);})()
    const helia = await (async () => {const {createHelia} = await import('helia');const {FsDatastore} = await import('datastore-fs');const {FsBlockstore} = await import('blockstore-fs');const {identify} = await import('@libp2p/identify');const {kadDHT} = await import('@libp2p/kad-dht');const {gossipsub} = await import('@chainsafe/libp2p-gossipsub');return await createHelia({blockstore: new FsBlockstore(appOpts.ipfs.repo), datastore: new FsDatastore(appOpts.ipfs.repo), libp2p: {services: {dht: kadDHT(), pubsub: gossipsub(), identify: identify()}}});})()
    const sdk = await (async () => {const SDK = await import('hyper-sdk');const sdk = await SDK.create(appOpts.hyper);return sdk;})()

    if(opts.bt){
        const {default: createBTHandler} = await import('./proto/bt-protocol.js')
        const { handler: btHandler, close: closeBT } = await createBTHandler({...appOpts.bt, torrentz})
        closer.push(closeBT)
        obj.bt = btHandler
    }
    if(opts.ipfs){
        const {default: createIPFSHandler} = await import('./proto/ipfs-protocol.js')
        const { handler: ipfsHandler, close: closeIPFS } = await createIPFSHandler({...appOpts.ipfs, helia})
        closer.push(closeIPFS)
        obj.ipfs = ipfsHandler
    }
    if(opts.hyper){
        const {default: createHyperHandler} = await import('./proto/hyper-protocol.js')
        const { handler: hyperHandler, close: closeHyper } = await createHyperHandler({...appOpts.hyper, sdk})
        closer.push(closeHyper)
        obj.hyper = hyperHandler
    }
    if(opts.msg){
        const {default: createMsgHandler} = await import('./proto/msg-protocol.js')
        const { handler: msgHandler, close: closeMsg } = await createMsgHandler({...appOpts.bt, torrentz})
        closer.push(closeMsg)
        obj.msg = msgHandler
    }
    if(opts.pubsub){
        const {default: createPubsubHandler} = await import('./proto/pubsub-protocol.js')
        const { handler: pubsubHandler, close: closePubsub } = await createPubsubHandler({...appOpts.ipfs, helia})
        closer.push(closePubsub)
        obj.pubsub = pubsubHandler
    }
    if(opts.topic){
        const {default: createTopicHandler} = await import('./proto/topic-protocol.js')
        const { handler: topicHandler, close: closeTopic } = await createTopicHandler({...appOpts.hyper, sdk}, session)
        closer.push(closeTopic)
        obj.topic = topicHandler
    }
    return {obj, closer}
}