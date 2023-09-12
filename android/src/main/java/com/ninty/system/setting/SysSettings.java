package com.ninty.system.setting;

import android.provider.Settings;
import java.util.Map;
import java.util.HashMap;

/**
 * Enum representing various system settings along with their associated actions and request codes.
 */
public enum SysSettings {

    UNKNOWN("", 0),
    WIFI(Settings.ACTION_WIFI_SETTINGS, 1),
    LOCATION(Settings.ACTION_LOCATION_SOURCE_SETTINGS, 2),
    BLUETOOTH(Settings.ACTION_BLUETOOTH_SETTINGS, 3),
    WRITE_SETTINGS(Settings.ACTION_MANAGE_WRITE_SETTINGS, 4),
    AIRPLANE(Settings.ACTION_AIRPLANE_MODE_SETTINGS, 5);

    private static final Map<Integer, SysSettings> SETTINGS_MAP = new HashMap<>();

    static {
        for (SysSettings setting : SysSettings.values()) {
            SETTINGS_MAP.put(setting.requestCode, setting);
        }
    }

    public final String action;
    public final int requestCode;

    /**
     * Constructor to initialize SysSettings enum instance.
     *
     * @param action the associated action string
     * @param requestCode the associated request code
     */
    private SysSettings(String action, int requestCode) {
        this.action = action;
        this.requestCode = requestCode;
    }

    /**
     * Retrieves the SysSettings enum based on the provided request code.
     *
     * @param requestCode the request code to look for
     * @return the corresponding SysSettings enum, or UNKNOWN if not found
     */
    public static SysSettings get(int requestCode){
        return SETTINGS_MAP.getOrDefault(requestCode, UNKNOWN);
    }
}
