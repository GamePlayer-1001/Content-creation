/**
 * [INPUT]: 依赖 ConfigManager 读取 compliance.yaml
 * [OUTPUT]: 对外提供 ComplianceEngine 类 (check 方法, 6维扫描)
 * [POS]: services/ 的合规规则引擎, 被 compliance 路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

class ComplianceEngine {
  constructor(configManager) {
    this.configManager = configManager;
    this._rules = null;
  }

  // --- 加载规则（惰性，首次调用时从 YAML 解析）---
  _loadRules() {
    if (this._rules) return this._rules;

    const raw = this.configManager.read('compliance.yaml');
    this._rules = raw;
    return this._rules;
  }

  // --- 主扫描方法：6 维全量检查 ---
  check(text) {
    const rules = this._loadRules();
    const results = {
      score: 100,
      dimensions: [],
      hits: [],
      summary: '',
    };

    // 1. 敏感词黑名单
    const d1 = this._checkBlacklist(text, rules.blacklist || {});
    results.dimensions.push(d1);

    // 2. 功效暗示红线
    const d2 = this._checkEfficacy(text, rules.efficacy_patterns || {});
    results.dimensions.push(d2);

    // 3. 导流行为
    const d3 = this._checkDiversion(text, rules.anti_diversion || {});
    results.dimensions.push(d3);

    // 4. 谨慎词频率
    const d4 = this._checkCaution(text, rules.caution_words || {});
    results.dimensions.push(d4);

    // 5. 内容真实性
    const d5 = this._checkAuthenticity(text, rules.authenticity || {});
    results.dimensions.push(d5);

    // 6. 不当行为
    const d6 = this._checkBehavior(text, rules.behavior || {});
    results.dimensions.push(d6);

    // 汇总命中
    for (const d of results.dimensions) {
      results.hits.push(...d.hits);
      results.score -= d.deduction;
    }
    results.score = Math.max(0, results.score);

    // 生成摘要
    const critical = results.dimensions.filter(d => d.hits.length > 0);
    if (critical.length === 0) {
      results.summary = '内容合规，未发现风险项。';
    } else {
      results.summary = `发现 ${results.hits.length} 个风险项，涉及 ${critical.map(d => d.name).join('、')}。`;
    }

    return results;
  }

  // --- 维度 1：敏感词黑名单 ---
  _checkBlacklist(text, blacklist) {
    const dim = { name: '敏感词黑名单', hits: [], deduction: 0 };
    const categories = { political: '政治安全', superstition: '迷信玄学', commercial: '商业导流', prohibited: '违禁物品', vulgar: '色情低俗' };

    for (const [cat, label] of Object.entries(categories)) {
      const words = blacklist[cat] || [];
      for (const word of words) {
        const positions = this._findAll(text, word);
        if (positions.length > 0) {
          dim.hits.push({ word, category: label, severity: 'critical', count: positions.length, positions });
          dim.deduction += 20;
        }
      }
    }
    return dim;
  }

  // --- 维度 2：功效暗示红线 ---
  _checkEfficacy(text, patterns) {
    const dim = { name: '功效暗示红线', hits: [], deduction: 0 };
    const forbidden = patterns.forbidden || [];
    const alternatives = patterns.safe_alternatives || [];

    for (const phrase of forbidden) {
      // 去掉括号中的注释部分进行匹配
      const cleanPhrase = phrase.replace(/（.*?）/g, '').trim();
      if (!cleanPhrase) continue;

      const positions = this._findAll(text, cleanPhrase);
      if (positions.length > 0) {
        dim.hits.push({
          word: phrase,
          category: '功效暗示',
          severity: 'warning',
          count: positions.length,
          positions,
          suggestion: alternatives[Math.floor(Math.random() * alternatives.length)] || '改用客观描述',
        });
        dim.deduction += 10;
      }
    }
    return dim;
  }

  // --- 维度 3：导流行为 ---
  _checkDiversion(text, rules) {
    const dim = { name: '导流行为', hits: [], deduction: 0 };
    const forbidden = rules.forbidden || [];

    for (const word of forbidden) {
      const positions = this._findAll(text, word);
      if (positions.length > 0) {
        dim.hits.push({ word, category: '导流行为', severity: 'critical', count: positions.length, positions });
        dim.deduction += 15;
      }
    }
    return dim;
  }

  // --- 维度 4：谨慎词频率 ---
  _checkCaution(text, rules) {
    const dim = { name: '谨慎词频率', hits: [], deduction: 0 };
    const maxPer = rules.max_per_post || 3;
    const words = rules.words || [];

    for (const word of words) {
      const positions = this._findAll(text, word);
      if (positions.length > maxPer) {
        dim.hits.push({
          word,
          category: '谨慎词超频',
          severity: 'warning',
          count: positions.length,
          positions,
          suggestion: `出现 ${positions.length} 次，建议不超过 ${maxPer} 次`,
        });
        dim.deduction += 5;
      }
    }
    return dim;
  }

  // --- 维度 5：内容真实性 ---
  _checkAuthenticity(text, rules) {
    const dim = { name: '内容真实性', hits: [], deduction: 0 };
    const forbidden = rules.forbidden_claims || [];
    const safe = rules.safe_framing || [];

    for (const claim of forbidden) {
      const positions = this._findAll(text, claim);
      if (positions.length > 0) {
        dim.hits.push({
          word: claim,
          category: '真实性声明',
          severity: 'warning',
          count: positions.length,
          positions,
          suggestion: safe[0] || '改用创作/故事等框架',
        });
        dim.deduction += 8;
      }
    }
    return dim;
  }

  // --- 维度 6：不当行为 ---
  _checkBehavior(text, rules) {
    const dim = { name: '不当行为', hits: [], deduction: 0 };
    const categories = { unfriendly: '不友善行为', fraud: '虚假信息', cheating: '作弊行为' };

    for (const [cat, label] of Object.entries(categories)) {
      const words = rules[cat] || [];
      for (const word of words) {
        const positions = this._findAll(text, word);
        if (positions.length > 0) {
          dim.hits.push({ word, category: label, severity: 'critical', count: positions.length, positions });
          dim.deduction += 12;
        }
      }
    }
    return dim;
  }

  // --- 文本中查找所有出现位置 ---
  _findAll(text, keyword) {
    const positions = [];
    let idx = 0;
    while ((idx = text.indexOf(keyword, idx)) !== -1) {
      positions.push(idx);
      idx += keyword.length;
    }
    return positions;
  }

  // --- 强制刷新规则缓存 ---
  reload() {
    this._rules = null;
  }
}

module.exports = ComplianceEngine;
