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

export interface Timer {
  currentUserTimeMinutes: number;
  currentUserTimeSeconds: number;
  opponentTimeMinutes: number;
  opponentTimeSeconds: number;
  currentUserPlaying: boolean;
  opponentPlaying: boolean;
}
