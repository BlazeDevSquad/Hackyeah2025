import {Tabs} from "expo-router";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Platform, StyleSheet, View} from 'react-native';
import {useThemeColor} from "@/hooks/use-theme-color";

const TabIcon = ({ iconName, color }: { iconName: any; color: string }) => (
    <View style={styles.tabContainer}>
        <MaterialCommunityIcons name={iconName} size={28} color={color} />
    </View>
);

export default function TabsLayout() {
    const tabIconDefault = useThemeColor({}, 'tabIconDefault');
    const tabIconSelected = useThemeColor({}, 'tabIconSelected');
    const backgroundColor = useThemeColor({ light: '#fff', dark: '#151718'}, 'background');
    const borderColor = useThemeColor({ light: '#f0f0f0', dark: '#334155'}, 'border');

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: Platform.OS === "ios" ? 75 : 100,
                    borderTopWidth: 1,
                    borderTopColor: borderColor,
                    backgroundColor: backgroundColor,
                    paddingTop: 6,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            iconName="home-outline"
                            color={focused ? tabIconSelected : tabIconDefault}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="record"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            iconName="record-circle-outline"
                            color={focused ? tabIconSelected : tabIconDefault}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            iconName="format-list-checks"
                            color={focused ? tabIconSelected : tabIconDefault}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
    }
});
