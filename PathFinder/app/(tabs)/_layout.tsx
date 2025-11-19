import { Tabs } from 'expo-router';
import React from 'react';

import Constants from "expo-constants";

console.log("EXTRA:", Constants.expoConfig?.extra);

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        // options={{
        //   title: 'Home',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        // }}
      />
      <Tabs.Screen
        name="faculty"
      />
      <Tabs.Screen
      name="test"
      />
    </Tabs>
  );
}
