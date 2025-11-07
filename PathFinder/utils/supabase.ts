import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage'
//import Constants from 'expo-constants';

//const extra = Constants.expoConfig?.extra ?? {};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// --- ADD THESE LINES FOR DEBUGGING ---
console.log("--- DEBUGGING .env VARIABLES ---");
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseKey);
console.log("---------------------------------");
// ---------------------------------------

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Database URL or ANON key.")
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});