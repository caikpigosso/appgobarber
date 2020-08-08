import React, { useRef } from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import {
  Container,
  Title,
  BacktoSignInButton,
  BacktoSignInText,
} from './style';
import Input from '../../Components/Input';
import Button from '../../Components/button';
import LogoImg from '../../assets/logo.png';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={LogoImg} />
            <View>
              <Title>Crie sua Conta</Title>
            </View>
            <Form
              ref={formRef}
              onSubmit={() => {
                console.log('');
              }}
            >
              <Input name="nname" icon="user" placeholder="Nome Completo" />
              <Input name="email" icon="mail" placeholder="E-mail" />
              <Input name="passowrd" icon="lock" placeholder="Senha" />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>
          </Container>
          <BacktoSignInButton
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          >
            <Icon name="arrow-left" size={20} color="#f4ede8" />
            <BacktoSignInText>Voltar para login</BacktoSignInText>
          </BacktoSignInButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
