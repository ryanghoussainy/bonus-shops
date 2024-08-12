import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';


export async function getLogoPath(
    session: Session,
    setLogoUrl: (logoUrl: string) => void,
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
            setLogoUrl(data.logo_url)
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    }
}

export async function getLogo(path: string, setLogoUrl: (logoUrl: string) => void) {
    try {
      const { data, error } = await supabase.storage.from('logos').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setLogoUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }
