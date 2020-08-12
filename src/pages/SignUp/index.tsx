import React, { useRef, useCallback } from 'react';
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
import * as Yup from 'yup';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  Container,
  Title,
  BacktoSignInButton,
  BacktoSignInText,
} from './style';
import Input from '../../Components/Input';
import Button from '../../Components/button';
import LogoImg from '../../assets/logo.png';

interface SingUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const handleSubmit = useCallback(
    async (data: []) => {
      formRef.current?.setErrors({});
      try {
        const shema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um Email Válido'),
          password: Yup.string().min(6, 'No mínimo 6 caracteres'),
        });
        await shema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);
        Alert.alert(
          'Cadastro realizado com Sucesso!!',
          'Você já pode fazer login na aplicação',
        );
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert('Erro no Cadastro ', 'Ocorreu um Erro ao Fazer o cadastro');
      }
    },
    [navigation],
  );
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
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                autoCorrect={false}
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome Completo"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
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
                textContentType="newPassword"
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
