import { StyleSheet, Platform } from 'react-native';

export const glassBase = {
  backgroundColor: 'rgba(255,255,255,0.22)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.45)',
  borderRadius: 16,
  overflow: 'hidden' as const,
  ...Platform.select({
    ios: { shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 12 },
    android: { elevation: 6 },
  }),
};

export const glowText = (color: string, size: number = 12) => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: size,
});

export const sharedStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
  flex1: { flex: 1 },
  absolute: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#fff', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    ...Platform.select({
      ios: { shadowColor: '#fff', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  glowBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
});
