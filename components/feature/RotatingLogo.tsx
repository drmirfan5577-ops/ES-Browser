import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useBrowserContext } from '@/contexts/BrowserContext';

interface RotatingLogoProps { size?: number; onPress?: () => void; }

export function RotatingLogo({ size = 44, onPress }: RotatingLogoProps) {
  const { theme, customLogoUri } = useBrowserContext();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 5000, easing: Easing.linear }), -1, false);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  const r = size / 2;
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.outer, { width: size + 8, height: size + 8, borderRadius: r + 4, borderColor: theme.glassBorder }]}>
        <Animated.View style={[{ width: size, height: size, borderRadius: r }, animStyle]}>
          <LinearGradient
            colors={['#FFD700', '#FF6B6B', '#FFFFFF', '#00BFFF', '#FFD700']}
            style={{ width: size, height: size, borderRadius: r }}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
          <Image
            source={customLogoUri ? { uri: customLogoUri } : require('@/assets/images/esb-logo.png')}
            style={{ width: size * 0.8, height: size * 0.8, borderRadius: r * 0.8 }}
            contentFit="contain"
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FFD700', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 12,
    elevation: 8,
  },
});
