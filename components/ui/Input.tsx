import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, !!error && styles.inputError, style]}
        placeholderTextColor="#94a3b8"
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  label: { color: '#334155', marginBottom: 6, fontWeight: '500' },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    color: '#0f172a',
  },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 4 },
});
