import { StackScreenProps } from "@react-navigation/stack";

type MapScreenParams = {
  origem: {
    nome: string;
    latitude: number;
    longitude: number;
  };
  destino: {
    nome: string;
    latitude: number;
    longitude: number;
  };
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ProductList: undefined;
  UserList: undefined;
  UserRegister: undefined;
  MovementList: undefined;
  MovementsList: undefined;
  MovementRegister: undefined;
  Map: MapScreenParams;
};

export type LoginScreenProps = StackScreenProps<RootStackParamList, "Login">;
export type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;
export type ProductListScreenProps = StackScreenProps<
  RootStackParamList,
  "ProductList"
>;

export type UserListScreenProps = StackScreenProps<
  RootStackParamList,
  "UserList"
>;

export type UserRegisterScreenProps = StackScreenProps<
  RootStackParamList,
  "UserRegister"
>;

export type MovementListScreenProps = StackScreenProps<
  RootStackParamList,
  "MovementList"
>;

export type MovementsListScreenProps = StackScreenProps<
  RootStackParamList,
  "MovementsList"
>;

export type MapScreenProps = StackScreenProps<RootStackParamList, "Map">;

export type MovementRegisterProps = StackScreenProps<
  RootStackParamList,
  "MovementRegister"
>;
