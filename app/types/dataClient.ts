export type DataClient = {
    fullName: string;
    identification: string;
    value: string | null;
    eps: string | null;
    arl: string | null;
    risk: string | null;
    ccf: string | null;
    pensionFund: string | null;
    observation: string | null;
    paid: 'Pendiente' | 'Pagado';
    datePaidReceived: string | null;
  };