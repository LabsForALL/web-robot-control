export interface IPeerServiceObserver{
    onPeerServiceOpen(regname : String);
    onPeerServiceDisconnect();
    onPeerServiceClosed();
    onPeerServiceError(errMsg:String);
}