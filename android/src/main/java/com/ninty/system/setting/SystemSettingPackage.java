package com.ninty.system.setting;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.List;

/**
 * This class is responsible for linking native modules with the React Native application.
 */
public class SystemSettingPackage implements ReactPackage {

    /**
     * Creates a list of native modules to be included in the React Native application.
     *
     * @param reactContext the context of the React application
     * @return a list containing the native modules to be linked
     */
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.singletonList(new SystemSetting(reactContext));
    }

    /**
     * Creates a list of view managers to be included in the React Native application.
     *
     * @param reactContext the context of the React application
     * @return an empty list as no custom views are being managed
     */
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
