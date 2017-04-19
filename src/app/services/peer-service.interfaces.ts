export interface IPeerServiceListener {
    onPeerServiceOpen(regName: String);
    onPeerServiceDisconnected();
    onPeerServiceClosed();
    onPeerServiceError(errMsg: String);
}

export interface IPeerDataConnectionListener {
    onPeerDataConnectionOpen();
    onPeerDataConnectionData(data: any);
    onPeerDataConnectionClose();
    onPeerDataConnectionError(err: any);
}

export interface IPeerMediaConnectionListener {
    onPeerMediaConnectionOpen(stream: any);
    onPeerMediaConnectionClosed();
    onPeerMediaConnectionError(err: any);
}


export interface IPeerServerListeners extends IPeerMediaConnectionListener,
  IPeerDataConnectionListener, IPeerServiceListener {

}
