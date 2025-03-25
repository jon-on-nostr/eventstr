import NDKSingleton, {
  getNDKInstance,
  getNDK,
  ensureNDKConnected,
  ConnectionState,
} from './ndkSingleton';

export { NDKSingleton, getNDKInstance, getNDK, ensureNDKConnected, ConnectionState };

// Default export of the singleton instance
export default getNDKInstance();
