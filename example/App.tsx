import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SystemSetting from 'react-native-system-setting';

const App = () => {
  const [volume, setVolume] = useState<number | null>(null);
  const [brightness, setBrightness] = useState<number | null>(null);
  const [wifiState, setWifiState] = useState<string | null>(null);

  useEffect(() => {
    // Get initial volume and brightness values
    SystemSetting.getVolume().then(setVolume);
    SystemSetting.getBrightness().then(setBrightness);

    // Get initial WiFi state
    SystemSetting.isWifiEnabled().then((enable) => {
      setWifiState(enable ? 'On' : 'Off');
    });

    // Setup volume listener
    const volumeListener = SystemSetting.addVolumeListener((data) => {
      setVolume(data.value);
    });

    // Cleanup listener on component unmount
    return () => {
      SystemSetting.removeVolumeListener(volumeListener);
    };
  }, []);

  const handleIncreaseBrightness = () => {
    if (brightness !== null) {
      SystemSetting.setBrightnessForce(brightness + 0.1).catch(() => {
        Alert.alert(
          'Permission Deny',
          'You have no permission changing settings',
          [
            { text: 'Ok', style: 'cancel' },
            { text: 'Open Setting', onPress: () => SystemSetting.grantWriteSettingPermission() },
          ],
        );
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Volume: {volume}</Text>
      <Text>Brightness: {brightness}</Text>
      <Text>WiFi State: {wifiState}</Text>

      <Button title="Increase Brightness" onPress={handleIncreaseBrightness} />
    </View>
  );
};

export default App;
