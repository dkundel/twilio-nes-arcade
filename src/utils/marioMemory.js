const MEMORY_BASE_FLAG = 0x7ff;

const COMMON_ADDRESSES = {
  CURRENT_LIVES: 0x075a
};

function readMemory(nes, address) {
  return nes.cpu.mem[address & MEMORY_BASE_FLAG];
}

export function getCurrentLives(nes) {
  return readMemory(nes, COMMON_ADDRESSES.CURRENT_LIVES);
}
