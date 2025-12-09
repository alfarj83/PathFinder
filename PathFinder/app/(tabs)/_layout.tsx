import { Tabs } from 'expo-router';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Constants from "expo-constants";

console.log("EXTRA:", Constants.expoConfig?.extra);

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
           title: 'Home',
           tabBarIcon: ({ color }) => <Entypo name="home" size={30} color={color} />,
         }}
      />
      <Tabs.Screen
        name="faculty"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "User",
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={30} color={color} />
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
