import { Stack, router } from 'expo-router';
import { PaperProvider, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, Platform, StyleSheet } from 'react-native';
import { darkTheme, lightTheme } from '../src/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : darkTheme; // Default to dark theme for GP-200 aesthetic

  const content = (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: '',
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <IconButton
                  icon="guitar-electric"
                  iconColor={theme.colors.onSurface}
                  size={24}
                  onPress={() => router.push('/pedal-editor')}
                />
                <IconButton
                  icon="playlist-music"
                  iconColor={theme.colors.onSurface}
                  size={24}
                  onPress={() => router.push('/setlist')}
                />
                <IconButton
                  icon="cog"
                  iconColor={theme.colors.onSurface}
                  size={24}
                  onPress={() => router.push('/settings')}
                />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="tabs"
          options={{
            title: 'Guitar Tabs',
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="setlist"
          options={{
            title: 'Set List',
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="preset-editor"
          options={{
            title: 'Edit Preset',
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="pedal-remote"
          options={{
            title: 'Pedal Remote',
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Stack.Screen
          name="pedal-editor"
          options={{
            title: 'Pedal Editor',
            headerLeft: () => (
              <IconButton
                icon="arrow-left"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={() => router.back()}
              />
            ),
          }}
        />
      </Stack>
    </PaperProvider>
  );

  // On web, wrap in a phone-sized container
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.phoneFrame}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 390,
    height: '100%',
    maxHeight: 844,
    backgroundColor: '#121212',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
});
