export enum GamePhase {
    START = 'START',
    CINEMATIC_INTRO = 'CINEMATIC_INTRO',
    READY_SCREEN = 'READY_SCREEN',
    GOAL_INPUT = 'GOAL_INPUT',
    DECRYPTING = 'DECRYPTING',
    MISSION_START = 'MISSION_START',
    CINEMATIC_S = 'CINEMATIC_S',
    CINEMATIC_M = 'CINEMATIC_M',
    CINEMATIC_A = 'CINEMATIC_A',
    CINEMATIC_R = 'CINEMATIC_R',
    CINEMATIC_T = 'CINEMATIC_T',
    CINEMATIC_FINAL = 'CINEMATIC_FINAL',
    VICTORY = 'VICTORY',
}

export type SmartPhaseKey = 'S' | 'M' | 'A' | 'R' | 'T';

export type SmartPlan = {
    [key in SmartPhaseKey]: string | null;
};
