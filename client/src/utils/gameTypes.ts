export interface PieceProps {
  color: string;
  square: string;
  type: string;
}

export interface UpdateGameProps {
  board: any;
  pendingPromotion: PendingPromoProps;
}

export type PendingPromoProps = {
  from: string;
  to: string;
  color: any;
};
