/**
 * [INPUT]: character { id, name, description }
 * [OUTPUT]: 中文昵称字符串
 * [POS]: 工具函数，被 generate-wechat-screenshot.mjs 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ================================================================
//  昵称生成 — 单字母 ID → 关键词匹配 → 中文昵称
// ================================================================

export function generateNickname(character) {
  if (!/^[A-Za-z]$/.test(character.id)) return character.name;

  const desc = character.description || '';
  const seed = character.id.charCodeAt(0);

  if (/算命|命理|先生|大师|占卜|易|卜/.test(desc)) {
    const pool = ['云归先生', '道一', '玄清', '栖霞先生'];
    return pool[seed % pool.length];
  }
  if (/暗恋|新人|咨询|女|小姐|闺蜜|室友/.test(desc)) {
    const pool = ['小鹿', '阿念', '糖糖', '小柒'];
    return pool[seed % pool.length];
  }
  if (/男|同事|工程师|老板|上司/.test(desc)) {
    const pool = ['阿远', '陆白', '沈默', '林渊'];
    return pool[seed % pool.length];
  }
  const pool = ['小七', '阿远', '默默', '小半'];
  return pool[seed % pool.length];
}
