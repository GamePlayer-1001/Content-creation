/**
 * 代码级文本人话化处理器 v2
 * 三层变换：词汇替换 → 句子重构 → 段落节奏调整
 * 目标：增加文本perplexity和burstiness，降低AI检测率
 */

// ========== 第一层：词汇替换 ==========

const AI_WORDS = [
  ['赋能', '帮助'], ['共振', '共鸣'], ['深邃', '深'],
  ['璀璨', '亮眼'], ['绽放', '出现'], ['涅槃', '重生'],
  ['启迪', '启发'], ['沉淀', '积累'], ['升华', '提升'],
  ['洗礼', '考验'], ['蜕变', '转变'], ['觉醒', '醒悟'],
  ['顿悟', '想通'], ['底层逻辑', '基本道理'], ['范式', '模式'],
  ['维度', '角度'], ['闭环', '完整流程'], ['抓手', '切入点'],
  ['打法', '做法'], ['颗粒度', '细致程度'], ['拉齐', '统一'],
  ['对齐', '同步'], ['生态', '环境'], ['链路', '流程'],
  ['势能', '潜力'], ['心智', '认知'], ['赛道', '领域'],
  ['破圈', '出圈'], ['内卷', '竞争'], ['降本增效', '省钱提效'],
];

const FORMAL_MAP = [
  ['然而', ['但是', '不过', '但']],
  ['因此', ['所以', '于是']],
  ['此外', ['另外', '还有']],
  ['与此同时', ['同时']],
  ['显著', ['明显']],
  ['至关重要', ['特别重要', '很关键']],
  ['不可否认', ['确实']],
  ['毋庸置疑', ['肯定的']],
  ['值得注意的是', ['有意思的是']],
  ['值得一提的是', ['顺带一说']],
  ['综上所述', ['总之']],
  ['总而言之', ['说白了']],
  ['本质上', ['说到底']],
  ['实际上', ['其实']],
  ['一般来说', ['大多数时候']],
  ['众所周知', ['大家都知道']],
  ['不言而喻', ['不用多说']],
  ['事实上', ['其实']],
  ['显而易见', ['明摆着']],
  ['不仅如此', ['而且']],
  ['换言之', ['说直白点']],
  ['这意味着', ['也就是说']],
  ['在一定程度上', ['多少']],
  ['从某种意义上说', ['换个角度看']],
  ['需要指出的是', ['得说一句']],
  ['不难发现', ['你看']],
  ['深深地', ['特别']],
  ['真正地', ['真的']],
  ['完全地', ['完全']],
  ['进而', ['然后']],
  ['势必', ['肯定会']],
  ['亟需', ['急需']],
  ['尤为', ['特别']],
  ['日益', ['越来越']],
  ['逐步', ['慢慢']],
  ['不断', ['一直在']],
  ['充分', ['好好']],
  ['有效地', ['真的能']],
  ['显然', ['明摆着']],
  ['无疑', ['肯定']],
];

// ========== 第二层：句子级变换 ==========

const FRAGMENTS = ['真的。', '没错。', '就这样。', '对。', '懂了吧。', '就是这么回事。'];
const STARTERS = ['说真的，', '坦白讲，', '怎么说呢，', '话说回来，', '说实话，', '不瞒你说，', '你别说，'];
const ASIDES = ['——我没夸张——', '——说白了——', '——你品品——', '——认真的——'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(p) {
  return Math.random() < p;
}

/**
 * 对一个段落做句子级变换
 */
function transformParagraph(para) {
  // 按句号/问号/叹号切分句子（保留标点）
  const sentences = para.match(/[^。！？]+[。！？]/g);
  if (!sentences || sentences.length === 0) return para;

  const result = [];

  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i].trim();
    if (!s) continue;

    // 变换1：长句拆分（在逗号处断开，20%概率）
    if (s.length > 30 && rand(0.2)) {
      const commaPositions = [];
      for (let j = 0; j < s.length; j++) {
        if (s[j] === '，') commaPositions.push(j);
      }
      if (commaPositions.length >= 2) {
        const splitAt = commaPositions[Math.floor(commaPositions.length / 2)];
        result.push(s.slice(0, splitAt) + '。');
        result.push(s.slice(splitAt + 1));
        continue;
      }
    }

    // 变换2：短句合并（用破折号连接，15%概率）
    if (s.length < 18 && i + 1 < sentences.length && sentences[i + 1].trim().length < 18 && rand(0.15)) {
      const next = sentences[i + 1].trim();
      result.push(s.replace(/[。]$/, '——') + next);
      i++;
      continue;
    }

    // 变换3：句中插入口语碎片（10%概率）
    if (s.length > 20 && s.includes('，') && rand(0.1)) {
      const commaIdx = s.indexOf('，');
      s = s.slice(0, commaIdx + 1) + pick(ASIDES) + s.slice(commaIdx + 1);
    }

    // 变换4：句后加碎片短句（8%概率）
    if (rand(0.08)) {
      result.push(s);
      result.push(pick(FRAGMENTS));
      continue;
    }

    result.push(s);
  }

  return result.join('');
}

// ========== 第三层：段落节奏调整 ==========

function adjustParagraphRhythm(paragraphs) {
  const result = [];
  let contentCount = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];

    // 跳过标题、图片、列表等
    if (!p.trim() || p.startsWith('#') || p.includes('<!-- IMAGE:') ||
        p.startsWith('-') || p.startsWith('*') || p.startsWith('>') || p.startsWith('|')) {
      result.push(p);
      contentCount = 0;
      continue;
    }

    contentCount++;

    // 每4-6个正文段落，在前面加口语开头
    if (contentCount > 0 && contentCount % (4 + Math.floor(Math.random() * 3)) === 0) {
      result.push(pick(STARTERS) + p);
      continue;
    }

    // 如果段落特别长（>150字），30%概率拆成两段
    if (p.length > 150 && rand(0.3)) {
      const sents = p.match(/[^。！？]+[。！？]/g);
      if (sents && sents.length >= 3) {
        const splitAt = Math.floor(sents.length / 2);
        result.push(sents.slice(0, splitAt).join(''));
        result.push(sents.slice(splitAt).join(''));
        continue;
      }
    }

    result.push(p);
  }

  return result;
}

// ========== 主函数 ==========

export function humanizeText(text) {
  if (!text) return text;
  let r = text;

  // 第一层：词汇替换
  for (const [w, rep] of AI_WORDS) {
    r = r.replaceAll(w, rep);
  }
  for (const [formal, alts] of FORMAL_MAP) {
    r = r.replace(new RegExp(formal, 'g'), () => pick(alts));
  }

  // 删除AI八股开头
  r = r.replace(/^(#{1,3}\s+.+\n+)?(在当今|随着.{2,8}的(发展|普及|兴起|崛起))/, '$1');

  // 第二层：句子级变换（逐段处理）
  const lines = r.split('\n');
  const transformed = lines.map(line => {
    if (!line.trim() || line.startsWith('#') || line.includes('<!-- IMAGE:') ||
        line.startsWith('-') || line.startsWith('*') || line.startsWith('>') || line.startsWith('|')) {
      return line;
    }
    return transformParagraph(line);
  });

  // 第三层：段落节奏调整
  const final = adjustParagraphRhythm(transformed);

  return final.join('\n');
}
