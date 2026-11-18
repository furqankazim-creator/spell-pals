import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Pic from './Pic';

export default function StarWordImageUpload({ value, emoji, onChange }: { value: string; emoji: string; onChange: (uri: string) => void }) {
  const inputRef = useRef<any>(null);
  const [dragging, setDragging] = useState(false);

  const pickNative = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) onChange(result.assets[0].uri);
  };

  const pickWeb = () => {
    if (Platform.OS !== 'web') return;
    const input = inputRef.current ?? (globalThis as any).document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result ?? ''));
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleDrop = (event: any) => {
    event.prevent?.();
    setDragging(false);
    const file = event.dataTransfer?.files?.[0];
    if (!file || !file.type?.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  };

  const webProps = Platform.OS === 'web' ? {
    onDragOver: (event: any) => { event.preventDefault?.(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop: handleDrop,
  } : {};

  return (
    <View>
      {Platform.OS === 'web' ? <input ref={inputRef} style={{ display: 'none' }} /> : null}
      <Pressable
        {...(webProps as any)}
        onPress={Platform.OS === 'web' ? pickWeb : pickNative}
        style={[styles.dropZone, dragging && styles.dropZoneActive, value ? styles.dropZoneFilled : null]}
        accessibilityRole="button"
        accessibilityLabel="Choose a picture for the custom word"
      >
        {value ? (
          <>
            <Pic emoji={emoji} imageUri={value} size={82} />
            <Text style={styles.changeText}>Change picture</Text>
          </>
        ) : (
          <>
            <View style={styles.uploadIcon}><Text style={styles.uploadIconText}>＋</Text></View>
            <Text style={styles.dropTitle}>Add a picture</Text>
            <Text style={styles.dropSub}>{Platform.OS === 'web' ? 'Drag & drop or choose a file' : 'Choose a photo from your device'}</Text>
          </>
        )}
      </Pressable>
      {value ? <Pressable onPress={() => onChange('')} style={styles.removeImage} accessibilityRole="button"><Text style={styles.removeImageText}>Remove picture</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dropZone: { minHeight: 150, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', backgroundColor: '#FAFBFF', alignItems: 'center', justifyContent: 'center', padding: 12 },
  dropZoneActive: { borderColor: '#5C5BE5', backgroundColor: '#F1F0FF' },
  dropZoneFilled: { minHeight: 168, borderStyle: 'solid', backgroundColor: '#FFFFFF' },
  uploadIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  uploadIconText: { color: '#5C5BE5', fontSize: 26, lineHeight: 28, fontWeight: '800' },
  dropTitle: { color: '#242331', fontSize: 16, fontWeight: '900' },
  dropSub: { color: '#7A8096', fontSize: 12, marginTop: 3 },
  changeText: { color: '#5C5BE5', fontSize: 13, fontWeight: '800', marginTop: 6 },
  removeImage: { alignSelf: 'center', marginTop: 8, paddingHorizontal: 12, paddingVertical: 5 },
  removeImageText: { color: '#D94A54', fontSize: 12, fontWeight: '800' },
});
