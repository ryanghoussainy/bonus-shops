import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function getLogoPath(
    session: Session,
    setUrl: (logoUrl: string) => void,
) {
    try {
        if (!session?.user) throw new Error('No user on the session!')

        const { data, error, status } = await supabase
            .from('shop_profiles')
            .select(`logo_url`)
            .eq('id', session?.user.id)
            .single()
        if (error && status !== 406) {
            throw error
        }

        if (data) {
            setUrl(data.logo_url)
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    }
}

export async function getLogo(path: string, setLogoUrl?: (logoUrl: string) => void): Promise<string> {
  try {
    const { data, error } = await supabase.storage.from('logos').download(path);

    if (error) {
      Alert.alert(error.message);
      return "";
    }

    return new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        const logoUrl = fr.result as string;
        if (setLogoUrl) setLogoUrl(logoUrl);
        resolve(logoUrl);
      };
      fr.onerror = () => {
        resolve("");
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return "";
  }
}
