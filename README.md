# react-native-system-setting

System setting APIs for iOS and Android

## Support

* Volume (with listener)
* Brightness
* Wi-Fi switch
* Location
* Bluetooth
* Airplane

## Note

**[Example](./examples/SystemSettingExample) only works on a real device**

## Change Log

[Change Log](./CHANGELOG.md)

Breaking change for permission since `V1.5.0`,
see [Android Permission](https://github.com/c19354837/react-native-system-setting#android-permission)

## How it looks

_todo: add screenshots and a video usage example_

## Install

Using npm:

```bash
npm install react-native-system-setting --save
```

or using yarn:

```bash
yarn add react-native-system-setting
```

### Link

If using react-native < 0.60, run `react-native link` to link this library.

#### iOS

_todo: confirm this_

Add `pod 'RCTSystemSetting', :path => '../node_modules/react-native-system-setting'` in `Podfile` for Cocoapods.

If linking with `react-native link` did not work, you can do
it [manually](https://facebook.github.io/react-native/docs/linking-libraries-ios.html).

#### Android

If linking with `react-native link` did not work, you can do it manually by following these steps:

**android/settings.gradle**

```gradle
include ':react-native-system-setting'
project(':react-native-system-setting').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-system-setting/android')
```

**android/app/build.gradle**

```gradle
dependencies {
   ...
   compile project(':react-native-system-setting')
}
```

**android/app/src/main/java/..packageName../MainApplication.java**

At the top of the file, import `react-native-system-setting`:

```java
import com.ninty.system.setting.SystemSettingPackage;
```

Add the `SystemSettingPackage` class to your list of exported packages.

```java
class MainApplication extends Application implements ReactApplication {
    // ...
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new SystemSettingPackage()
        );
    }
}
```

## Usage

### Common import

```javascript
import SystemSetting from 'react-native-system-setting'
```

### Volume

```javascript
// get the current volume
SystemSetting.getVolume().then((volume) => {
    console.log('Current volume is ' + volume);
});

// change the volume
SystemSetting.setVolume(0.5);

// listen the volume changing if you need
const volumeListener = SystemSetting.addVolumeListener((data) => {
    const volume = data.value;
    console.log(volume);
});

// remove listener when you need it no more
SystemSetting.removeVolumeListener(volumeListener)       
```

> `setVolume` can do more, [more detail](./API.md)

### Brightness

```javascript
// get the current brightness
SystemSetting.getBrightness().then((brightness) => {
    console.log('Current brightness is ' + brightness);
});

// change the brightness & check permission
SystemSetting.setBrightnessForce(0.5).then((success) => {
    !success && Alert.alert('Permission Deny', 'You have no permission changing settings', [
        {'text': 'Ok', style: 'cancel'},
        {'text': 'Open Setting', onPress: () => SystemSetting.grantWriteSettingPermission()}
    ])
});

// save the value of brightness and screen mode.
SystemSetting.saveBrightness();
// restore the brightness and screen mode. you can get the old brightness value.
SystemSetting.restoreBrightness().then((oldVal) => {
    // if you need
})

// change app's brightness without any permission.
SystemSetting.setAppBrightness(0.5);
SystemSetting.getAppBrightness().then((brightness) => {
    console.log('Current app brightness is ' + brightness);
})
```

> `setBrightness()` & `saveBrightness()`
> need [permission](https://github.com/c19354837/react-native-system-setting#android-permission) for Android

### Wi-Fi

```javascript
SystemSetting.isWifiEnabled().then((enable) => {
    const state = enable ? 'On' : 'Off';
    console.log('Current wifi is ' + state);
})

SystemSetting.switchWifi(() => {
    console.log('switch wifi successfully');
})
```

> `isWifiEnabled()` need [permission](https://github.com/c19354837/react-native-system-setting#android-permission) for
> Android
>
> `switchWifi()` is disabled by default for iOS since
> V1.7.0, [enable it](./iOS.md#ios)

### Location

```javascript
SystemSetting.isLocationEnabled().then((enable) => {
    const state = enable ? 'On' : 'Off';
    console.log('Current location is ' + state);
})

SystemSetting.switchLocation(() => {
    console.log('switch location successfully');
})
```

> `switchLocation()` is disabled by default for iOS since
> V1.7.0, [enable it](./iOS.md#ios)

### Bluetooth

```javascript
SystemSetting.isBluetoothEnabled().then((enable) => {
    const state = enable ? 'On' : 'Off';
    console.log('Current bluetooth is ' + state);
})

SystemSetting.switchBluetooth(() => {
    console.log('switch bluetooth successfully');
})
```

> `isBluetoothEnabled()` need [permission](https://github.com/c19354837/react-native-system-setting#android-permission)
> for Android
>
> All bluetooth-function are disabled by default for iOS since
> V1.7.0, [enable it](./iOS.md#ios)

### Airplane mode

```javascript
SystemSetting.isAirplaneEnabled().then((enable) => {
    const state = enable ? 'On' : 'Off';
    console.log('Current airplane is ' + state);
})

SystemSetting.switchAirplane(() => {
    console.log('switch airplane successfully');
})
```

> `isAirplaneEnabled()` will always return `true` for iOS if your device has no SIM card,
> see [detail](https://github.com/c19354837/react-native-system-setting/issues/37)
>
> `switchAirplane()` is disabled by default for iOS since
> V1.7.0, [enable it](./iOS.md#ios)

### App System Settings

```javascript
// open app setting page
SystemSetting.openAppSystemSettings()
```

## API

[API](./API.md)

## Run example

```bash
cd example
yarn
# for iOS
react-native run-ios
# for Android
react-native run-android
```

## iOS

[//]: # (To be more friendly to app store, I disable some APIs for iOS since V1.7.0, You)

[//]: # (can [enable it]&#40;./iOS.md&#41; in a few steps.)

To be app store friendly, APIs for iOS are disabled since `V1.7.0`, You can enable it in a few steps by following
instructions in [iOS.md](./iOS.md)

## Android permission

### API

Default permissions were removed in V1.5.0,
see [this PR](https://github.com/c19354837/react-native-system-setting/pull/44)
You need to declare the corresponding permissions in your app's `AndroidManifest.xml`.
See [example AndroidManifest.xml](./examples/SystemSettingExample/android/app/src/main/AndroidManifest.xml)

**`android/app/src/main/AndroidManifest.xml`**

```xml

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="YourPackageName"
          android:versionCode="1"
          android:versionName="1.0">

    <!-- setBrightness() & setScreenMode() & saveBrightness() -->
    <uses-permission android:name="android.permission.WRITE_SETTINGS"/>

    <!-- isWifiEnabled() -->
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>

    <!-- isBluetoothEnabled() -->
    <uses-permission android:name="android.permission.BLUETOOTH"/>

    <!-- * switchWifiSilence() -->
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>

    <!-- * switchBluetoothSilence() -->
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>

    <!-- ... -->

</manifest>
```

> There are some different APIs that end with `silence`. They can do the job programmatically without direct user
> consent. These APIs may be useful when you develop a system management app. You should
> call `switchWifi()` & `switchBluetooth()` to get a better user experience

### Do Not Disturb

`setVolume()` may cause a crash: **Not allowed to change Do Not Disturb state**.
See [detail](https://github.com/c19354837/react-native-system-setting/issues/48).

### Runtime permission for Android 6+

Change *brightness* and *screen mode* need `android.permission.WRITE_SETTINGS` which user can disable it in Android
settings. When you call `setScreenMode()`, `setBrightness()` or `setBrightnessForce()` , it will return `false` if the
app has no permission, and you can call `SystemSetting.grantWriteSettingPermission()` to guide user to app setting page.
There is also a `SystemSetting.checkWriteSettingsPermissions()` API to check if the app has `WRITE_SETTINGS` permission.

> If you just want to change app's brightness, you can call `setAppBrightness(val)`, and it doesn't require any
> permission. see [API](./API.md)

## Contributions are welcome

Feel free to open issues or pull requests

## License

[**MIT**](./LICENSE.md)
