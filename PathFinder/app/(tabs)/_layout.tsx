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
        options={{
           title: 'Home'
           //tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
         }}
      />
      <Tabs.Screen
        name="faculty"
        options={{
          title: 'Faculty'
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "User"
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
