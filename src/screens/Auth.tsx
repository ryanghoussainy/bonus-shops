import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Input, Button, Icon, Switch } from '@rneui/themed';
import { useTheme } from '../contexts/ThemeContext';
import Colours from '../config/Colours';
import Fonts from '../config/Fonts';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logos';
import { createUser } from '../operations/User';
import { getShopNames } from '../operations/Shop';

export default function ShopAuth() {
  // Get theme
  const { theme, toggleTheme } = useTheme();

  // User's details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [preferredTheme, setPreferredTheme] = useState(theme === 'light' ? false : true);

  // User can press the 'eye' icon to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Modal visibility for creating a new account
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    // Validate that all required fields are filled
    if (!email || !password || !mobileNumber || !shopName || !location || !description || !logoUrl) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Check that name is available
    const shops = await getShopNames();
    if (shops.map(shop => shop.name).includes(shopName)) {
      Alert.alert('Error', 'This shop name is already taken.');
      return
    }

    // Attempt to create a new user
    createUser(email, password, mobileNumber, shopName, location, description, logoUrl, preferredTheme ? "dark" : "light", setLoading);
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    setEmail('');
    setPassword('');
    setMobileNumber('');
    setShopName('');
    setLocation('');
    setDescription('');
    setLogoUrl('');
  }

  const handleOpenModal = () => {
      setModalVisible(true);
      setEmail('');
      setPassword('');
  }

  return (
    <View style={[styles.container, { backgroundColor: Colours.background[theme] }]}>
      <Text style={styles.title}>Welcome to the Shop Portal!</Text>
      <Text style={[styles.subtitle, { color: Colours.text[theme] }]}>Log in to your shop account</Text>

      <Input
        label="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope', color: Colours.text[theme] }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
        containerStyle={styles.inputContainer}
        disabled={loading}
      />

      <Input
        label="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: Colours.text[theme], size: 30, style: { marginRight: 5 } }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
        containerStyle={styles.inputContainer}
        disabled={loading}
        rightIcon={
          <Icon
            type="font-awesome"
            name={passwordVisible ? "eye" : "eye-slash"}
            onPress={() => setPasswordVisible(!passwordVisible)}
            color={Colours.text[theme]}
            size={24}
          />
        }
      />

      <Button
        title={loading ? <ActivityIndicator color="#fff" /> : "Log in"}
        onPress={signInWithEmail}
        disabled={loading}
        buttonStyle={styles.loginButton}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.loginTitle}
      />

      <TouchableOpacity onPress={handleOpenModal}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      {/* Sign Up Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: Colours.background[theme] }]}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Shop Account</Text>

              <View style={styles.themeToggleContainer}>
                <Text style={[styles.themeToggleText, { color: Colours.text[theme] }]}>Preferred Theme:</Text>
                <Switch
                  value={preferredTheme}
                  onValueChange={(value) => {
                    setPreferredTheme(value);
                    toggleTheme();
                  }}
                  color={Colours.primary}
                />
              </View>

              <Input
                label="Email *"
                leftIcon={{ type: 'font-awesome', name: 'envelope', color: Colours.text[theme] }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize="none"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Password *"
                leftIcon={{ type: 'font-awesome', name: 'lock', color: Colours.text[theme], size: 30, style: { marginRight: 5 } }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={!passwordVisible}
                placeholder="Password"
                autoCapitalize="none"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
                rightIcon={
                  <Icon
                    type="font-awesome"
                    name={passwordVisible ? "eye" : "eye-slash"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    color={Colours.text[theme]}
                    size={24}
                  />
                }
              />

              <Input
                label="Mobile Number *"
                onChangeText={(text) => setMobileNumber(text)}
                value={mobileNumber}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Shop Name *"
                onChangeText={(text) => setShopName(text)}
                value={shopName}
                placeholder="Shop Name"
                autoCapitalize="words"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Location *"
                onChangeText={(text) => setLocation(text)}
                value={location}
                placeholder="Shop Location"
                autoCapitalize="words"
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              <Input
                label="Description *"
                onChangeText={(text) => setDescription(text)}
                value={description}
                placeholder="Brief Description"
                autoCapitalize="sentences"
                multiline={true}
                inputStyle={{ color: Colours.text[theme], fontFamily: Fonts.condensed }}
                containerStyle={styles.inputContainer}
                disabled={loading}
              />

              {/* Logo Upload Component */}
              <View style={styles.logoContainer}>
                <Text style={[styles.logoLabel, { color: Colours.bluegrey }]}>Please upload your logo: *</Text>
                <Logo
                  size={200}
                  url={logoUrl}
                  onUpload={(url: string) => setLogoUrl(url)}
                />
              </View>

              <Button
                title={loading ? <ActivityIndicator color="#fff" /> : "Sign up"}
                onPress={signUpWithEmail}
                disabled={loading}
                buttonStyle={styles.signupButton}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.signupTitle}
              />

              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colours.primary,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Fonts.condensed,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Fonts.condensed,
  },
  inputContainer: {
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: Colours.primary,
    padding: 15,
    borderRadius: 8,
  },
  loginTitle: {
    fontSize: 18,
    fontFamily: Fonts.condensed,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signupText: {
    fontSize: 16,
    color: Colours.primary,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: Fonts.condensed,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colours.primary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Fonts.condensed,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeToggleText: {
    fontSize: 16,
    fontFamily: Fonts.condensed,
  },
  signupButton: {
    backgroundColor: Colours.primary,
    padding: 15,
    borderRadius: 8,
  },
  signupTitle: {
    fontSize: 18,
    fontFamily: Fonts.condensed,
    fontWeight: 'bold',
  },
  closeModalText: {
    fontSize: 16,
    color: Colours.primary,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: Fonts.condensed,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: Fonts.condensed,
    fontWeight: 'bold',
  },
});
