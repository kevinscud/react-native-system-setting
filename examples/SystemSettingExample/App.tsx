import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Switch, Text, View, ScrollView } from 'react-native';
import systemSetting, { CompleteFunc, VolumeData } from 'react-native-system-setting';
import Slider from '@react-native-community/slider';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  slider: {
    width: '100%',
    height: 30,
    alignSelf: 'center',
  },
  spacer: {
    height: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
  },
});

const sliderTrackTintColor = {
  minimumTrackTintColor: '#FFFFFF',
  maximumTrackTintColor: '#000000',
};

const formatValue = (value: boolean | number | null) => {
  if (typeof value === 'number') {
    return `${Math.round(value * 100)}%`;
  }
  return value ? 'On' : 'Off';
};

const SettingSwitch = ({ value, onValueChange, label }: { value: boolean | null, onValueChange: (newValue: boolean) => void, label: string }) => (
    <View>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.valueText}>{formatValue(value)}</Text>
      {value !== null && (
          <Switch value={value} onValueChange={onValueChange} />
      )}
      <View style={styles.spacer} />
    </View>
);



const App: React.FC = () => {
  const [volume, setVolume] = useState<number | null>(null);
  const [brightness, setBrightness] = useState<number | null>(null);
  const [wifiState, setWifiState] = useState<boolean | null>(null);
  const [locationState, setLocationState] = useState<boolean | null>(null);
  const [bluetoothState, setBluetoothState] = useState<boolean | null>(null);
  const [permissions, setPermissions] = useState({ writeSettingsPermissions: false });

  const fetchValues = () => {
    systemSetting.getVolume().then(setVolume);
    systemSetting.getBrightness().then(setBrightness);
    systemSetting.isWifiEnabled().then(setWifiState);
    systemSetting.isLocationEnabled().then(setLocationState);
    systemSetting.isBluetoothEnabled().then(setBluetoothState);
  };

  useEffect(() => {
    fetchValues();

    const volumeListener = systemSetting.addVolumeListener((data: VolumeData) => {
      console.log(`Volume changed: ${data.value}`);
      setVolume(data.value);
    });

    const bluetoothListener = systemSetting.addBluetoothListener((bluetoothEnabled: boolean) => {
      console.log(`Bluetooth state changed: ${bluetoothEnabled}`);
    });

    const wifiListener = systemSetting.addWifiListener((wifiEnabled: boolean) => {
      console.log(`WiFi state changed: ${wifiEnabled}`);
    });

    const locationListener = systemSetting.addLocationListener((locationEnabled: boolean) => {
      console.log(`Location state changed: ${locationEnabled}`);
    });

    const locationModeListener = systemSetting.addLocationModeListener((locationMode: number) => {
      console.log(`Location mode changed: ${locationMode}`);
    });

    const airplaneListener = systemSetting.addAirplaneListener((airplaneModeEnabled: boolean) => {
      console.log(`Airplane mode state changed: ${airplaneModeEnabled}`);
    });

    return () => {
      systemSetting.removeVolumeListener(volumeListener);
      systemSetting.removeListener(bluetoothListener);
      systemSetting.removeListener(wifiListener);
      systemSetting.removeListener(locationListener);
      systemSetting.removeListener(locationModeListener);
      systemSetting.removeListener(airplaneListener);
    };
  }, []);


  const checkPermissions = async () => {
    try {
      const writeSettingsPermissions = await systemSetting.checkWriteSettingsPermissions();
      setPermissions({ writeSettingsPermissions });

      if (!writeSettingsPermissions) {
        console.log("Write Settings Permission is not granted");
        systemSetting.grantWriteSettingPermission();
      }
    } catch (error) {
      console.log("An error occurred while checking permissions:", error);
      setPermissions({ writeSettingsPermissions: false });
      systemSetting.grantWriteSettingPermission();
    }
  };

  const handleBrightnessChange = async (value: number) => {
    if (!permissions.writeSettingsPermissions) {
      return;
    }

    try {
      const result = await systemSetting.setBrightnessForce(value);
      if (!result) {
        Alert.alert('Permission Denied', 'You have no permission changing settings', [
          { text: 'Ok', style: 'cancel' },
          { text: 'Open Setting', onPress: () => systemSetting.grantWriteSettingPermission() },
        ]);
      } else {
        setBrightness(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVolumeChange = async (value: number) => {
    if (!permissions.writeSettingsPermissions) {
      return;
    }

    try {
      const volumeType = 'music';
      systemSetting.setVolume(value, {
        type: volumeType,
        playSound: false,
        showUI: false,
      });
      setVolume(value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitchChange = (setter: React.Dispatch<React.SetStateAction<boolean | null>>, switchFunction: (onComplete?: CompleteFunc) => void) => (newValue: boolean) => {
    switchFunction(() => {
      setter(newValue);
    });
  };

  const { writeSettingsPermissions } = permissions;

  return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Button title="Refresh Values" onPress={fetchValues} />
          <View style={styles.spacer} />

          <Button title="Check Permissions" onPress={checkPermissions} />
          <View style={styles.spacer} />

          <Text style={styles.labelText}>Volume</Text>
          <Text style={styles.valueText}>{formatValue(volume)} (raw: {volume})</Text>
          {volume !== null && (
              <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  {...sliderTrackTintColor}
                  disabled={!writeSettingsPermissions}
              />
          )}
          <View style={styles.spacer} />

          <Text style={styles.labelText}>Brightness</Text>
          <Text style={styles.valueText}>{formatValue(brightness)} (raw: {brightness})</Text>
          {brightness !== null && (
              <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={brightness}
                  onValueChange={handleBrightnessChange}
                  {...sliderTrackTintColor}
                  disabled={!writeSettingsPermissions}
              />
          )}
          <View style={styles.spacer} />

          <SettingSwitch value={wifiState} onValueChange={handleSwitchChange(setWifiState, systemSetting.switchWifi)} label="WiFi State" />
          <SettingSwitch value={locationState} onValueChange={handleSwitchChange(setLocationState, systemSetting.switchLocation)} label="Location State" />
          <SettingSwitch value={bluetoothState} onValueChange={handleSwitchChange(setBluetoothState, systemSetting.switchBluetooth)} label="Bluetooth State" />
        </View>
      </ScrollView>
  );
}

export default App;
