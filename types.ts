export interface RollData {
  roll: number;
  face_down: number;
  hamiltonian: number;
  roll_cos: number;
  face_down_cos: number;
  roll_parity: 'par' | 'impar';
  face_down_parity: 'par' | 'impar';
  waveFunction: number[];
  qubitState: string;
  qec?: {
    physicalRolls: number[];
    errorOccurred: boolean;
    wasCorrected: boolean;
  }
}
