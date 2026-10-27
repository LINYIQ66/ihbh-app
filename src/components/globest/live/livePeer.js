const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }] };
export default function createLivePeer() {
  const peer = Object.assign(new RTCPeerConnection(config), {pendingCandidates: /** @type {RTCIceCandidateInit[]} */ ([]) });
  peer.pendingCandidates = [];
  return peer;
}
export async function receiveCandidate(peer, candidate) {
  if (!peer || !candidate || peer.signalingState === 'closed') return;
  if (!peer.remoteDescription) peer.pendingCandidates.push(candidate);
  else await peer.addIceCandidate(candidate);
}
export async function receiveDescription(peer, description) {
  await peer.setRemoteDescription(description);
  for (const candidate of peer.pendingCandidates.splice(0)) await peer.addIceCandidate(candidate);
}