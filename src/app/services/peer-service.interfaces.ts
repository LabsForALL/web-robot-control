export interface IPeerServiceObserver{
    onPeerServiceOpen(regname : String);
    onPeerServiceDisconnected();
    onPeerServiceClosed();
    onPeerServiceError(errMsg:String);
}

export interface IPeerDataConnectionObserver{
    onPeerDataConnectionOpen();
    onPeerDataConnectionData(data:any);
    onPeerDataConnectionClose();
    onPeerDataConnectionError(err:any);
}

export interface IPeerMediaConnectionObserver{
    onPeerMediaConnectionOpen(stream:any);
    onPeerMediaConnectionClosed();
    onPeerMediaConnectionError(err:any);
}