import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  innerPad?: number;
}

export function GlassCard({ children, style, glowColor = 'rgba(255,255,255,0.4)', innerPad = 14 }: GlassCardProps) {
  return (
    <View style={[styles.wrapper, { borderColor: glowColor, shadowColor: glowColor }, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.08)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={{ padding: innerPad }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
});
