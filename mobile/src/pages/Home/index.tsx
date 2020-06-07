import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Select from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string,
  nome: string
}

interface IBGECitiesResponse {
  nome: string,
  id: number
}

interface UFs {
  label: string,
  value: string
}

interface Cities {
  label: string,
  value: string
}

const Home = () => {
    const [ufs, setUfs] = useState<UFs[]>([]);
    const [cities, setCities] = useState<Cities[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const navigation = useNavigation();

    const ufSelectPlaceholder = { label: "Selecione seu estado (UF)", value: '0' };
    const citySelectPlaceholder = { label: "Selecione sua cidade", value: '0' };

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
          const ufs = response.data.map(uf => ({
            label: uf.nome,
            value: uf.sigla
          }));
  
          setUfs(ufs);
        });
    }, []);
  
    useEffect(() => {
      if (selectedUf !== '0') {
        axios.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
          .then(response => {
            const cities = response.data.map(city => ({
              label: city.nome,
              value: city.nome
            }));
  
            setCities(cities);
          });
      }
    }, [selectedUf]);

    function handleNavigateToPoints() {
      if ((selectedUf === '0') || (selectedCity === '0')) {
        Alert.alert('Ooops...', 'Você deve selecionar um estado e uma cidade para prosseguir');
      } else {
        navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
      }
    }

    return (
        <ImageBackground 
            source={require('../../assets/home-background.png')} 
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}            
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <Select
                  placeholder={ufSelectPlaceholder}
                  value={selectedUf}
                  style={styles.input}
                  items={ufs}
                  onValueChange={value => setSelectedUf(value)}
                />
                
                <Select
                  disabled={selectedUf === '0'}
                  placeholder={citySelectPlaceholder}
                  style={styles.input}
                  items={cities}
                  value={selectedCity}
                  onValueChange={value => setSelectedCity(value)}
                />

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;