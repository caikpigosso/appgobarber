import React, { useCallback, useRef } from 'react';
import * as Yup from 'yup';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Button from '../../Components/button';
import { useAuth } from '../../hooks/Auth';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountText,
} from './style';
import Input from '../../Components/Input';

import LogoImg from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>();
  const passwordInputRef = useRef<TextInput>(null);
  const handleSubmit = useCallback(async (data: SignInFormData) => {
    formRef.current?.setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um Email Válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      await signIn({
        email: data.email,
        password: data.password,
      });

      navigation.navigate('Dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }

      Alert.alert(
        'Erro na Autenticação',
        'Ocorreu um erro ao fazer login, cheque suas credenciais',
      );
    }
  }, []);

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
              <Title>Faça se Login</Title>
            </View>
            <Form onSubmit={handleSubmit} ref={formRef}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
                name="password"
                icon="lock"
                placeholder="Senha"
              />
            </Form>
            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>
            <ForgotPassword
              onPress={() => {
                console.log('Deu');
              }}
            >
              <ForgotPasswordText>Esquici Minha Senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
          <CreateAccountButton
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <Icon name="log-in" size={20} color="#FF9000" />
            <CreateAccountText>Criar conta</CreateAccountText>
          </CreateAccountButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
