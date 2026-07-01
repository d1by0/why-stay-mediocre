import Foundation
import MultipeerConnectivity
import CryptoKit

public protocol MultipeerSessionDelegate: AnyObject {
    func multipeerSession(_ session: MultipeerSession, didReceiveData data: Data, fromPeer peerID: MCPeerID)
    func multipeerSession(_ session: MultipeerSession, peer peerID: MCPeerID, didChangeState state: MCSessionState)
}

public final class MultipeerSession: NSObject {
    private let peerID: MCPeerID
    private var session: MCSession!
    private var advertiser: MCNearbyServiceAdvertiser!
    private var browser: MCNearbyServiceBrowser!
    private let serviceType = "aura-mesh"
    
    public weak var delegate: MultipeerSessionDelegate?
    
    public override init() {
        self.peerID = MCPeerID(displayName: UIDevice.current.name)
        super.init()
        
        self.session = MCSession(
            peer: self.peerID,
            securityIdentity: nil,
            encryptionPreference: .required
        )
        self.session.delegate = self
        
        self.advertiser = MCNearbyServiceAdvertiser(
            peer: peerID,
            discoveryInfo: nil,
            serviceType: serviceType
        )
        self.browser = MCNearbyServiceBrowser(
            peer: peerID,
            serviceType: serviceType
        )
        
        self.advertiser.delegate = self
        self.browser.delegate = self
    }
    
    public func startServices() {
        advertiser.startAdvertisingPeer()
        browser.startBrowsingForPeers()
    }
    
    public func stopServices() {
        advertiser.stopAdvertisingPeer()
        browser.stopBrowsingForPeers()
    }
    
    public func sendDataToAllPeers(_ data: Data) {
        guard !session.connectedPeers.isEmpty else { return }
        do {
            try session.send(data, toPeers: session.connectedPeers, with: .reliable)
        } catch {
            print("Failed to send data to peers: \(error.localizedDescription)")
        }
    }
}

extension MultipeerSession: MCSessionDelegate {
    public func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        delegate?.multipeerSession(self, peer: peerID, didChangeState: state)
    }
    
    public func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        delegate?.multipeerSession(self, didReceiveData: data, fromPeer: peerID)
    }
    
    public func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
    
    public func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
    
    public func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}
}

extension MultipeerSession: MCNearbyServiceAdvertiserDelegate {
    public func advertiser(
        _ advertiser: MCNearbyServiceAdvertiser,
        didReceiveInvitationFromPeer peerID: MCPeerID,
        withContext context: Data?,
        invitationHandler: @escaping (Bool, MCSession?) -> Void
    ) {
        invitationHandler(true, self.session)
    }
}

extension MultipeerSession: MCNearbyServiceBrowserDelegate {
    public func browser(
        _ browser: MCNearbyServiceBrowser,
        foundPeer peerID: MCPeerID,
        withDiscoveryInfo info: [String: String]?
    ) {
        browser.invitePeer(peerID, to: self.session, withContext: nil, timeout: 10.0)
    }
    
    public func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {}
}
