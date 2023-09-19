import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Switch, Text, View} from 'react-native';
import systemSetting, {CompleteFunc, VolumeData} from 'react-native-system-setting';
import Slider from '@react-native-community/slider';

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    slider: {
        width: 200,
        height: 40,
    },
});

const sliderTrackTintColor = {
    minimumTrackTintColor: '#FFFFFF',
    maximumTrackTintColor: '#000000',
}

const App: React.FC = () => {
    const [volume, setVolume] = useState<number | null>(null);
    const [brightness, setBrightness] = useState<number | null>(null);
    const [wifiState, setWifiState] = useState<boolean | null>(null);
    const [locationState, setLocationState] = useState<boolean | null>(null);
    const [bluetoothState, setBluetoothState] = useState<boolean | null>(null);

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
            setVolume(data.value);
        });

        return () => {
            systemSetting.removeVolumeListener(volumeListener);
        };
    }, []);

    const handleBrightnessChange = async (value: number) => {
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

    return (
        <View style={styles.container}>
            <Text>Volume: {volume}</Text>
            {volume !== null && (
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={handleVolumeChange}
                    {...sliderTrackTintColor}
                />

            )}

            <Text>Brightness: {brightness}</Text>
            {brightness !== null && (
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={brightness}
                    onValueChange={handleBrightnessChange}
                    {...sliderTrackTintColor}
                />

            )}

            <Text>WiFi State: {wifiState ? 'On' : 'Off'}</Text>
            {wifiState !== null && (
                <Switch value={wifiState} onValueChange={handleSwitchChange(setWifiState, systemSetting.switchWifi)}/>
            )}

            <Text>Location State: {locationState ? 'On' : 'Off'}</Text>
            {locationState !== null && (
                <Switch value={locationState} onValueChange={handleSwitchChange(setLocationState, systemSetting.switchLocation)}/>
            )}

            <Text>Bluetooth State: {bluetoothState ? 'On' : 'Off'}</Text>
            {bluetoothState !== null && (
                <Switch value={bluetoothState} onValueChange={handleSwitchChange(setBluetoothState, systemSetting.switchBluetooth)}/>
            )}

            <Button title="Refresh Values" onPress={fetchValues}/>
        </View>
    );
};

export default App;
