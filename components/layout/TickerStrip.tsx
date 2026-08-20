import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const SW = Dimensions.get('window').width;

interface TickerStripProps {
  text: string;
  bgColor: string;
  textColor?: string;
  direction?: 'rtl' | 'ltr';
  height?: number;
}

export function TickerStrip({ text, bgColor, textColor = '#FFFFFF', direction = 'rtl', height = 24 }: TickerStripProps) {
  const translateX = useRef(new Animated.Value(direction === 'rtl' ? SW : -(text.length * 9 + SW))).current;
  const displayText = `  ✦  ${text}  ✦  ${text}  ✦  ${text}  `;
  const textWidth = displayText.length * 8.5;
  const duration = Math.max(12000, (textWidth + SW) / 80 * 1000);

  useEffect(() => {
    let anim: Animated.CompositeAnimation;
    const run = () => {
      translateX.setValue(direction === 'rtl' ? SW : -textWidth);
      anim = Animated.timing(translateX, {
        toValue: direction === 'rtl' ? -textWidth : SW,
        duration,
        useNativeDriver: true,
      });
      anim.start(({ finished }) => { if (finished) run(); });
    };
    run();
    return () => { anim?.stop(); translateX.stopAnimation(); };
  }, [text, direction]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor, height }]}>
      <Animated.Text
        numberOfLines={1}
        style={[styles.text, { color: textColor, transform: [{ translateX }] }]}
      >
        {displayText}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', justifyContent: 'center' },
  text: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4, position: 'absolute', width: 9999 },
});
