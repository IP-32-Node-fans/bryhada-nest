export type TCurrency = {
  id: number;
  name: string;
};

export type Rate = {
  date: string;
  rate: number;
} & TCurrency;

export type TUser = {
  id: number;
  nickname: string;
  password: string;
  role: 'user' | 'admin';
};
