import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassButtonProps {
  title: string;
  titleUr?: string;
  onPress: () => void;
  style?: ViewStyle;
  colors?: [string, string];
  disabled?: boolean;
  small?: boolean;
}

export function GlassButton({ title, titleUr, onPress, style, colors = ['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.12)'], disabled, small }: GlassButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.btn, small && styles.small, { opacity: pressed ? 0.7 : disabled ? 0.4 : 1 }, style]}
    >
      <LinearGradient colors={colors} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <Text style={[styles.title, small && styles.titleSm]}>{title}</Text>
      {titleUr ? <Text style={[styles.titleUr, small && styles.titleUrSm]}>{titleUr}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 13, paddingHorizontal: 22, alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  small: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700', textShadowColor: 'rgba(255,255,255,0.6)', textShadowRadius: 6 },
  titleSm: { fontSize: 12, fontWeight: '600' },
  titleUr: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  titleUrSm: { fontSize: 10 },
});
