export type TCurrency = {
  id: number;
  name: string;
  exchangeRates: {
    date: string;
    rate: number;
  }[];
};

export type TUser = {
  id: number;
  nickname: string;
  password: string;
  role: 'user' | 'admin';
};
