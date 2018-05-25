const MEMORY_BASE_FLAG = 0x7ff;

const COMMON_ADDRESSES = {
  CURRENT_LIVES: 0x075a,
  TIME_2: 0x07f8,
  TIME_1: 0x07f9,
  TIME_0: 0x07fa,
  SCORE_5: 0x07d8,
  SCORE_4: 0x07d9,
  SCORE_3: 0x07da,
  SCORE_2: 0x07db,
  SCORE_1: 0x07dc,
  COINS_1: 0x07ed,
  COINS_0: 0x07ee
};

function read(nes, address) {
  return nes.cpu.mem[address & MEMORY_BASE_FLAG];
}

export function getCurrentLives(nes) {
  return read(nes, COMMON_ADDRESSES.CURRENT_LIVES);
}

export function getTime(nes) {
  const time2 = read(nes, COMMON_ADDRESSES.TIME_2) * 1e2;
  const time1 = read(nes, COMMON_ADDRESSES.TIME_1) * 1e1;
  const time0 = read(nes, COMMON_ADDRESSES.TIME_0) * 1;
  const time = time2 + time1 + time0;
  return time;
}

export function getScore(nes) {
  const score5 = read(nes, COMMON_ADDRESSES.SCORE_5) * 1e5;
  const score4 = read(nes, COMMON_ADDRESSES.SCORE_4) * 1e4;
  const score3 = read(nes, COMMON_ADDRESSES.SCORE_3) * 1e3;
  const score2 = read(nes, COMMON_ADDRESSES.SCORE_2) * 1e2;
  const score1 = read(nes, COMMON_ADDRESSES.SCORE_1) * 1e1;
  return score5 + score4 + score3 + score2 + score1;
}

export function getCoins(nes) {
  const coins1 = read(nes, COMMON_ADDRESSES.COINS_1) * 1e1;
  const coins0 = read(nes, COMMON_ADDRESSES.COINS_0) * 1;
  return coins1 + coins0;
}
