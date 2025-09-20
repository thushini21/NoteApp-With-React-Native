import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function StatusBarInfo() {
  const [time, setTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [networkType, setNetworkType] = useState('');

  useEffect(() => {
    // Time updater
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Battery updater
    const getBattery = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        setBatteryLevel(Math.round(level * 100));
      } catch {}
    };
    getBattery();
    const batteryInterval = setInterval(getBattery, 60000);
    return () => clearInterval(batteryInterval);
  }, []);

  useEffect(() => {
    // Network updater
    const getNetwork = async () => {
      try {
        const net = await Network.getNetworkStateAsync();
        setNetworkType(net.type ?? 'Unknown');
      } catch {}
    };
    getNetwork();
    const netInterval = setInterval(getNetwork, 60000);
    return () => clearInterval(netInterval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Left: Time */}
      <Text style={styles.time}>{time}</Text>
      {/* Center: Signal & Network */}
      <View style={styles.centerBox}>
        <Ionicons name="cellular" size={18} color="#1976d2" style={{ marginRight: 4 }} />
        <Text style={styles.network}>{networkType}</Text>
        <MaterialCommunityIcons name="wifi" size={18} color={networkType === 'WIFI' ? '#1976d2' : '#bbb'} style={{ marginLeft: 4 }} />
      </View>
      {/* Right: Battery */}
      <View style={styles.batteryBox}>
        <MaterialCommunityIcons name="battery" size={18} color="#1976d2" style={{ marginRight: 2 }} />
        <Text style={styles.battery}>{batteryLevel !== null ? `${batteryLevel}%` : '--'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 32,
  },
  time: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    minWidth: 48,
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  network: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  batteryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  battery: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
    marginLeft: 2,
  },
});
