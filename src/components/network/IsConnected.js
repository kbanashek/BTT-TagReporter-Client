import * as React from 'react';
import { Text, View } from 'react-native';

// export const IsConnected = () => {
//     console.log('isConnectedComponent');
//     return <Text>Test</Text>;
// };

export const IsConnected = ({ isConnected }) => {
    return <Text>isConnected: {isConnected.toString()}</Text>;
};
