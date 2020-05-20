export const connectionState = status => {
    console.log('connectionState:' + status);
    return { type: 'CHANGE_CONNECTION_STATUS', isConnected: status };
};
