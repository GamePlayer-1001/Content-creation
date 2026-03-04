/**
 * [INPUT]: 依赖 ConfigManager 读取 schedule.yaml
 * [OUTPUT]: 对外提供 ScheduleEngine 类 (getDayN/getDayType/getPhase/getTodayTasks/getFullSchedule)
 * [POS]: services/ 的排期计算核心, 被 dashboard/schedule 路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const MS_PER_DAY = 86400000;

class ScheduleEngine {
  constructor(configManager) {
    this.config = configManager.read('schedule.yaml');
    this.startDate = new Date(this.config.start_date + 'T00:00:00');
  }

  // --- Day N 计算 ---
  getDayN(date = new Date()) {
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
    const diff = Math.floor((today - start) / MS_PER_DAY) + 1;
    return Math.max(1, diff);
  }

  // --- 星期几 (1=周一 ... 7=周日) ---
  getWeekday(date = new Date()) {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  }

  // --- 日类型判定 ---
  getDayType(date = new Date()) {
    const wd = this.getWeekday(date);
    if (wd === 7) return { type: 'rest', label: '休息日', hours: '0.5h' };
    if (wd === 6) return { type: 'light', label: '轻量日', hours: '1-2h' };
    return { type: 'content', label: '内容日', hours: '3.5-5h' };
  }

  // --- Phase 判定 ---
  getPhase(dayN) {
    if (!this.config.phases) return { phase: 1, label: '冷启动期', focus: '' };
    const phases = this.config.phases;

    if (phases.phase_0 && dayN <= 3) {
      return { phase: 0, label: '弹药准备期', focus: phases.phase_0.focus || '' };
    }
    if (phases.phase_1 && dayN <= 30) {
      return { phase: 1, label: '冷启动期', focus: phases.phase_1.focus || '' };
    }
    return { phase: 2, label: '放大期', focus: phases.phase_2?.focus || '' };
  }

  // --- 今日任务清单 ---
  getTodayTasks(date = new Date()) {
    const dayType = this.getDayType(date);
    const dayN = this.getDayN(date);
    const phase = this.getPhase(dayN);
    const wd = this.getWeekday(date);
    const weekdayNames = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    const tasks = [];

    if (dayType.type === 'content') {
      tasks.push(
        { time: '09:00-09:35', task: '创作母稿', skill: '/母稿', done: false },
        { time: '09:35-09:45', task: '发公众号', skill: '/公众号', done: false },
        { time: '09:55-10:20', task: '发小红书', skill: '/小红书', done: false },
        { time: '10:20-10:30', task: '发即刻', skill: '/即刻', done: false },
        { time: '10:30-10:50', task: '发X推文', skill: '/X推文', done: false },
        { time: '10:50-11:10', task: '全平台互动', skill: null, done: false },
        { time: '12:00', task: '朋友圈(午间)', skill: '/朋友圈', done: false },
        { time: '20:00', task: '朋友圈(晚间)', skill: '/朋友圈', done: false },
      );
      // linuxdo: 冷启动期只互动
      if (dayN > 14 && wd === 4) {
        tasks.push({ time: '14:15-14:40', task: 'linuxdo 技术帖', skill: '/linuxdo', done: false });
      }
    } else if (dayType.type === 'light') {
      tasks.push(
        { time: '灵活', task: '可选发1篇内容', skill: '/母稿', done: false },
        { time: '灵活', task: '朋友圈1条', skill: '/朋友圈', done: false },
        { time: '灵活', task: '私聊3-5人', skill: null, done: false },
      );
    } else {
      tasks.push(
        { time: '灵活', task: '周复盘', skill: '/周复盘', done: false },
        { time: '可选', task: '朋友圈1条', skill: '/朋友圈', done: false },
      );
    }

    return {
      dayN,
      date: date.toISOString().slice(0, 10),
      weekday: weekdayNames[wd],
      dayType,
      phase,
      tasks,
    };
  }

  // --- 完整 60 天排期 ---
  getFullSchedule() {
    const days = [];
    for (let i = 0; i < 60; i++) {
      const date = new Date(this.startDate.getTime() + i * MS_PER_DAY);
      const dayN = i + 1;
      days.push({
        dayN,
        date: date.toISOString().slice(0, 10),
        weekday: this.getWeekday(date),
        dayType: this.getDayType(date),
        phase: this.getPhase(dayN),
      });
    }
    return days;
  }
}

module.exports = ScheduleEngine;
